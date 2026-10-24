# 12. Pre-defense Preparation

Pre-defense 1 (milestone M1, document 10): **24 October 2026**. YouTrack task: **DIP-11**.

This document checks the submission against the M1 content, records who presents what and lists what is still open. After the pre-defense it receives the committee's remarks, which are also copied into document 11.

## 12.1 Links

| Item | Link |
|---|---|
| Repository | https://github.com/felfir-bit/child-monitor |
| YouTrack | https://child-monitoring.youtrack.cloud |
| Documentation index | [docs/README.md](README.md) |
| Submission tag | `pre-defense-1` |

## 12.2 M1 checklist

| No. | Item | Where | Status |
|---|---|---|---|
| 1 | Monitoring model | `docs/00-monitoring-model.md` | Done |
| 2 | Project proposal and scope | `docs/01-project-proposal.md` | Done |
| 3 | Evidence of relevance: documentary findings | `docs/02-evidence-of-relevance.md`, 2.1 | Done |
| 4 | Evidence of relevance: interviews | `docs/02-evidence-of-relevance.md`, 2.5 | Done: 3 parents (P1–P3), 1 pediatrician (SP1) |
| 5 | Literature review (12 scientific, 14 official sources) | `docs/03-literature-review.md` | Done |
| 6 | Comparison of five existing systems | `docs/04-existing-systems-comparison.md` | Done (hands-on testing is a follow-up task) |
| 7 | Technology comparison and seven ADRs | `docs/05-technology-comparison.md`, `docs/adr/` | Done |
| 8 | Requirements with priorities and acceptance criteria | `docs/06-requirements-specification.md` | Done |
| 9 | Architecture and eight diagrams | `docs/07-architecture.md`, `diagrams/` | Done |
| 10 | UX prototype (SC1 to SC6) | `prototype/`, `docs/08-ux-prototype.md` | Done; SC7 to SC10 planned |
| 11 | Verification and evaluation plan | `docs/09-verification-plan.md` | Done |
| 12 | Milestones, risks, responsibilities | `docs/10-project-management-risks.md` | Done |
| 13 | Supervisor feedback log | `docs/11-supervisor-feedback.md` | Open: no feedback recorded yet |
| 14 | Submission tag | `pre-defense-1` | To do after the last merge |

A row is Done only when its pull request is merged into `main`.

## 12.3 Presentation plan

| Part | Content | Speaker | Time |
|---|---|---|---|
| 1 | Problem, users, aim, objectives (documents 01, 02) | Zhan | 2 min |
| 2 | Literature and existing systems (documents 03, 04) | Arsen | 2 min |
| 3 | Monitoring model and signals (document 00) | Arsen | 2 min |
| 4 | Requirements, technology and architecture (documents 05, 06, 07) | Zhan | 2 min |
| 5 | Prototype walkthrough (document 08) | Arsen | 2 min |
| 6 | Verification plan, risks and plan to M2 (documents 09, 10) | Zhan | 2 min |

Prototype walkthrough: sign in as `parent@example.com`, open a child, grant access to a specialist; sign in as `specialist@example.com`, see only that child, add a note; sign in as the parent again, read the note and revoke access.

## 12.4 Likely questions

| Question | Short answer | Who answers |
|---|---|---|
| Who did you talk to? | Four online needs interviews on 23 October 2026: three parents of children aged 7 months to 3 years 2 months and one pediatrician (document 02, 2.5). They support A1, A2, A4 and A6; A3 rests on one specialist; preferences on PWA versus a store app were split. | Arsen |
| Why is `src/` empty? | Pre-defense 1 is the analysis and design milestone. Implementation starts at M2 (Zhan's modules) and M3 (Arsen's modules); the requirements and the authorization matrix are ready to become the first tests. | Zhan |
| Is the system a diagnostic tool? | No. It records measurements and answers, compares them with WHO and CDC references and shows signals that suggest talking to a specialist. | Arsen |
| Why WHO and CDC references? | They are published, free and cover ages 0 to 5; ASQ-3 and Denver II need a licence. The national scales of Order No. 704 are an open question for the supervisor. | Arsen |
| How is children's data protected? | Per-child access controlled by the parent, Argon2id passwords, one-hour tokens, consent at registration, minimal data, storage in Kazakhstan (Law No. 94-V). | Zhan |
| Why a modular monolith in Go? | Two developers, one deployable service, clear module boundaries; see ADR-001 and document 07. | Zhan |
| How will you know z-scores are correct? | They are compared with WHO's own `anthro` software on at least 200 synthetic cases; the difference must be at most 0.01 (metric M8). | Arsen |
| What is not done yet? | More specialist interviews, supervisor feedback, mockups for SC7 to SC10, hands-on testing of the compared apps, and all code (M2 to M4). | Both |

## 12.5 Before the pre-defense

- [ ] All documentation pull requests merged into `main`, each approved by the other student
- [ ] YouTrack statuses match the repository (Done only for merged work)
- [ ] Links in the README and in 12.1 open correctly
- [ ] Interview status in document 02 matches the notes actually committed
- [ ] Prototype opens from `prototype/index.html` on the presenting laptop
- [ ] Slides open; both speakers know their parts and the other's part
- [ ] Tag `pre-defense-1` pushed after the last merge

## 12.6 After the pre-defense

| Date | Committee remark | Decision | Task | Status |
|---|---|---|---|---|
| | | | | |

Every remark is also added to document 11 and, when it needs work, to YouTrack as a task.
