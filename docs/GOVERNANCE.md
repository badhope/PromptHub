# AI Agent Ecosystem - Open Governance Model

**Document**: Governance Structure
**Version**: 1.0
**Date**: 2026-03-24
**Status**: Draft for Community Review

---

## 1. Governance Philosophy

### 1.1 Core Principles

| Principle | Description | Implementation |
|:----------|:------------|:----------------|
| **Transparency** | All decisions and processes are public | Public forums, documented processes |
| **Inclusivity** | Anyone can contribute | No gatekeeping, open submission |
| **Meritocracy** | Quality determines success | Community voting, review system |
| **Accountability** | Contributors are responsible | Code of Conduct, review process |
| **Incremental Progress** | Small improvements compound | Version-based development |

### 1.2 Governance Model

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    GOVERNANCE MODEL OVERVIEW                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                         ┌─────────────────┐                             │
│                         │   COMMUNITY     │                             │
│                         │   (All Users)   │                             │
│                         └────────┬────────┘                             │
│                                  │                                       │
│                    ┌─────────────┼─────────────┐                        │
│                    │             │             │                        │
│                    ▼             ▼             ▼                        │
│            ┌───────────┐ ┌───────────┐ ┌───────────┐                   │
│            │  Voters   │ │ Submitters │ │ Reviewers │                   │
│            └─────┬─────┘ └─────┬─────┘ └─────┬─────┘                   │
│                  │             │             │                           │
│                  └─────────────┼─────────────┘                         │
│                                │                                       │
│                                ▼                                       │
│                    ┌─────────────────────┐                             │
│                    │    CORE TEAM        │                             │
│                    │  (Maintainers)      │                             │
│                    └──────────┬──────────┘                             │
│                               │                                        │
│                               ▼                                        │
│                    ┌─────────────────────┐                             │
│                    │     PROJECT         │                             │
│                    │     LEADERS        │                             │
│                    └─────────────────────┘                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Roles & Responsibilities

### 2.1 Role Definitions

| Role | Description | Requirements | Responsibilities |
|:-----|:------------|:-------------|:----------------|
| **Community Member** | Anyone who uses or views the project | None | Participate, vote, submit |
| **Contributor** | Anyone who submits content | Make 1+ contribution | Follow guidelines, quality standards |
| **Reviewer** | Community-elected quality checkers | 10+ approved contributions | Review submissions, provide feedback |
| **Core Team** | Project maintainers | Invitation only | Strategic decisions, merges, security |
| **Project Lead** | Strategic direction setters | Core team election | Final decisions, roadmap |

### 2.2 Contributor Tiers

| Tier | Requirements | Benefits | Badge |
|:-----|:------------|:---------|:------|
| **Bronze** | 1-4 approved submissions | Basic recognition | 🥉 |
| **Silver** | 5-14 approved submissions | Early access to features | 🥈 |
| **Gold** | 15-29 approved submissions | Name in release notes | 🥇 |
| **Platinum** | 30+ approved submissions | Direct commit access | 💎 |
| **Emeritus** | Lifetime contributor | Permanent recognition | 🏆 |

### 2.3 Promotion Criteria

| Current Tier | Next Tier | Requirements |
|:------------|:----------|:-------------|
| Bronze | Silver | 5+ approved, 80%+ approval rate |
| Silver | Gold | 15+ approved, 85%+ approval rate |
| Gold | Platinum | 30+ approved, 90%+ approval rate |
| Platinum | Core Team | Invitation by Core Team |

---

## 3. Submission & Review Process

### 3.1 Open Submission Policy

| Aspect | Policy |
|:-------|:-------|
| **Who Can Submit** | Anyone with a GitHub account |
| **What Can Be Submitted** | New agents, improvements to existing agents |
| **Submission Format** | Markdown with YAML frontmatter |
| **Submission Frequency** | Unlimited |
| **Cost** | Free |

### 3.2 Submission Types

| Type | Description | Review Priority |
|:-----|:------------|:----------------|
| **New Agent** | Brand new agent submission | Standard |
| **Agent Improvement** | Enhancement to existing agent | High |
| **Bug Fix** | Correction to existing content | High |
| **Documentation** | Docs, guides, examples | Standard |
| **Template** | New or improved template | Standard |
| **Translation** | Multi-language support | Standard |

### 3.3 Review Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         REVIEW WORKFLOW                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  SUBMISSION                                                             │
│      │                                                                  │
│      ▼                                                                  │
│  ┌─────────────────┐                                                    │
│  │ Format Check    │ ──▶ Automated validation                          │
│  │ (Automated)     │     • YAML structure valid?                        │
│  └────────┬────────┘     • Template compliant?                          │
│           │              • Required fields present?                      │
│           ▼                                                               │
│  ┌─────────────────┐                                                    │
│  │ Safety Scan     │ ──▶ Automated content filtering                    │
│  │ (Automated)      │     • Profanity check                              │
│  └────────┬────────┘     • Sensitive content filter                     │
│           │              • Security scan                                 │
│           ▼                                                               │
│  ┌─────────────────┐                                                    │
│  │ Community Vote  │ ──▶ 7-day voting period                            │
│  │ (Community)      │     • Minimum 3 votes required                    │
│  └────────┬────────┘     • 60% approval threshold                       │
│           │                                                               │
│           ▼                                                               │
│  ┌─────────────────┐                                                    │
│  │ Quality Review  │ ──▶ Template & Content review                       │
│  │ (Reviewers)      │     • Clarity & coherence                          │
│  └────────┬────────┘     • Originality & usefulness                     │
│           │              • Safety & appropriateness                    │
│           ▼                                                               │
│  ┌─────────────────┐                                                    │
│  │ Final Approval  │ ──▶ Core Team sign-off                             │
│  │ (Core Team)      │     • Integration test                             │
│  └────────┬────────┘     • Final decision                                │
│           │                                                               │
│           ▼                                                               │
│     MERGE / REJECT                                                      │
│           │                                                               │
│           ▼                                                               │
│  ┌─────────────────┐                                                    │
│  │ Feedback Loop   │ ──▶ Constructive feedback to author               │
│  └─────────────────┘     • Reason for decision                          │
│                          • Suggestions for improvement                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Review Criteria

| Criterion | Weight | Description | How Evaluated |
|:----------|:-------|:------------|:---------------|
| **Template Compliance** | 20% | Follows standard structure | Automated check |
| **Content Quality** | 25% | Well-written, coherent, useful | Peer review |
| **Originality** | 15% | Not duplicate of existing | Community check |
| **Usefulness** | 20% | Provides real value to users | Community vote |
| **Safety** | 20% | No inappropriate content | Automated + manual |

### 3.5 Approval Thresholds

| Submission Type | Community Vote | Reviewer Approval | Core Team |
|:----------------|:----------------|:-------------------|:----------|
| New Agent | 60% positive | 2+ reviewers | Required |
| Agent Improvement | 60% positive | 1+ reviewer | Required |
| Bug Fix | N/A | 1+ reviewer | Required |
| Documentation | 60% positive | Optional | Not required |
| Translation | 60% positive | 1+ bilingual reviewer | Required |

---

## 4. Voting System

### 4.1 Vote Types

| Vote Type | Who Can Vote | Duration | Outcome |
|:-----------|:-------------|:---------|:--------|
| **Submission Approval** | Contributors+ | 7 days | Accept/Reject |
| **Feature RFC** | All | 14 days | Advisory |
| **Governance Change** | All | 30 days | Binding |
| **Core Team Election** | Platinum+ | 7 days | Binding |

### 4.2 Voting Mechanics

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         VOTING MECHANICS                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Vote Options:                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ✅ APPROVE  │  😐 NEUTRAL  │  ❌ REJECT  │  🚫 ABSTAIN      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Counting Formula:                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │   Approval Rate =                                                │   │
│  │   (Approve - 0.5*Neutral) / (Approve + Reject + Neutral)       │   │
│  │                                                                 │   │
│  │   Pass Threshold = 60%                                          │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Tie-Breaking:                                                         │
│  • Revert to current state                                             │
│  • Core Team makes final decision                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Conflict Resolution

### 5.1 Conflict Types

| Conflict Type | Example | Resolution Path |
|:--------------|:--------|:----------------|
| **Content Dispute** | Agent quality concerns | Community vote → Core Team |
| **Style Disagreement** | Template preferences | RFC process |
| **Governance Issue** | Rule interpretation | Core Team → Full vote |
| **Code of Conduct** | Violation reports | Core Team (expedited) |

### 5.2 Escalation Process

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ESCALATION PROCESS                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Level 1: Direct Resolution                                            │
│  └── Parties discuss and resolve directly                               │
│                                                                         │
│  Level 2: Community Mediation                                          │
│  └── Trusted reviewer介入，协调双方                                    │
│                                                                         │
│  Level 3: Core Team Review                                             │
│  └── Formal review, binding decision                                   │
│                                                                         │
│  Level 4: Full Community Vote                                          │
│  └── Reserved for governance changes                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Code of Conduct

### 6.1 Code of Conduct Summary

See full [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) for details.

**Core Commitments:**
- Be respectful and inclusive
- Give constructive feedback
- Focus on what's best for the community
- Show empathy towards others

### 6.2 Enforcement

| Violation | First Offense | Repeat Offense |
|:----------|:--------------|:---------------|
| Uncivil behavior | Private warning | Public warning |
| Spam/Noise | Content removal | Temporary ban |
| Harassment | Formal warning | Permanent ban |
| Security violation | Immediate suspension | Permanent ban |

---

## 7. Decision-Making Framework

### 7.1 Decision Types

| Decision Type | Made By | Process | Timeframe |
|:--------------|:--------|:--------|:----------|
| **Agent acceptance** | Core Team | Review workflow | 7-14 days |
| **Feature addition** | Core Team | RFC process | 14-30 days |
| **Governance change** | Community | Full vote | 30 days |
| **Strategic direction** | Project Lead | Core Team input | Variable |
| **Emergency fix** | Core Team | Fast-track | 24-48 hours |

### 7.2 RFC Process

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         RFC PROCESS                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. PROPOSAL DRAFTING                                                  │
│     └── Author writes RFC document                                      │
│                                                                         │
│  2. INITIAL DISCUSSION                                                  │
│     └── 7-day open comment period                                       │
│                                                                         │
│  3. REVISION                                                            │
│     └── Author incorporates feedback                                     │
│                                                                         │
│  4. CORE TEAM REVIEW                                                   │
│     └── 7-day Core Team discussion                                      │
│                                                                         │
│  5. FINAL VOTE (if needed)                                             │
│     └── 14-day community vote                                           │
│                                                                         │
│  6. IMPLEMENTATION                                                      │
│     └── Assigned to responsible party                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Transparency & Communication

### 8.1 Public Channels

| Channel | Purpose | Access |
|:--------|:--------|:-------|
| GitHub Issues | Bug reports, feature requests | Public |
| GitHub Discussions | General discussion, RFCs | Public |
| Pull Requests | Code/content submissions | Public |
| Project Board | Roadmap tracking | Public |

### 8.2 Required Public Documentation

| Document | Update Frequency | Contents |
|:---------|:-----------------|:---------|
| Meeting Notes | Per meeting | Decisions, action items |
| Decision Log | Monthly | Major decisions & rationale |
| Roadmap | Quarterly | Future plans |
| Release Notes | Per release | Changes, contributors |
| Metrics Report | Quarterly | Usage stats, growth |

### 8.3 Communication Principles

- **Public by default** - Private discussions only for sensitive matters
- **Document everything** - Decisions recorded in writing
- **Explain reasoning** - Not just what, but why
- **Timely updates** - Keep community informed

---

## 9. Core Team Structure

### 9.1 Core Team Roles

| Role | Responsibilities | Quantity |
|:-----|:-----------------|:---------|
| **Project Lead** | Strategic direction, final decisions | 1 |
| **Technical Lead** | Architecture, integrations, tooling | 1-2 |
| **Community Lead** | Contributor relations, review coordination | 1-2 |
| **Quality Lead** | Standards, templates, consistency | 1-2 |

### 9.2 Core Team Selection

| Criteria | Requirement |
|:---------|:------------|
| **Track Record** | 30+ contributions, 90%+ approval rate |
| **Community Standing** | Respected, helpful, constructive |
| **Expertise** | Deep knowledge of project domain |
| **Availability** | 5+ hours/week minimum |
| **Tenure** | 6+ months active participation |

### 9.3 Core Team Terms

| Aspect | Policy |
|:-------|:-------|
| **Term Length** | 1 year, renewable |
| **Maximum Terms** | 3 consecutive |
| **Selection** | Internal nomination + Platinum vote |
| **Removal** | 2/3 Core Team vote or community vote |

---

## 10. Amendment Process

### 10.1 Governance Amendments

| Amendment Type | Votes Required | Quorum |
|:---------------|:---------------|:-------|
| Minor correction | Simple majority | 50% of active members |
| Process change | 2/3 majority | 60% of active members |
| Major restructure | 3/4 majority | 75% of active members |

### 10.2 Amendment Timeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      AMENDMENT TIMELINE                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Day 1-7:    Proposal Period                                           │
│               └── Submit amendment draft                                │
│                                                                         │
│  Day 8-14:   Discussion Period                                          │
│               └── Public comments, revisions                           │
│                                                                         │
│  Day 15-30:  Voting Period (Major)                                      │
│               └── 14 days for major changes                            │
│               └── 7 days for minor changes                              │
│                                                                         │
│  Day 31:     Implementation                                            │
│               └── If passed, implement within 30 days                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Accountability Mechanisms

### 11.1 Contributors

| Accountability | Mechanism |
|:---------------|:----------|
| Quality | Peer review, voting |
| Timeliness | Response time expectations (7 days) |
| Professionalism | Code of Conduct |

### 11.2 Reviewers

| Accountability | Mechanism |
|:---------------|:----------|
| Fairness | Appeal process for rejected submissions |
| Quality | Review quality score (acceptance rate) |
| Availability | Minimum 2 reviews/week expected |

### 11.3 Core Team

| Accountability | Mechanism |
|:---------------|:----------|
| Transparency | Public decision log |
| Responsiveness | 48-hour response SLA |
| Performance | Quarterly review by community |
| Integrity | Conflict of interest disclosure |

---

**Document Status**: Draft for Community Review
**Review Period**: 30 days from posting
**Provisional Adoption**: Upon community approval
**Final Review**: After 6 months of operation