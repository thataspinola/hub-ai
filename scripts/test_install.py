"""Exercise both profile installations and preservation of local project rules."""
from pathlib import Path
import subprocess
import tempfile
import unittest

INSTALL = Path(__file__).with_name('install.py').resolve()


class InstallTests(unittest.TestCase):
    def run_install(self, target, *args):
        return subprocess.run(['python3', str(INSTALL), str(target), *args], capture_output=True, text=True)

    def test_profiles_and_repeat_install(self):
        for profile, agent, count in [('frontend', 'copilot-setup', 8), ('node', 'node-setup', 8)]:
            with self.subTest(profile=profile), tempfile.TemporaryDirectory() as tmp:
                target = Path(tmp)
                self.assertEqual(self.run_install(target, '--profile', profile).returncode, 0)
                self.assertTrue((target / f'.github/agents/{agent}.agent.md').exists())
                self.assertEqual(len(list((target / '.github/skills').glob('*/SKILL.md'))), count)
                self.assertEqual(self.run_install(target, '--profile', profile).returncode, 0)
                self.assertFalse((target / '.github/copilot-instructions.md').exists())
                if profile == 'node':
                    self.assertFalse((target / '.github/agents/code-reviewer.agent.md').exists())
                    self.assertFalse((target / '.github/skills/acessibility').exists())
                    self.assertTrue((target / '.github/skills/node-e2e/assets/e2e-plan.md').exists())
                    self.assertTrue((target / '.github/skills/node-automated-testing/references/matrix.md').exists())

    def test_conflicts_preserve_every_file_until_explicit_overwrite(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp)
            instructions = target / '.github/copilot-instructions.md'
            instructions.parent.mkdir()
            instructions.write_text('project rules')
            agents = target / 'AGENTS.md'
            agents.write_text('domain rules')
            self.assertEqual(self.run_install(target, '--profile', 'node').returncode, 0)
            resource = target / '.github/agents/node-setup.agent.md'
            resource.write_text('local customization')
            missing = target / '.github/templates/node-instructions.md'
            missing.unlink()
            self.assertNotEqual(self.run_install(target, '--profile', 'node').returncode, 0)
            self.assertEqual(resource.read_text(), 'local customization')
            self.assertFalse(missing.exists())
            self.assertEqual(self.run_install(target, '--profile', 'node', '--overwrite').returncode, 0)
            self.assertTrue(missing.exists())
            self.assertEqual(instructions.read_text(), 'project rules')
            self.assertEqual(agents.read_text(), 'domain rules')

    def test_symlink_cannot_write_outside_project(self):
        with tempfile.TemporaryDirectory() as tmp, tempfile.TemporaryDirectory() as outside:
            target = Path(tmp)
            (target / '.github').symlink_to(outside, target_is_directory=True)
            self.assertNotEqual(self.run_install(target, '--profile', 'node', '--overwrite').returncode, 0)
            self.assertEqual(list(Path(outside).iterdir()), [])


if __name__ == '__main__':
    unittest.main()
