# 12. Pre-defense Preparation

Pre-defense 1 (milestone M1, document 10): **24 October 2026**.
YouTrack task: **DIP-12**.

This document checks the submission against the M1 checklist, records who presents what, and lists what is still open. It is updated after the pre-defense with the committee's remarks (copied into document 11).

## 12.1 Links

| Item | Link |
|---|---|
| Repository | https://github.com/felfir-bit/child-monitor |
| YouTrack | https://chil-monitoring-system.youtrack.cloud/projects |
| Submission tag | `pre-defense-1` |

## 12.2 Submission checklist (M1)

M1 content as defined in document 10, section 10.5: analysis documents, initial requirements, diagrams, prototype, verification plan, YouTrack link, progressive commits from both students.

| # | Checklist item | Where | Status |
|---|---|---|---|
| 1 | Project proposal and scope | `docs/01-project-proposal.md` | Done |
| 2 | Evidence of relevance (user conversations) | `docs/02-evidence-of-relevance.md` | Open: conversations to be recorded in section 2.5 |
| 3 | Literature review (12+ sources, 8+ scientific) | `docs/03-literature-review.md` | Done |
| 4 | Comparison of existing systems | `docs/04-existing-systems-comparison.md` | Done |
| 5 | Technology comparison and ADRs | `docs/05-technology-comparison.md`, `docs/adr/` | Done |
| 6 | Monitoring model and requirements | `docs/00-monitoring-model.md`, `docs/06-requirements-specification.md` | Done |
| 7 | Architecture and diagrams | `docs/07-architecture.md`, `diagrams/` | Done |
| 8 | UX prototype | `prototype/`, `docs/08-ux-prototype.md` | Done (screens S1 to S6) |
| 9 | Verification and evaluation plan | `docs/09-verification-plan.md` | Done |
| 10 | Milestones, risks, responsibilities | `docs/10-project-management-risks.md` | Done |
| 11 | Supervisor feedback log | `docs/11-supervisor-feedback.md` | Open: real comments to be added |
| 12 | YouTrack project with tasks, owners, due dates | YouTrack, project DIP | Done |
| 13 | Commits from both students through pull requests | GitHub, branches `DIP-<n>-<slug>` | In progress |
| 14 | Submission tag | `pre-defense-1` | To do after the last merge |

Status values: Done, In progress, Open, To do. A row is marked Done only when the document is merged into `main`.

## 12.3 Presentation plan

| Part | Content | Speaker | Time |
|---|---|---|---|
| 1 | Problem, users, aim (documents 01, 02) | Zhan | 2 min |
| 2 | Literature and existing systems (documents 03, 04) | Arsen | 2 min |
| 3 | Monitoring model and requirements (documents 00, 06) | Arsen | 2 min |
| 4 | Technology choices and architecture (documents 05, 07, ADRs) | Zhan | 2 min |
| 5 | Prototype walkthrough (document 08) | Arsen | 2 min |
| 6 | Verification plan, risks, plan to M2 (documents 09, 10) | Zhan | 2 min |

Prototype walkthrough: sign in as a parent, open a child, grant access to a specialist; sign in as the specialist, see only that child, add a note; sign in as the parent again and revoke access.

## 12.4 Likely questions

| Question | Short answer | Who answers |
|---|---|---|
| Why WHO and CDC references? | Open, published standards; WHO Child Growth Standards are used for children 0 to 5; CDC 2022 checklists are evidence-informed and public domain. ASQ-3 and Denver II need a licence. | Arsen |
| Is the system a diagnostic tool? | No. It records data and shows signals that suggest talking to a specialist. | Arsen |
| How is children's data protected? | Parent-controlled per-child access, Argon2id passwords, short-lived tokens, consent at registration, storage in Kazakhstan (Law No. 94-V). | Zhan |
| Why a modular monolith in Go? | Two developers, one deployable service, clear module boundaries; see ADR-001. | Zhan |
| What is not done yet? | User conversations (document 02), supervisor feedback entries (document 11), the web client and the backend modules (milestones M2 to M4). | Both |

## 12.5 Before the pre-defense

- [ ] All documentation pull requests merged into `main`, each approved by the other student
- [ ] Links in document 10, section 10.1, and in this document open correctly
- [ ] YouTrack states match the repository (Done only for merged work)
- [ ] Tag `pre-defense-1` pushed
- [ ] Prototype opens from `prototype/index.html` on the presenting laptop
- [ ] Slides open; both speakers know their parts

## 12.6 After the pre-defense

| Date | Committee remark | Decision | Task | Status |
|---|---|---|---|---|
| | | | | |

Every remark is also added to document 11 and, when it needs work, to YouTrack as a task.