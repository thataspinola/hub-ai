"""Shared profile loading and path checks; no external runtime dependencies."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
STATE = '.github/hub-ai-lock.json'


def digest(data):
    return hashlib.sha256(data).hexdigest()


def safe_path(root, relative):
    rel = Path(relative)
    if rel.is_absolute() or '..' in rel.parts:
        raise ValueError(f'Unsafe relative path: {relative}')
    dest = root / rel
    for ancestor in [dest, *dest.parents]:
        if ancestor == root:
            break
        if ancestor.is_symlink():
            raise ValueError(f'Symlink destination is not supported: {ancestor}')
        if ancestor != dest and ancestor.exists() and not ancestor.is_dir():
            raise ValueError(f'Destination parent is not a directory: {ancestor}')
    if dest.exists() and not dest.is_file():
        raise ValueError(f'Destination is not a regular file: {dest}')
    return dest


def resources(profile, capabilities=None):
    manifest = json.loads((ROOT / f'profiles/{profile}/profile.json').read_text())
    available = manifest.get('capabilities', {})
    selected = list(available) if capabilities is None else capabilities
    unknown = set(selected) - set(available)
    if unknown:
        raise ValueError(f'Unknown capabilities: {sorted(unknown)}')
    spec = {kind: list(manifest[kind]) for kind in ('agents', 'skills', 'templates')}
    for name in selected:
        for kind, items in available[name].items():
            spec[kind] += items
    result = {}
    for kind, items in spec.items():
        for item in items:
            source = ROOT / item
            if not source.exists() or source.is_symlink():
                raise ValueError(f'Missing/invalid resource: {item}')
            paths = list(source.rglob('*')) if kind == 'skills' else [source]
            if kind == 'skills' and not (source / 'SKILL.md').is_file():
                raise ValueError(f'Missing skill metadata: {item}')
            for path in paths:
                if not path.is_file():
                    continue
                if path.is_symlink() or not path.resolve().is_relative_to(ROOT):
                    raise ValueError(f'Unsafe resource: {path}')
                relative = (Path('.github/skills') / source.name / path.relative_to(source)) if kind == 'skills' else Path(f'.github/{kind}') / path.name
                key = relative.as_posix()
                if key in result:
                    raise ValueError(f'Duplicate destination: {key}')
                result[key] = path.read_bytes()
    return manifest, selected, result
