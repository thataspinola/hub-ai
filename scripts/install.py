"""Copy hub resources into a project without silently replacing local changes."""
import argparse
from pathlib import Path
import shutil
import json


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('project', type=Path)
    parser.add_argument('--profile', choices=('frontend', 'node'), default='frontend', help='Resource profile; default preserves the frontend installation')
    parser.add_argument('--overwrite', action='store_true', help='Replace conflicting files after reviewing local changes')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    target = args.project.resolve()
    if not target.is_dir() or target == root:
        parser.error('Choose an existing project directory different from the hub')
    if args.profile == 'frontend':
        mappings = [(p, target / '.github/agents' / p.name) for p in (root / 'agents').glob('*/*.agent.md')]
        for folder in ('skills', 'templates'):
            mappings += [(p, target / '.github' / p.relative_to(root)) for p in (root / folder).rglob('*') if p.is_file()]
        setup_name = 'Copilot Setup'
    else:
        profile = json.loads((root / 'profiles/node/profile.json').read_text())
        mappings = [(root / item, target / '.github/agents' / Path(item).name) for item in profile['agents']]
        mappings += [(root / item, target / '.github/templates' / Path(item).name) for item in profile['templates']]
        for item in profile['skills']:
            source = root / item
            mappings += [(p, target / '.github/skills' / source.name / p.relative_to(source)) for p in source.rglob('*') if p.is_file()]
        setup_name = 'Node Setup'
    if len({dest for _, dest in mappings}) != len(mappings):
        parser.error('Duplicate resource destination in profile')
    if any(not source.is_file() for source, _ in mappings):
        parser.error('Missing profile resource; run scripts/validate.py')
    for _, dest in mappings:
        if not dest.resolve().is_relative_to(target):
            parser.error(f'Destination escapes project through a symlink: {dest}')
    conflicts = [str(dest) for source, dest in mappings if dest.exists() and (not dest.is_file() or source.read_bytes() != dest.read_bytes())]
    if conflicts and not args.overwrite:
        parser.error('No files copied. Conflicts:\n' + '\n'.join(conflicts))
    for source, dest in mappings:
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, dest)
    print(f'Installed {len(mappings)} resource files in {target / ".github"}. Select {setup_name} to adapt them.')


if __name__ == '__main__':
    main()
