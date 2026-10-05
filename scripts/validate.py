"""Validate the hub's local links, metadata and resource contract using stdlib."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
errors = []
for path in root.rglob('*.md'):
    content = path.read_text()
    # Code fences contain generated target paths, not links in the hub.
    prose = re.sub(r'```.*?```', '', content, flags=re.S)
    for link in re.findall(r'(?<!!)\[[^\]]+\]\(([^\s)]+)\)', prose):
        if '://' in link or link.startswith(('#', 'mailto:')):
            continue
        if path.parent == root / 'templates' and link == './references/patterns.md':
            continue  # Created alongside the generated skill, not inside templates/.
        local = link.split('#')[0]
        if local and not (path.parent / local).exists():
            errors.append(f'{path.relative_to(root)}: broken link {link}')
    if path.name == 'SKILL.md' or path.name.endswith('.agent.md'):
        match = re.match(r'^---\n(.*?)\n---\n', content, re.S)
        if not match:
            errors.append(f'{path.relative_to(root)}: missing frontmatter')
        elif not all(re.search(rf'^{key}:\s*\S', match[1], re.M) for key in ('name', 'description')):
            errors.append(f'{path.relative_to(root)}: missing name or description')
    if any(bad in content for bad in ('!===' , 'aria-describedBy=', 'tab-index=')):
        errors.append(f'{path.relative_to(root)}: invalid example syntax')
setup = (root / 'agents/copilot-setup/copilot-setup.agent.md').read_text()
for name in re.findall(r'\.github/templates/([\w.-]+)', setup):
    if not (root / 'templates' / name).is_file():
        errors.append(f'Setup references missing template: {name}')
skills = sorted(p.parent.name for p in (root / 'skills').glob('*/SKILL.md'))
if len(skills) != 8:
    errors.append(f'Expected eight skills, found {len(skills)}')
for skill in skills:
    if not re.search(rf'^\|\s*{re.escape(skill)}\s*\|', setup, re.M):
        errors.append(f'Setup catalog missing {skill}')
for path in (root / 'templates').glob('*.md'):
    if re.search(r'\{\s+\{', path.read_text()):
        errors.append(f'{path.name}: malformed placeholder')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'Validation passed: {len(skills)} skills, local links, frontmatter and template contract.')
