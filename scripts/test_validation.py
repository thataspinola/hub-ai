import subprocess
import tempfile
import shutil
from pathlib import Path
import unittest
from hub_resources import ROOT
from score_evaluation import score


class ValidationTests(unittest.TestCase):
    def validate_mutation(self, relative, mutate):
        with tempfile.TemporaryDirectory() as tmp:
            copy = Path(tmp) / 'hub'
            shutil.copytree(ROOT, copy, ignore=shutil.ignore_patterns('__pycache__', '.git'))
            path = copy / relative
            path.write_text(mutate(path.read_text()))
            return subprocess.run(['python3', str(copy / 'scripts/validate.py')], capture_output=True, text=True)

    def test_invalid_yaml_rejected(self):
        result = self.validate_mutation('profiles/node/skills/node-e2e/SKILL.md', lambda text: text.replace('name: node-e2e', 'name: ['))
        self.assertNotEqual(result.returncode, 0)

    def test_missing_profile_resource_rejected(self):
        result = self.validate_mutation('profiles/node/profile.json', lambda text: text.replace('skills/node-testing', 'skills/missing'))
        self.assertNotEqual(result.returncode, 0)

    def test_metadata_types_rejected(self):
        result = self.validate_mutation('profiles/node/skills/node-e2e/SKILL.md', lambda text: text.replace('name: node-e2e', 'name: 123'))
        self.assertNotEqual(result.returncode, 0)

    def test_scoring(self):
        result = score({'scenario': 'node-review', 'matched_expected': ['partial-publication', 'runtime-dependency'], 'false_positives': 1, 'raw_report': 'evaluations/results/node-review.raw.md', 'adjudicator': 'test'})
        self.assertEqual(result['recall'], 0.5)
        self.assertAlmostEqual(result['precision'], 2 / 3)
        with self.assertRaises(ValueError):
            score({'scenario': 'node-review', 'matched_expected': ['invented'], 'false_positives': 0, 'raw_report': 'evaluations/results/node-review.raw.md', 'adjudicator': 'test'})


if __name__ == '__main__':
    unittest.main()
