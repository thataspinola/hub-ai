"""Install, preview or migrate versioned hub resources with recoverable writes."""
import argparse
import base64
import difflib
import json
import os
from pathlib import Path
import subprocess
import tempfile
from hub_resources import ROOT, STATE, digest, resources, safe_path

JOURNAL = '.hub-ai-transaction.json'
LOCK = '.hub-ai-install.lock'


def atomic_write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix='.hub-ai-', dir=path.parent)
    try:
        with os.fdopen(fd, 'wb') as stream:
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)  # Replace the entry; never mutate a hard-linked inode.
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def recover(target):
    journal = safe_path(target, JOURNAL)
    if not journal.exists():
        return False
    snapshots = json.loads(journal.read_text())['before']
    # Validate the entire journal before restoring anything.
    decoded = {}
    for name, encoded in snapshots.items():
        safe_path(target, name)
        decoded[name] = None if encoded is None else base64.b64decode(encoded, validate=True)
    for name, encoded in reversed(list(snapshots.items())):
        dest = safe_path(target, name)
        if encoded is None:
            dest.unlink(missing_ok=True)
        else:
            atomic_write(dest, decoded[name])
    journal.unlink()
    return True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('project', type=Path)
    parser.add_argument('--profile', choices=tuple(p.parent.name for p in sorted(ROOT.glob('profiles/*/profile.json'))), default='frontend')
    parser.add_argument('--capabilities', help='Comma-separated optional capabilities; base selects none, omitted selects all')
    parser.add_argument('--overwrite', action='store_true', help='Replace conflicting selected resources')
    parser.add_argument('--migrate', action='store_true', help='Remove obsolete managed files only if locally unchanged')
    parser.add_argument('--dry-run', action='store_true', help='Preview actions and text diffs without writing')
    parser.add_argument('--recover', action='store_true', help='Restore an interrupted transaction, without installing')
    args = parser.parse_args()
    if args.recover and args.dry_run:
        parser.error('--recover and --dry-run cannot be combined')
    target = args.project.resolve()
    if not target.is_dir() or target == ROOT or target.is_relative_to(ROOT):
        parser.error('Choose an existing project outside the hub')
    try:
        journal = safe_path(target, JOURNAL)
        lock = safe_path(target, LOCK)
        if args.recover:
            if lock.exists():
                pid = int(lock.read_text())
                try:
                    os.kill(pid, 0)
                except ProcessLookupError:
                    lock.unlink()
                else:
                    raise ValueError('Installer process is still running; recovery refused')
            fd = os.open(lock, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
            with os.fdopen(fd, 'w') as stream:
                stream.write(str(os.getpid()))
            try:
                print('Recovered interrupted transaction' if recover(target) else 'No transaction to recover')
            finally:
                lock.unlink(missing_ok=True)
            return
        if journal.exists() or lock.exists():
            raise ValueError('Installation locked/interrupted; inspect process and run --recover')
        capabilities = None if args.capabilities is None else ([] if args.capabilities == 'base' else args.capabilities.split(','))
        manifest, selected, files = resources(args.profile, capabilities)
        state_path = safe_path(target, STATE)
        previous = json.loads(state_path.read_text()) if state_path.exists() else {'files': {}}
        if previous.get('schema', 1) != 1:
            raise ValueError('Unsupported installation state schema')
        old = previous['files']
        # State is untrusted project input: only managed resource locations may be removed.
        for name in old:
            if not name.startswith(('.github/agents/', '.github/skills/', '.github/templates/')):
                raise ValueError(f'Invalid managed path: {name}')
            safe_path(target, name)
        obsolete = set(old) - set(files)
        conflicts = []
        operations = {}
        for name, data in files.items():
            dest = safe_path(target, name)
            if dest.exists() and dest.read_bytes() == data:
                continue
            if dest.exists() and not args.overwrite:
                conflicts.append(name)
            operations[name] = data
        if args.migrate:
            for name in sorted(obsolete):
                dest = safe_path(target, name)
                if dest.exists() and digest(dest.read_bytes()) != old[name]:
                    conflicts.append(f'{name} (obsolete local customization; migration preserves it by refusing)')
                elif dest.exists():
                    operations[name] = None
        elif obsolete:
            print('Obsolete resources retained; use --migrate after reviewing: ' + ', '.join(sorted(obsolete)))
        for name, data in operations.items():
            dest = safe_path(target, name)
            print(('REMOVE ' if data is None else 'UPDATE ' if dest.exists() else 'ADD ') + name)
            if args.dry_run:
                before = dest.read_text() if dest.exists() else ''
                after = '' if data is None else data.decode()
                print(''.join(difflib.unified_diff(before.splitlines(True), after.splitlines(True), fromfile=name, tofile=name)), end='')
        if conflicts:
            raise ValueError('No files written. Conflicts:\n' + '\n'.join(conflicts))
        if args.dry_run:
            print('Preview complete; no files written')
            return
        commit = subprocess.run(['git', '-C', str(ROOT), 'rev-parse', 'HEAD'], capture_output=True, text=True)
        managed = {} if args.migrate else dict(old)
        managed.update({name: digest(data) for name, data in files.items()})
        state = {'schema': 1, 'version': (ROOT / 'VERSION').read_text().strip(), 'source_commit': commit.stdout.strip() if commit.returncode == 0 else None, 'profile': args.profile, 'capabilities': selected, 'files': managed}
        operations[STATE] = (json.dumps(state, indent=2, sort_keys=True) + '\n').encode()
        snapshots = {name: base64.b64encode(safe_path(target, name).read_bytes()).decode() if safe_path(target, name).exists() else None for name in operations}
        fd = os.open(lock, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, 'w') as stream:
            stream.write(str(os.getpid()))
        try:
            atomic_write(journal, (json.dumps({'before': snapshots}) + '\n').encode())
            try:
                for name, data in operations.items():
                    dest = safe_path(target, name)
                    if data is None:
                        dest.unlink()
                    else:
                        atomic_write(dest, data)
                journal.unlink()
            except BaseException:
                recover(target)
                raise
        finally:
            lock.unlink(missing_ok=True)
        print(f'Installed {args.profile} {state["version"]}; select {manifest["setup"]}.')
    except (ValueError, OSError, KeyError, json.JSONDecodeError) as error:
        parser.error(str(error))


if __name__ == '__main__':
    main()
