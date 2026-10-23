# 10. Project Management and Risks

## 10.1 Repository and tracking

| Item | Value |
|---|---|
| Repository | `child-development-monitor` on GitHub or GitLab (private is acceptable). **Link: https://github.com/felfir-bit/child-monitor** |
| Access | Both students and the supervisor have access. The committee receives access before each pre-defense. |
| Issue tracker | YouTrack project with key `DIP`. **Link: https://child-monitoring.youtrack.cloud/dashboard** (the project and tasks must be created in YouTrack; the tasks in 10.4 are the initial content). |
| Default branch | `main`, the reviewed baseline. |
| Submission tags | `pre-defense-1`, `pre-defense-2`, `final-pre-defense`. Tags are never moved or replaced. |

## 10.2 Working rules

These follow the Git and YouTrack requirements of the checklist.

1. **Each student commits from their own account.** Shared accounts are not used.
2. **Each task is a YouTrack item** with a responsible student, expected outcome, acceptance criteria and deadline. The task is marked done only when its acceptance criteria are met.
3. **Branch names** include the task ID: `DIP-<number>-<short-slug>`, for example `DIP-23-database-schema`.
4. **Commit messages** start with the task ID and describe one coherent change: `DIP-23: Add initial database schema and ER diagram`. Documentation and diagram changes are committed the same way.
5. **Commit continuously.** The history must show progression. A single upload before a pre-defense does not meet the requirement.
6. **Merges go through pull or merge requests.** Each request explains the change, references the YouTrack task, and describes how the change was checked.
7. **Review:** because this is a team project, the other student reviews every request before it is merged. The supervisor reviews selected significant changes at the checkpoints agreed in the weekly meetings.
8. **No secrets in the repository.** Configuration examples use placeholder values; `.env` is ignored.
9. **Dependencies:** the Go module contains `replace` directives that were needed in the development sandbox. On a normal machine they should be removed and `go mod tidy` run again; this is recorded as a task (DIP-19 in 10.4).

## 10.3 Allocation of responsibilities

The allocation is taken from the supervisor's justification (Башеева Ж., Обоснование возможности выполнения дипломной работы). It is not changed here.

| Student | Responsibilities (from the justification) |
|---|---|
| **Zhan Erkebulan** (Жан Еркебулан, GPA 2.70) | Backend: registration and authentication, roles, child profiles, access control, specialist notes, API documentation, containerization, monitoring. Own result: tested profile and access modules, server interfaces and deployment (Go, PostgreSQL, Docker, Git, Prometheus and Grafana). |
| **Tasimov Arsen Malekovich** (Тасимов Арсен Малекович, GPA 2.35) | Indicators, analytics and notifications: entering and storing development indicators, observation history, dynamics analysis, presentation of results to users, notifications, and testing and integration of his modules. Own result: tested indicator, history, analytics and notification modules with a user interface and documentation. |

Shared work (not assigned in the justification, to be divided by the students and recorded in YouTrack): monitoring model, literature review, existing-system comparison, technology comparison, requirements, diagrams, prototype, evidence collection, translation review, evaluation.

## 10.4 Initial task list (for import into YouTrack)

Status is the state on the date of this document (22 October 2026) and is updated in YouTrack.

| ID | Task | Owner | Acceptance criteria | Deadline | Status |
|---|---|---|---|---|---|
| DIP-1 | Create repository and folder structure | Zhan | Structure `config/ diagrams/ docs/ prototype/ src/ tests/ .gitignore README.md` exists; pushed by the owner | 22 Oct | Done |
| DIP-2 | Project proposal and scope (document 01) | Shared | Reviewed by supervisor | 23 Oct | Drafted |
| DIP-3 | Evidence of relevance: 3 to 5 user conversations (document 02) | Shared | Log section 2.4 has at least 3 entries with findings | 23 Oct | Not started |
| DIP-4 | Literature review (document 03) | Shared | At least 12 sources, at least 8 scientific; every link opened and bibliographic data checked | 23 Oct | Done: 12 scientific and 14 official sources, links checked on 22 Oct |
| DIP-5 | Existing system comparison (document 04) | Shared | 3 to 5 systems, 6 to 10 criteria; consumer apps tested for 30 minutes each | 23 Oct | 5 systems, 10 criteria from official sources; hands-on testing pending |
| DIP-6 | Technology comparison and ADRs (document 05, `docs/adr/`) | Shared | At least 3 decisions with 2 to 3 options each | 23 Oct | Drafted |
| DIP-7 | Requirements specification (document 06) | Shared | Priorities P0/P1/P2 and acceptance criteria for each requirement | 23 Oct | Drafted |
| DIP-8 | Architecture and four diagrams (document 07, `diagrams/`) | Shared | Four required diagrams plus data model, two sequence diagrams and the monitoring activity diagram; `.puml` sources with SVG and PNG exports, consistent names | 23 Oct | Done: eight diagrams rendered on 22 Oct |
| DIP-9 | Registration, login, JWT and Argon2id | Zhan | FR-AUTH-01 to FR-AUTH-04 pass tests | 23 Oct | Done: unit, HTTP and Postgres tests and e2e pass |
| DIP-10 | Roles and child profiles with age rule | Zhan | FR-ROLE-01, FR-CHILD-01 to FR-CHILD-03 pass tests | 23 Oct | Done: unit, HTTP and Postgres tests and e2e pass |
| DIP-11 | Access grants and visibility rules | Zhan | FR-ACC-01 to FR-ACC-05 pass the authorization matrix | 24 Oct | Done: tests and e2e pass |
| DIP-12 | Specialist notes with author-only changes | Zhan | FR-NOTE-01 to FR-NOTE-04 pass tests | 24 Oct | Done: tests and e2e pass |
| DIP-13 | OpenAPI specification and Swagger UI | Zhan | FR-DOC-01 and FR-DOC-02 | 24 Oct | Done: spec served, Swagger UI page served |
| DIP-14 | Dockerfile, docker-compose, Prometheus and Grafana | Zhan | FR-OPS-01 to FR-OPS-04 | 24 Oct | Code and config written; Docker not run |
| DIP-15 | Authorization matrix tests and API scenario script | Zhan | All 24 matrix cases automated | 24 Oct | Done: 34 matrix rows automated in service flows, HTTP tests and e2e |
| DIP-16 | Clickable prototype (document 08) | Shared | Screens for S1 to S6 | 24 Oct | Built, review pending |
| DIP-17 | Verification plan (document 09) | Shared | Test levels, metrics, conditions, baseline defined | 24 Oct | Drafted |
| DIP-18 | Growth measurements: data model, recording and revisions | Arsen | FR-GRW-01, FR-GRW-04 with tests | Final pre-defense | Implemented on 22 Oct: tests pass; Arsen to review and own |
| DIP-19 | Remove sandbox `replace` directives and verify build on a clean machine | Zhan | `go mod tidy` and `go build` pass with the default proxy | Final pre-defense | Planned |
| DIP-20 | Combined history and z-score changes | Arsen | FR-ANL-01, FR-ANL-02 with tests | Final pre-defense | Implemented on 22 Oct: tests pass; Arsen to review and own |
| DIP-21 | Z-scores, percentiles and chart series from the WHO standards | Arsen | FR-GRW-02, FR-GRW-03; M8 at most 0.01 against WHO `anthro` | Final pre-defense | Implemented on 22 Oct: 300 cases within 0.01 of the ported `anthro` algorithm; R package run pending |
| DIP-22 | Notifications and channel decision | Arsen | FR-NTF-01, FR-NTF-02; ADR records the channel | Final pre-defense | Implemented on 22 Oct: in-app channel, ADR-007 |
| DIP-23 | Supervisor feedback log (document 11) | Zhan | Every review comment has a decision and a status | Each checkpoint | Started |
| DIP-24 | Password policy following NIST SP 800-63B-4 | Zhan | FR-AUTH-02: 15 to 128 characters counted as Unicode; tests and OpenAPI updated | 24 Oct | Done: 15 to 128 characters, tests and OpenAPI updated |
| DIP-25 | Child sex and gestational age; corrected age in the API | Zhan | FR-CHILD-05, FR-CHILD-06; migration, store, service, handlers, OpenAPI, tests, prototype | 24 Oct | Done: migration 002, store, service, handlers, OpenAPI, tests |
| DIP-26 | Reference data: WHO LMS tables, WHO motor windows, CDC 2022 items with Russian and Kazakh texts | Arsen (translations reviewed by both) | FR-MS-01, NFR-REF-01, NFR-REF-02 | Final pre-defense | WHO tables and CDC/WHO catalog embedded; Russian draft; Kazakh texts and review pending |
| DIP-27 | Milestone checklists, answers and progress | Arsen | FR-MS-02 to FR-MS-04 with tests | Final pre-defense | Implemented on 22 Oct: tests pass; Arsen to review and own |
| DIP-28 | Prototype mockups for growth chart, checklist, signals and reminders | Shared | Screens for S7 to S10 in `prototype/` | Pre-defense 2 | Planned |
| DIP-29 | Signals G1, G2, M1, W1 and their wording | Arsen | FR-SIG-01 to FR-SIG-03; M9 at 100% | Final pre-defense | Implemented on 22 Oct: G1, G2, M1, W1 with boundary tests and wording test |
| DIP-31 | Embedded migrations applied at start-up | Zhan | Empty and existing databases migrate; compose no longer mounts SQL files | 24 Oct | Done |
| DIP-32 | Consent recording at registration | Zhan | FR-AUTH-06 with tests | 24 Oct | Done |
| DIP-33 | Demo data script for the pre-defense | Shared | `tests/demo/seed_demo.sh` creates a synthetic family with signals | 24 Oct | Done |
| DIP-30 | Monitoring model (document 00) | Shared | Reviewed by the supervisor; open questions in document 11 answered | 24 Oct | Drafted |

## 10.5 Milestones

| Milestone | Content | Date |
|---|---|---|
| M1 Pre-defense 1 | Repository with all analysis documents, initial requirements, diagrams, prototype, verification plan, YouTrack link, progressive commits from both students | 24 October 2026 |
| M2 Core backend | Zhan's modules implemented and tested; OpenAPI spec live | Agreed with supervisor |
| M3 Indicator modules | Arsen's modules implemented and tested | Agreed with supervisor |
| M4 Integration | Both modules integrated, end-to-end scenario passes | Agreed with supervisor |
| M5 Evaluation | Usability sessions and performance runs completed; results documented | Before pre-defense 2 |
| M6 Final pre-defense | Tag `final-pre-defense`, deployment instructions, evaluation report, limitations | Date set by the committee |

The dates after M1 are set in the weekly supervisor meeting and recorded in YouTrack.

## 10.6 Supervision

Following the justification: weekly meetings with the supervisor; tasks and commits in the shared repository; individual demonstrations at each checkpoint. Each meeting produces entries in document 11.

## 10.7 Dependencies

| Dependency | Between | Mitigation |
|---|---|---|
| Access service interface | Zhan provides, Arsen uses | Interface documented in document 07, section 7.10; Arsen's tests use the same service |
| Child sex and gestational age | Zhan provides (DIP-25), Arsen uses for z-scores and corrected age | Done; `domain.AgeOf` is the single age calculation |
| Reference data (WHO tables, milestone items) | Arsen maintains (DIP-26), both review translations | Embedded versioned files; source and version in every response and in `GET /api/v1/reference` |
| API contract | Client and both backend modules | OpenAPI spec is the contract; changes need a pull request |
| Shared database | Both | Each module owns its tables; migrations are reviewed by the other student |
| Interview results | Requirements | Assumptions are labeled in document 02 until evidence exists |
| Notification channel | Arsen's module | In-app, ADR-007 |
| Supervisor feedback | All documents | Review at each checkpoint, logged in document 11 |

## 10.8 Risks

Likelihood (L) and impact (I) are rated H, M or L.

| ID | Risk | L | I | Mitigation | Owner |
|---|---|---|---|---|---|
| R1 | Not enough time for the first pre-defense (24 October) | H | H | P0 requirements and checklist items first; code polish after the checklist is complete | Both |
| R2 | Interviews are not done in time, so the evidence section stays empty | M | H | Schedule 3 short conversations by 23 October; the document already labels the state honestly | Shared |
| R3 | Integration problems between the two modules | M | H | Shared interface in document 07; OpenAPI as contract; integration check at M4 | Both |
| R4 | Commit history looks uploaded at once, which fails the progression criterion | M | H | Commit each completed task; no bulk upload; history is not rewritten after submission | Both |
| R5 | Security defect in access rules | M | H | Authorization matrix in document 09 with automated tests (M1) | Zhan |
| R6 | Notification channel undecided | L | M | Closed: in-app channel (ADR-007); other channels can read the same rows | Arsen |
| R7 | Broken or outdated links in the documents | L | M | All links checked on 22 October 2026; recheck before each pre-defense and record the date in document 03 | Shared |
| R8 | Scope growth (diagnosis features, native apps) | M | M | Out-of-scope list in document 01 | Both |
| R9 | Consent and legal wording not checked against the official text | M | M | Check articles of law 94-V with the supervisor before submission | Shared |
| R10 | Build depends on a sandbox workaround | M | M | DIP-19; Dockerfile builds from `go.sum` | Zhan |
| R11 | Misreading of signals as clinical results | M | H | Fixed signal texts without diagnostic words (FR-SIG-02); source shown on every chart; M10 in the usability study | Shared |
| R12 | Synthetic data does not represent real use | H | L | Limitation stated in document 09; usability sessions with real users in the final study | Shared |
| R13 | Wrong z-scores from errors in the LMS computation or the reference tables | M | H | Test oracle WHO `anthro` (M8); reference data versioned (NFR-REF-01) | Arsen |
| R14 | Licensing of milestone content | L | M | Only free CDC and WHO materials with attribution; no ASQ-3 or Denver II items (document 05, decision 7) | Shared |
| R15 | Translation of milestone items changes their meaning | M | M | Review by both students and the supervisor; check in interviews (assumption A8) | Shared |
| R16 | Missing `sex` field blocks Arsen's work | L | H | Closed: DIP-25 done | Zhan |
| R17 | The second student cannot explain modules he did not write himself at the defense | M | H | Arsen reviews every monitoring file, re-runs the tests, commits his changes in his own name and presents the module walkthrough in document 07, section 7.4 | Arsen |

## 10.9 Status at 22 October 2026 (honest summary)

Done in the repository: folder structure, analysis documents (drafts), diagrams and prototype (see their own status lines), the whole backend described in document 00: Zhan's modules (DIP-9 to DIP-15, DIP-24, DIP-25, DIP-31, DIP-32) and the monitoring modules (DIP-18, DIP-20 to DIP-22, DIP-27, DIP-29), verified as recorded in document 09, section 9.9.

The monitoring modules were implemented on 22 October to have a working end-to-end system for the pre-defense. They are Arsen's area: before the pre-defense he reviews them, runs the tests and the demo, and owns all further changes (risk R17).

Not done: evidence from real conversations (DIP-3), hands-on testing of the compared apps (DIP-5), Kazakh texts and review of the Russian texts (DIP-26), the R package run for M8, prototype mockups for S7 to S10 (DIP-28), the React client, usability and performance evaluation (document 09), running the Docker stack (DIP-14).
# DIP-34: Add repository and YouTrack links - generated at 2026-10-24 15:15:00 +0500
