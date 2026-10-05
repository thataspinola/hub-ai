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
        for profile, agent, count in [('frontend', 'copilot-setup', 8), ('node', 'node-setup', 9)]:
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

    def test_web_framework_profiles(self):
        for profile in ('angular', 'react', 'nextjs', 'vue'):
            with self.subTest(profile=profile), tempfile.TemporaryDirectory() as tmp:
                target = Path(tmp)
                self.assertEqual(self.run_install(target, '--profile', profile).returncode, 0)
                self.assertTrue((target / '.github/agents/web-setup.agent.md').exists())
                self.assertTrue((target / f'.github/skills/{profile}-patterns/SKILL.md').exists())
                self.assertTrue((target / '.github/skills/gitlab-delivery/SKILL.md').exists())
                for other in {'angular', 'react', 'nextjs', 'vue'} - {profile}:
                    self.assertFalse((target / f'.github/skills/{other}-patterns').exists())
                self.assertFalse((target / '.gitlab-ci.yml').exists())  # Installer preserves consumer CI.
                (target / '.github/copilot-instructions.md').write_text('Completed instructions')
                doctor = INSTALL.with_name('doctor.py')
                result = subprocess.run(['python3', str(doctor), str(target)], capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stdout)

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


class RegressionTests(InstallTests):
    def test_hardlink_replace_preserves_other_inode(self):
        import os
        with tempfile.TemporaryDirectory() as tmp, tempfile.TemporaryDirectory() as outside:
            target = Path(tmp)
            other = Path(outside) / 'original'
            other.write_text('original')
            dest = target / '.github/agents/node-setup.agent.md'
            dest.parent.mkdir(parents=True)
            os.link(other, dest)
            self.assertEqual(self.run_install(target, '--profile', 'node', '--overwrite').returncode, 0)
            self.assertEqual(other.read_text(), 'original')
            self.assertNotEqual(dest.stat().st_ino, other.stat().st_ino)

    def test_directory_conflict_prevents_partial_install(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp)
            (target / '.github/templates/node-instructions.md').mkdir(parents=True)
            self.assertNotEqual(self.run_install(target, '--profile', 'node', '--overwrite').returncode, 0)
            self.assertFalse((target / '.github/agents').exists())

    def test_preview_writes_nothing(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp)
            result = self.run_install(target, '--profile', 'node', '--dry-run')
            self.assertEqual(result.returncode, 0)
            self.assertIn('ADD .github/', result.stdout)
            self.assertEqual(list(target.iterdir()), [])

    def test_migration_removes_only_unchanged_managed_files(self):
        import json
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp)
            self.assertEqual(self.run_install(target).returncode, 0)
            custom = target / '.github/skills/acessibility/SKILL.md'
            custom.write_text('custom')
            self.assertNotEqual(self.run_install(target, '--profile', 'node', '--migrate').returncode, 0)
            self.assertEqual(custom.read_text(), 'custom')
            # Restore through explicit overwrite, then migrate safely.
            self.assertEqual(self.run_install(target, '--overwrite').returncode, 0)
            self.assertEqual(self.run_install(target, '--profile', 'node', '--migrate').returncode, 0)
            self.assertFalse(custom.exists())
            state = json.loads((target / '.github/hub-ai-lock.json').read_text())
            self.assertEqual(state['profile'], 'node')
            self.assertEqual(state['version'], '1.2.0')

    def test_capabilities_and_diagnostic_drift(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp)
            self.assertEqual(self.run_install(target, '--profile', 'node', '--capabilities', 'base').returncode, 0)
            self.assertFalse((target / '.github/skills/node-e2e').exists())
            self.assertEqual(len(list((target / '.github/skills').glob('*/SKILL.md'))), 5)
            (target / '.github/copilot-instructions.md').write_text('Completed project instructions')
            doctor = INSTALL.with_name('doctor.py')
            self.assertEqual(subprocess.run(['python3', str(doctor), str(target)], capture_output=True).returncode, 0)
            (target / '.github/skills/node-testing/SKILL.md').write_text('changed')
            result = subprocess.run(['python3', str(doctor), str(target)], capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('Locally modified:', result.stdout)

    def test_rollback_on_write_failure(self):
        from unittest.mock import patch
        from contextlib import redirect_stdout, redirect_stderr
        import io
        import sys
        import install
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp)
            existing = target / '.github/agents/node-setup.agent.md'
            existing.parent.mkdir(parents=True)
            existing.write_text('before')
            original = install.atomic_write
            failed = False
            def fail_once(path, data):
                nonlocal failed
                if path.name == 'node-code-reviewer.agent.md' and not failed:
                    failed = True
                    raise OSError('simulated disk error')
                original(path, data)
            with redirect_stdout(io.StringIO()), redirect_stderr(io.StringIO()), patch.object(sys, 'argv', ['install.py', str(target), '--profile', 'node', '--overwrite']), patch.object(install, 'atomic_write', fail_once):
                with self.assertRaises(SystemExit):
                    install.main()
            self.assertEqual(existing.read_text(), 'before')
            self.assertFalse((target / '.github/agents/node-code-reviewer.agent.md').exists())
            self.assertFalse((target / '.hub-ai-transaction.json').exists())

    def test_interruption_recovery(self):
        import base64, json
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp)
            resource = target / '.github/agents/node-setup.agent.md'
            resource.parent.mkdir(parents=True)
            resource.write_text('partial')
            (target / '.hub-ai-transaction.json').write_text(json.dumps({'before': {'.github/agents/node-setup.agent.md': base64.b64encode(b'original').decode()}}))
            self.assertNotEqual(self.run_install(target).returncode, 0)
            self.assertEqual(self.run_install(target, '--recover').returncode, 0)
            self.assertEqual(resource.read_text(), 'original')


if __name__ == '__main__':
    unittest.main()
