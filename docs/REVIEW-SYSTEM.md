# AI Agent Ecosystem - Content Review System

**Document**: Review System Design
**Version**: 1.0
**Date**: 2026-03-24
**Status**: Ready for Implementation

---

## 1. System Overview

### 1.1 Review System Goals

| Goal | Description | Success Metric |
|:-----|:------------|:---------------|
| **Quality Assurance** | Maintain high standards for all agents | 90%+ approval rate post-merge |
| **Scalability** | Handle growth without bottleneck | Review time < 7 days |
| **Fairness** | Consistent evaluation criteria | Appeal success rate < 10% |
| **Transparency** | Clear feedback to contributors | 100% feedback provided |
| **Safety** | Prevent harmful content | Zero safety incidents |

### 1.2 Review Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         REVIEW SYSTEM FLOW                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  SUBMITTER                                                               │
│      │                                                                    │
│      ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    STAGE 1: AUTOMATED CHECKS                       │   │
│  │                                                                  │   │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │   │
│  │   │ Format      │  │ YAML        │  │ Safety      │             │   │
│  │   │ Validation  │─▶│ Parser      │─▶│ Filter      │             │   │
│  │   └─────────────┘  └─────────────┘  └─────────────┘             │   │
│  │         │                │                │                     │   │
│  │         ▼                ▼                ▼                     │   │
│  │   ┌─────────────────────────────────────────────────────────┐   │   │
│  │   │           Automated Validation Results                     │   │   │
│  │   │  • Syntax valid?  • Fields complete?  • Content safe?    │   │   │
│  │   └─────────────────────────────────────────────────────────┘   │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│      │                                                                    │
│      ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    STAGE 2: COMMUNITY REVIEW                      │   │
│  │                                                                  │   │
│  │   Publication                                                    │   │
│  │      │                                                            │   │
│  │      ▼                                                            │   │
│  │   ┌─────────────────────────────────────────────────────────┐   │   │
│  │   │              7-DAY VOTING PERIOD                          │   │   │
│  │   │                                                          │   │   │
│  │   │   👥 Community Members                                    │   │   │
│  │   │      │                                                    │   │   │
│  │   │      ├──▶ ✅ Approve                                     │   │   │
│  │   │      ├──▶ 😐 Neutral                                     │   │   │
│  │   │      └──▶ ❌ Reject                                      │   │   │
│  │   │                                                          │   │   │
│  │   │   Minimum 3 votes required                               │   │   │
│  │   │   60% approval threshold                                  │   │   │
│  │   │                                                          │   │   │
│  │   └─────────────────────────────────────────────────────────┘   │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│      │                                                                    │
│      ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    STAGE 3: QUALITY REVIEW                        │   │
│  │                                                                  │   │
│  │   ┌─────────────────────────────────────────────────────────┐   │   │
│  │   │              REVIEWER EVALUATION                          │   │   │
│  │   │                                                          │   │   │
│  │   │   Quality Criteria:                                      │   │   │
│  │   │   ├── Content Clarity (20%)                             │   │   │
│  │   │   ├── Template Compliance (20%)                         │   │   │
│  │   │   ├── Originality (15%)                                 │   │   │
│  │   │   ├── Usefulness (25%)                                  │   │   │
│  │   │   └── Safety & Appropriateness (20%)                    │   │   │
│  │   │                                                          │   │   │
│  │   └─────────────────────────────────────────────────────────┘   │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│      │                                                                    │
│      ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    STAGE 4: CORE TEAM APPROVAL                    │   │
│  │                                                                  │   │
│  │   ┌─────────────────────────────────────────────────────────┐   │   │
│  │   │           FINAL CHECK BY CORE TEAM                       │   │   │
│  │   │                                                          │   │   │
│  │   │   • Integration test                                     │   │   │
│  │   │   • Final safety review                                  │   │   │
│  │   │   • Consistency check                                    │   │   │
│  │   │                                                          │   │   │
│  │   └─────────────────────────────────────────────────────────┘   │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│      │                                                                    │
│      ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                         DECISION                                  │   │
│  │                                                                  │   │
│  │   ┌────────────────────┐       ┌────────────────────┐          │   │
│  │   │      MERGE          │       │      REJECT         │          │   │
│  │   │                    │       │                    │          │   │
│  │   │  • Auto-merge      │       │  • Feedback sent   │          │   │
│  │   │  • Contributor     │       │  • Revision        │          │   │
│  │   │    notified        │       │    encouraged      │          │   │
│  │   │  • Release notes  │       │  • Can resubmit    │          │   │
│  │   └────────────────────┘       └────────────────────┘          │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Automated Checks

### 2.1 Format Validation

| Check | Rule | Error Message |
|:------|:-----|:--------------|
| **File Extension** | Must be `.md` | "File must have .md extension" |
| **File Name** | kebab-case only | "Use kebab-case for filename" |
| **File Size** | Max 100KB | "File exceeds 100KB limit" |
| **Encoding** | UTF-8 | "File must be UTF-8 encoded" |

### 2.2 YAML Frontmatter Validation

| Field | Required | Validation | Error Message |
|:------|:---------|:-----------|:--------------|
| `agent_id` | Yes | Unique, kebab-case | "agent_id required, unique" |
| `category` | Yes | Valid category ID | "Invalid category" |
| `language` | Yes | "zh", "en", "ja", etc. | "language required" |
| `description` | Yes | 10-200 chars | "Description 10-200 chars" |
| `best_for` | Yes | Non-empty | "best_for required" |
| `activation_prompt` | Yes | Contains {RAW_URL} | "activation_prompt with {RAW_URL} required" |

### 2.3 Content Safety Filter

```yaml
safety_rules:
  blocked_patterns:
    - pattern: "(?i)(hack|crack|password)"
      severity: medium
      action: flag_for_review

    - pattern: "(?i)( violence|weapon|bomb)"
      severity: high
      action: auto_reject

    - pattern: "(?i)( racism|discriminat|bigotr)"
      severity: high
      action: auto_reject

    - pattern: "eval\s*\(|exec\s*\(|system\s*\("
      severity: critical
      action: auto_reject

  content_categories:
    prohibited:
      - illegal_content
      - hate_speech
      - personal_attacks
      - explicit_content
      - malware_instructions

    requires_review:
      - political_content
      - religious_content
      - medical_advice
      - financial_advice
      - legal_advice
```

### 2.4 Automated Check Output

```json
{
  "check_id": "auto-20260324-001",
  "timestamp": "2026-03-24T12:00:00Z",
  "results": {
    "format_validation": {
      "status": "pass",
      "details": {
        "extension": ".md",
        "encoding": "utf-8",
        "size_bytes": 4521
      }
    },
    "yaml_validation": {
      "status": "pass",
      "missing_fields": [],
      "invalid_fields": []
    },
    "safety_filter": {
      "status": "pass",
      "flagged": false,
      "matches": []
    }
  },
  "overall_status": "pass",
  "can_proceed": true
}
```

---

## 3. Community Review

### 3.1 Voting Mechanics

| Parameter | Value | Description |
|:----------|:------|:------------|
| **Voting Period** | 7 days | Time allowed for voting |
| **Minimum Votes** | 3 | Required to proceed |
| **Approval Threshold** | 60% | Positive votes needed |
| **Vote Types** | 4 | Approve, Neutral, Reject, Abstain |

### 3.2 Vote Counting Formula

```
Approval Rate = (Approve - 0.5×Neutral) / (Approve + Reject + Neutral)

Pass Condition:
  - At least 3 votes
  - Approval Rate ≥ 60%
  - Reject votes < 40%
```

### 3.3 Voter Eligibility

| Voter Tier | Can Vote | Can Comment |
|:-----------|:---------|:-------------|
| Bronze | ✅ | ✅ |
| Silver | ✅ | ✅ |
| Gold | ✅ | ✅ |
| Platinum | ✅ | ✅ |
| Core Team | ✅ | ✅ |
| Community Member | ✅ | ✅ |

### 3.4 Vote Display

```markdown
## Community Vote

| User | Vote | Comment |
|:-----|:-----|:--------|
| @contributor1 | ✅ Approve | "Great character design!" |
| @contributor2 | 😐 Neutral | "Good but needs more backstory" |
| @contributor3 | ❌ Reject | "Too similar to existing agent" |

**Result**: Pending (2/3 votes, 66.7% approval)
```

---

## 4. Quality Review

### 4.1 Review Criteria

| Criterion | Weight | Description | Score Range |
|:----------|:-------|:------------|:------------|
| **Content Clarity** | 20% | Clear, coherent, well-structured | 1-5 |
| **Template Compliance** | 20% | Follows template structure | 1-5 |
| **Originality** | 15% | Unique, not duplicate | 1-5 |
| **Usefulness** | 25% | Provides real value | 1-5 |
| **Safety** | 20% | Appropriate content | 1-5 |

**Minimum Passing Score**: 3.5 / 5.0

### 4.2 Review Score Card

```markdown
## Quality Review Score Card

**Agent**: [Agent Name]
**Reviewer**: [@username](link)
**Date**: 2026-03-24

### Scores

| Criterion | Score (1-5) | Notes |
|:----------|:------------|:------|
| Content Clarity | ⭐⭐⭐⭐ (4) | Well-written, engaging |
| Template Compliance | ⭐⭐⭐⭐⭐ (5) | Perfect adherence |
| Originality | ⭐⭐⭐⭐ (4) | Good variation |
| Usefulness | ⭐⭐⭐⭐⭐ (5) | Very practical |
| Safety | ⭐⭐⭐⭐⭐ (5) | No concerns |

**Total Score**: 4.6 / 5.0 ✅ PASS

### Comments

> This is an excellent submission. The character has a well-developed
> personality and the response patterns are consistent. Minor suggestion:
> consider adding more specific interaction examples.

### Recommendation

✅ **APPROVE** - Ready for merge
```

### 4.3 Reviewer Assignment

```python
def assign_reviewer(submission, reviewer_pool):
    """Assign reviewers based on expertise and availability"""

    # Filter by category expertise
    category = submission.category
    expert_reviewers = [
        r for r in reviewer_pool
        if r.expertise == category and r.availability
    ]

    # Sort by queue position (FIFO)
    expert_reviewers.sort(key=lambda r: r.last_assigned)

    # Assign up to 2 reviewers
    return expert_reviewers[:2]
```

---

## 5. Feedback System

### 5.1 Feedback Types

| Type | Trigger | Response Time |
|:-----|:--------|:--------------|
| **Approval** | Submission passes all stages | Immediate |
| **Rejection** | Submission fails any stage | Within 24 hours |
| **Revision Request** | Needs improvement | Within 48 hours |
| **Escalation** | Dispute or conflict | Within 72 hours |

### 5.2 Feedback Template

```markdown
## Review Feedback

**Submission**: [Agent Name]
**Review Stage**: [Automated/Community/Quality/Core Team]
**Date**: 2026-03-24

### Decision: ❌ REJECTED

### Reasons

1. **Content Quality Issue**
   - Current: "Description is too brief"
   - Required: "At least 3 paragraphs of detailed description"
   - Reference: [Template guidelines](../templates/role-template.md)

2. **Template Compliance**
   - Current: Missing "Boundaries" section
   - Required: All required sections must be present
   - Reference: [Template check list](./checklist.md)

### Suggestions for Improvement

1. Expand the personality section with specific examples
2. Add at least 2 interaction scenarios
3. Include proper YAML frontmatter

### Next Steps

You may revise and resubmit. Please address the above concerns
and submit within 14 days.

### Appeal Process

If you believe this decision is incorrect, you may:
1. Reply to this feedback with clarifications
2. Request escalation to Core Team
3. Submit an appeal via [Issues](./issues)

---
**Reviewer**: @reviewer_username
**Contact**: [Email](./contact) if questions
```

---

## 6. Appeal Process

### 6.1 Appeal Triggers

| Trigger | Who Can Appeal | Time Limit |
|:--------|:---------------|:-----------|
| Rejection | Submitter | 14 days |
| Quality score dispute | Submitter | 7 days |
| Safety flagging | Submitter | Immediate |
| Reviewer misconduct | Anyone | Any time |

### 6.2 Appeal Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         APPEAL PROCESS                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  SUBMITTER FILES APPEAL                                                │
│      │                                                                  │
│      ▼                                                                  │
│  ┌─────────────────┐                                                  │
│  │ Appeal Review    │ ──▶ Core Team reviews appeal                    │
│  │ (Core Team)      │     • Valid appeal?                              │
│  └────────┬────────┘     • New information?                            │
│           │              • Reviewer error?                              │
│           ▼                                                              │
│  ┌─────────────────┐                                                  │
│  │ Decision        │                                                  │
│  │                  │                                                  │
│  │ ┌─────────────┐ │                                                  │
│  │ │ UPHELD      │ │                                                  │
│  │ │ Original    │ │                                                  │
│  │ │ decision    │ │                                                  │
│  │ │ stands      │ │                                                  │
│  │ └─────────────┘ │                                                  │
│  │                  │                                                  │
│  │ ┌─────────────┐ │                                                  │
│  │ │ REVERSED   │ │                                                  │
│  │ │ Submission  │ │                                                  │
│  │ │ proceeds    │ │                                                  │
│  │ └─────────────┘ │                                                  │
│  │                  │                                                  │
│  │ ┌─────────────┐ │                                                  │
│  │ │ REVISED     │ │                                                  │
│  │ │ Specific    │ │                                                  │
│  │ │ changes     │ │                                                  │
│  │ │ required    │ │                                                  │
│  │ └─────────────┘ │                                                  │
│  │                  │                                                  │
│  └──────────────────┘                                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Scalability Design

### 7.1 Automation Levels

| Volume | Automation Level | Human Intervention |
|:-------|:-----------------|:-------------------|
| 0-10/week | Full automation | Quality review only |
| 10-50/week | Partial automation | Community voting |
| 50+/week | Minimal | Escalation only |

### 7.2 Queue Management

```python
class ReviewQueue:
    """Manage submission queue for optimal throughput"""

    def __init__(self):
        self.queue = []
        self.processing = []
        self.completed = []

    def add_submission(self, submission):
        # Assign priority based on type
        if submission.is_bugfix:
            priority = 1  # Highest
        elif submission.is_documentation:
            priority = 3  # Lower
        else:
            priority = 2  # Standard

        self.queue.append({
            'submission': submission,
            'priority': priority,
            'added_at': datetime.now()
        })
        self.queue.sort(key=lambda x: x['priority'])

    def get_next(self, reviewer):
        # Return oldest submission matching reviewer's expertise
        for item in self.queue:
            if reviewer.can_review(item['submission'].category):
                return item
        return None
```

### 7.3 Performance Targets

| Metric | Target | Maximum |
|:-------|:-------|:--------|
| Automated check time | < 1 minute | 5 minutes |
| Community vote period | 7 days | 14 days |
| Quality review time | < 3 days | 7 days |
| Core team approval | < 2 days | 5 days |
| **Total end-to-end** | **< 14 days** | **30 days** |

---

## 8. Review Tools

### 8.1 Automated Validation Script

```python
#!/usr/bin/env python3
"""
Automated Agent Validation Script
Validates agent files before submission
"""

import sys
import yaml
import re
from pathlib import Path

REQUIRED_FIELDS = ['agent_id', 'category', 'language', 'description', 'best_for', 'activation_prompt']

VALID_CATEGORIES = [
    'functional', 'professional', 'healthcare', 'finance',
    'psychology', 'design-build', 'research-analysis',
    'writing-creative', 'learning-education', 'subject-tutoring',
    'lifestyle-companion', 'entertainment-character', 'gaming',
    'historical-culture', 'social-vocation', 'creative-arts'
]

def validate_yaml(content):
    """Validate YAML frontmatter"""
    try:
        # Extract YAML frontmatter
        match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
        if not match:
            return False, "Missing YAML frontmatter"

        yaml_content = yaml.safe_load(match.group(1))

        # Check required fields
        missing = [f for f in REQUIRED_FIELDS if f not in yaml_content]
        if missing:
            return False, f"Missing fields: {', '.join(missing)}"

        # Validate category
        if yaml_content['category'] not in VALID_CATEGORIES:
            return False, f"Invalid category: {yaml_content['category']}"

        return True, "Valid"

    except yaml.YAMLError as e:
        return False, f"YAML parse error: {e}"

def validate_filename(path):
    """Validate filename format"""
    name = path.name
    if not name.endswith('.md'):
        return False, "File must have .md extension"
    if not re.match(r'^[a-z0-9]+(-[a-z0-9]+)*\.md$', name):
        return False, "Filename must use kebab-case"
    return True, "Valid"

def main():
    file_path = Path(sys.argv[1])

    # Check file exists
    if not file_path.exists():
        print(f"❌ File not found: {file_path}")
        sys.exit(1)

    # Read file
    content = file_path.read_text(encoding='utf-8')

    # Validate filename
    valid, msg = validate_filename(file_path)
    print(f"{'✅' if valid else '❌'} Filename: {msg}")

    # Validate YAML
    valid, msg = validate_yaml(content)
    print(f"{'✅' if valid else '❌'} YAML: {msg}")

    if not valid:
        sys.exit(1)

    print("\n✅ All checks passed!")

if __name__ == '__main__':
    main()
```

### 8.2 CI/CD Integration

```yaml
# .github/workflows/review.yml
name: Automated Review

on:
  pull_request:
    paths:
      - 'agents/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run validation
        run: python3 scripts/validate-agent.py ${{ matrix.agent }}

      - name: Check safety
        run: python3 scripts/safety-check.py ${{ matrix.agent }}

  community-review:
    needs: validate
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - name: Initialize voting
        run: python3 scripts/init-vote.py

  quality-review:
    needs: community-review
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - name: Assign reviewers
        run: python3 scripts/assign-reviewers.py
```

---

## 9. Review Metrics

### 9.1 Key Metrics

| Metric | Description | Target |
|:-------|:------------|:-------|
| **Throughput** | Submissions processed per week | 20+ |
| **Pass Rate** | % passing first submission | 60%+ |
| **Avg Review Time** | Time from submit to merge | < 14 days |
| **Quality Score** | Average quality score | > 4.0 |
| **Contributor Satisfaction** | NPS from contributors | > 50 |

### 9.2 Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         REVIEW DASHBOARD                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  THIS WEEK                    │  ALL TIME                              │
│  ─────────────────────────────┼─────────────────────────────             │
│  Submissions:    12          │  Total:        156                       │
│  Approved:       8 (67%)     │  Approved:    124 (79%)                  │
│  Pending:        3           │  Rejected:     32 (21%)                   │
│  Avg Time:      11 days     │  Avg Time:     9 days                    │
│                                                                         │
│  QUEUE STATUS                                                           │
│  ──────────────────────────────────────────────────────────             │
│  Awaiting Vote:     ████████░░░░░░░░░  12                             │
│  Awaiting Review:   ██████░░░░░░░░░░░   8                              │
│  Awaiting Approval: ███░░░░░░░░░░░░░░   3                              │
│                                                                         │
│  TOP CONTRIBUTORS                                                       │
│  ──────────────────────────────────────────────────────────             │
│  🥇 @user1    ████████████████████  28 agents                          │
│  🥈 @user2    ███████████████░░░░░░  18 agents                          │
│  🥉 @user3    ████████████░░░░░░░░░  12 agents                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Integration with Governance

### 10.1 Review System ↔ Governance

| Governance Element | Review System Integration |
|:-------------------|:-------------------------|
| **Contributor Tiers** | Voting weight based on tier |
| **Core Team** | Final approval authority |
| **Appeals** | Escalation to governance |
| **RFC Process** | Policy changes reviewed |

### 10.2 Quality Standards Enforcement

| Standard | Enforcement |
|:---------|:------------|
| Template compliance | Automated check |
| Content quality | Reviewer scoring |
| Originality | Community voting |
| Safety | Automated + manual |

---

**Document Status**: Complete
**Implementation**: Ready for Core Team review