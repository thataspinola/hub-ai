"""Validate YAML, unique names, profiles, links and agent-resource references."""
from pathlib import Path
import re
import json
import yaml
from hub_resources import ROOT, resources

errors = []
names = {}
for path in ROOT.rglob('*.md'):
    if any(x in path.parts for x in ('node_modules', '.git')):
        continue
    content = path.read_text()
    prose = re.sub(r'```.*?```', '', content, flags=re.S)
    for link in re.findall(r'(?<!!)\[[^\]]+\]\(([^\s)]+)\)', prose):
        if '://' in link or link.startswith(('#', 'mailto:')):
            continue
        if path.parent == ROOT / 'templates' and link == './references/patterns.md':
            continue
        if not (path.parent / link.split('#')[0]).exists():
            errors.append(f'{path.relative_to(ROOT)}: broken link {link}')
    if path.name == 'SKILL.md' or path.name.endswith('.agent.md'):
        match = re.match(r'^---\n(.*?)\n---\n', content, re.S)
        try:
            if not match:
                raise ValueError('Missing frontmatter')
            metadata = yaml.safe_load(match[1])
            if not isinstance(metadata, dict) or not all(isinstance(metadata.get(k), str) and metadata[k].strip() for k in ('name', 'description')):
                raise ValueError('name and description must be nonempty strings')
            if 'templates' not in path.parts:
                name = metadata['name']
                if path.name == 'SKILL.md' and (not re.fullmatch(r'[a-z0-9-]{1,64}', name) or name != path.parent.name):
                    raise ValueError('Invalid skill name/directory')
                category = 'skill' if path.name == 'SKILL.md' else 'agent'
                if (category, name) in names:
                    raise ValueError(f'Duplicate {category} name: {name}')
                names[category, name] = path
                if category == 'agent' and (not isinstance(metadata.get('tools'), list) or not all(isinstance(x, str) for x in metadata['tools'])):
                    raise ValueError('Agent tools must be a list of strings')
        except (ValueError, yaml.YAMLError) as error:
            errors.append(f'{path.relative_to(ROOT)}: {error}')
    if any(bad in content for bad in ('!===' , 'aria-describedBy=', 'tab-index=')):
        errors.append(f'{path.relative_to(ROOT)}: invalid example syntax')
    if 'templates' in path.parts and re.search(r'\{\s+\{', content):
        errors.append(f'{path.relative_to(ROOT)}: malformed placeholder')
for manifest_path in ROOT.glob('profiles/*/profile.json'):
    try:
        manifest, _, installed = resources(manifest_path.parent.name)
        if manifest['name'] != manifest_path.parent.name:
            raise ValueError('Manifest name does not match profile directory')
        available = {Path(n).parent.name for n in installed if n.startswith('.github/skills/') and n.endswith('/SKILL.md')}
        setup_paths = [ROOT / n for n in manifest['agents'] if yaml.safe_load((ROOT / n).read_text().split('---')[1])['name'] == manifest['setup']]
        if len(setup_paths) != 1:
            raise ValueError('Exactly one setup agent is required')
        setup = setup_paths[0].read_text()
        for name in available:
            if not re.search(rf'^\|\s*`?{re.escape(name)}`?\s*\|', setup, re.M):
                errors.append(f'{manifest["name"]}: setup catalog missing {name}')
        for agent in manifest['agents']:
            text = (ROOT / agent).read_text()
            for name in re.findall(r'\.github/templates/([\w.-]+)', text):
                if f'.github/templates/{name}' not in installed:
                    errors.append(f'{agent}: references missing template {name}')
            for name in re.findall(r'\bnode-[a-z-]+\b', text):
                if name in ('node-setup', 'node-code-reviewer', 'node-instructions') or name.endswith('-'):
                    continue
                if name not in available and name not in ('node-architecture',):
                    errors.append(f'{agent}: references missing skill {name}')
    except (ValueError, KeyError, OSError, json.JSONDecodeError) as error:
        errors.append(f'{manifest_path}: {error}')
for path in [ROOT / '.gitlab-ci.yml']:
    try:
        if not isinstance(yaml.safe_load(path.read_text()), dict):
            errors.append(f'{path}: workflow must be a mapping')
    except yaml.YAMLError as error:
        errors.append(f'{path}: {error}')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'Validated {len(names)} unique skills/agents, YAML, links and profile contracts.')
