"""Read-only diagnosis of installed resources, drift, placeholders and local links."""
import argparse
import json
from pathlib import Path
import re
from hub_resources import STATE, digest, resources, safe_path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('project', type=Path)
    args = parser.parse_args()
    root = args.project.resolve()
    issues = []
    try:
        state = json.loads(safe_path(root, STATE).read_text())
        _, _, expected = resources(state['profile'], state['capabilities'])
        print(f'Profile: {state["profile"]}; version: {state["version"]}; source: {state.get("source_commit") or "archive/unknown"}')
        for name, checksum in state['files'].items():
            if not name.startswith(('.github/agents/', '.github/skills/', '.github/templates/')):
                raise ValueError(f'Invalid managed path: {name}')
            path = safe_path(root, name)
            if not path.exists():
                issues.append('Missing: ' + name)
            elif digest(path.read_bytes()) != checksum:
                issues.append('Locally modified: ' + name)
            if name not in expected:
                issues.append('Obsolete managed resource: ' + name)
        for name in set(expected) - set(state['files']):
            issues.append('Untracked required resource: ' + name)
        for name in set(expected) & set(state['files']):
            if digest(expected[name]) != state['files'][name]:
                issues.append('Hub update available: ' + name)
        for folder in ('agents', 'skills', 'templates'):
            directory = root / '.github' / folder
            if directory.is_symlink():
                raise ValueError(f'Symlink folder: {directory}')
            for path in directory.rglob('*'):
                if path.is_symlink():
                    issues.append('Symlink resource: ' + str(path.relative_to(root)))
                elif path.is_file() and path.relative_to(root).as_posix() not in state['files']:
                    issues.append('Unmanaged resource (review, do not delete): ' + str(path.relative_to(root)))
        generated = [root / '.github/copilot-instructions.md', root / 'AGENTS.md']
        paths = [safe_path(root, n) for n in state['files'] if n.endswith('.md') and '/templates/' not in n] + generated
        for path in paths:
            if not path.is_file() or path.is_symlink():
                continue
            content = path.read_text()
            if re.search(r'\{\{[A-Z][A-Z0-9_]*\}\}', content):
                issues.append('Unresolved placeholder: ' + str(path.relative_to(root)))
            prose = re.sub(r'```.*?```', '', content, flags=re.S)
            for link in re.findall(r'\[[^\]]+\]\(([^\s)]+)\)', prose):
                if '://' not in link and not link.startswith(('#', 'mailto:')) and not (path.parent / link.split('#')[0]).exists():
                    issues.append(f'Broken link in {path.relative_to(root)}: {link}')
        if not generated[0].exists():
            issues.append('Instructions not generated yet; run the installed setup agent')
        if (root / '.hub-ai-transaction.json').exists() or (root / '.hub-ai-install.lock').exists():
            issues.append('Installation locked/interrupted; inspect and recover')
    except (OSError, ValueError, KeyError) as error:
        issues.append(str(error))
    for issue in issues:
        print(issue)
    if issues:
        raise SystemExit(1)
    print('Installation is consistent with this hub; executor behavior is not certified.')


if __name__ == '__main__':
    main()
