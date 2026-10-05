"""Score human-adjudicated findings; never infer semantic correctness from keywords."""
import argparse
import json
from hub_resources import ROOT


def score(report):
    rubric = json.loads((ROOT / 'evaluations/rubric.json').read_text())[report['scenario']]
    expected = set(rubric['expected'])
    matched = set(report['matched_expected'])
    false_positives = report['false_positives']
    if not matched <= expected or not isinstance(false_positives, int) or isinstance(false_positives, bool) or false_positives < 0:
        raise ValueError('Invalid adjudication')
    if not report.get('raw_report') or not report.get('adjudicator'):
        raise ValueError('Raw report and adjudicator are required')
    raw = (ROOT / report['raw_report']).resolve()
    if not raw.is_relative_to(ROOT) or not raw.is_file():
        raise ValueError('Raw report must exist inside the hub')
    return {'recall': len(matched) / len(expected) if expected else None, 'precision': len(matched) / (len(matched) + false_positives) if matched or false_positives else None, 'missed': sorted(expected - matched), 'false_positives': false_positives}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('report')
    args = parser.parse_args()
    print(json.dumps(score(json.loads(open(args.report).read())), indent=2))
