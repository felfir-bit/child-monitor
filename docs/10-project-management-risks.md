# 10. Project Management and Risks

## 10.1 Repository and tracking

| Item | Value |
|---|---|
| Repository | [github.com/felfir-bit/child-monitor](https://github.com/felfir-bit/child-monitor) |
| Access | Both students and the supervisor; the committee receives access before each pre-defense |
| Issue tracker | [YouTrack, project DIP](https://chil-monitoring-system.youtrack.cloud/projects/DIP) |
| Default branch | `main`, the reviewed baseline |
| Submission tags | `pre-defense-1`, `pre-defense-2`, `final-pre-defense`; tags are never moved or replaced |

## 10.2 Working rules

1. **Own accounts.** Each student commits from their own GitHub account: Zhan `felfir-bit`, Arsen `k1ays`. Shared accounts are not used.
2. **Every change belongs to a YouTrack task** with an owner, expected result, acceptance criteria and a due date.
3. **Branches** are named `DIP-<n>-<slug>`, for example `DIP-6-requirements`; some early branches carry the prefix `feature/`.
4. **Commit messages** start with the task ID: `DIP-6: Mark requirements as specified and link assumptions`.
5. **Pull requests only.** Changes reach `main` only through a pull request that references the task and is reviewed and approved by the other student.
6. **Continuous commits.** The history shows progress task by task; there is no single upload before a pre-defense, and published history is not rewritten.
7. **No secrets and no personal data** in the repository. `.env` files are ignored; examples contain placeholders. Interview notes contain codes only.
8. **Done means merged.** A task is marked Done in YouTrack only when its pull request is merged into `main`.

## 10.3 Responsibilities

The module split follows the supervisor's justification document and is not changed here.

| Student | Modules |
|---|---|
| Zhan Erkebulan (Жан Еркебулан) | Authentication and roles, child profiles, access control, specialist notes, API documentation, containerization and monitoring; project management |
| Tasimov Arsen Malekovich (Тасимов Арсен Малекович) | Growth and development indicators, observation history, dynamics analytics, visualization, notifications |

The analysis and design documents are divided by task in 10.4. The web client is built by both students, split by screens. Each student reviews the other's pull requests and must be able to explain the other's part at a defense (RSK-13).

## 10.4 Tasks for pre-defense 1

The tasks, assignees and priorities are those of the YouTrack project DIP. Branches are the ones in the repository. Priority: C = critical, H = high, N = normal.

Epics: **Research & Planning** (DIP-1 to DIP-4), **Requirements & Architecture** (DIP-5 to DIP-7), **Prototype & Verification** (DIP-8, DIP-9), **Management & Review** (DIP-10, DIP-11).

| ID | Task | Owner | Priority | Branch | Files | Due | Status |
|---|---|---|---|---|---|---|---|
| DIP-1 | Prepare Project Proposal, Scope and README | Arsen | H | committed to `main` (before the pull request rule) | `README.md`, `.gitignore`, `docs/README.md`, `docs/01-project-proposal.md` | 22 Oct | Done |
| DIP-2 | Document Evidence of Relevance | Zhan | N | DIP-2-relevance-evidence | `docs/02-evidence-of-relevance.md`, `docs/evidence/` | 22 Oct | Done |
| DIP-3 | Conduct Literature Review | Zhan | H | committed to `main` together with DIP-2 | `docs/03-literature-review.md` | 22 Oct | Done |
| DIP-4 | Compare Existing Systems | Arsen | H | DIP-4-system-comparison | `docs/04-existing-systems-comparison.md` | 23 Oct | Done |
| DIP-5 | Compare Technology Alternatives | Arsen | H | DIP-5-technology-comparison | `docs/05-technology-comparison.md`, `docs/adr/` | 23 Oct | Done |
| DIP-6 | Specify Functional and Non-Functional Requirements | Arsen | N | DIP-6-requirements | `docs/00-monitoring-model.md`, `docs/06-requirements-specification.md` | 23 Oct | Done |
| DIP-7 | Design System Architecture Diagrams | Zhan | H | feature/DIP-7-architecture | `docs/07-architecture.md`, `diagrams/` | 24 Oct | Done |
| DIP-8 | Prepare UX Prototype | Zhan | C | feature/DIP-8-ux-prototype | `prototype/`, `docs/08-ux-prototype.md` | 24 Oct | Done |
| DIP-9 | Define Verification and Evaluation Plan | Arsen | H | DIP-9-adding-verification-plan | `docs/09-verification-plan.md` | 24 Oct | Done |
| DIP-10 | Document Project Risks, Milestones and Responsibilities | Arsen | N | feature/DIP-10-project-management | `docs/10-project-management-risks.md` | 24 Oct | Done |
| DIP-11 | Supervisor Feedback and Project Improvements | Zhan | C | DIP-11-supervisor-feedback | `docs/11-supervisor-feedback.md`, `docs/12-pre-defense-preparation.md`, tag `pre-defense-1` | 24 Oct | In progress |

Revisions of a document after its task is Done are committed under the same task ID through a new pull request. An earlier branch `feature/DIP-12-pre-defense` carries an old task number; its content is continued under DIP-11. DIP-11 is Done when the last pull request is merged and the tag `pre-defense-1` is pushed. Tasks for milestones M2 to M6 are created in YouTrack after pre-defense 1, with the same rules.

## 10.5 Milestones

| Milestone | Content | Date |
|---|---|---|
| M1 Pre-defense 1 | Documentation only: documents 00 to 12, ADRs, diagrams, prototype, verification plan, YouTrack project, reviewed pull requests from both students | 24 October 2026 |
| M2 Zhan's modules | Authentication, roles, profiles, access control, notes, OpenAPI, Docker Compose, Prometheus and Grafana; authorization matrix automated | Agreed with the supervisor |
| M3 Arsen's modules | Growth measurements, z-scores (accuracy metric M8), milestones, signals, history, notifications | Agreed with the supervisor |
| M4 Integration | Both modules integrated; React client; end-to-end scenario of document 00, 0.8 | Agreed with the supervisor |
| M5 Evaluation | Usability sessions and performance runs (document 09) | Before pre-defense 2 |
| M6 Final pre-defense | Tag `final-pre-defense`, evaluation report, deployment instructions, limitations | Date set by the committee |

## 10.6 Supervision

Weekly meetings with the supervisor; tasks and commits in the shared repository; individual demonstrations at each checkpoint. Every comment is recorded in document 11 with a decision and a task.

## 10.7 Dependencies

| Dependency | Between | Mitigation |
|---|---|---|
| Access policy (owner or active grant) | Zhan provides, Arsen uses | Interface in document 07, section 7.10; one policy for every child-scoped record |
| Child sex and gestational age | Zhan's profile module, Arsen's z-scores and corrected age | Specified in FR-CHILD-05 and FR-CHILD-06; delivered at M2 before Arsen's work at M3 |
| Reference data (WHO tables, milestone items) | Arsen maintains, both review translations | Versioned files with source (ADR-005) |
| API contract | Client and both modules | OpenAPI is the contract; changes only by pull request |
| Interview results | Requirements | Assumption labels in document 06, 6.1a follow document 02, 2.4; new interviews update both |
| Supervisor feedback | All documents | Logged in document 11 at each checkpoint |

## 10.8 Risk register

Likelihood (L) and impact (I) are rated H, M or L.

| ID | Risk | L | I | Mitigation | Owner |
|---|---|---|---|---|---|
| RSK-1 | Not enough time between milestones | H | H | P0 requirements first; weekly progress check against 10.5 | Both |
| RSK-2 | Interviews are not finished in time | L | H | Closed for M1: four interviews logged on 23 October 2026; one or two more specialists planned before pre-defense 2 | Arsen |
| RSK-3 | Interview sample is small and not representative (3 parents, 1 pediatrician, all online) | H | M | Results presented as qualitative; limitation stated in document 02, 2.7; add a speech therapist or teacher | Arsen |
| RSK-4 | Commit history looks uploaded at once | M | H | One branch and pull request per task; commits during the work; no rewriting of history | Both |
| RSK-5 | Personal data committed to Git | L | H | Codes only in notes; review of every evidence pull request; synthetic data only | Both |
| RSK-6 | Signals are read as diagnoses | M | H | Fixed non-diagnostic texts (FR-SIG-02); source on every chart; comprehension metric M10 | Arsen |
| RSK-7 | Wrong z-scores from errors in the LMS computation or the tables | M | H | WHO `anthro` as test oracle (metric M8); versioned reference data | Arsen |
| RSK-8 | Translation changes the meaning of milestone items | M | M | Review by both students and the supervisor; follow-up question FU1 | Both |
| RSK-9 | Integration problems between the two modules | M | H | Shared access policy and OpenAPI contract; integration at M4 | Both |
| RSK-10 | Broken or outdated links in the documents | L | M | Link check before each pre-defense; date recorded in document 03 | Zhan |
| RSK-11 | Legal wording (consent, storage) not checked against the official text | M | M | Questions to the supervisor in document 11; read the current text of R13 | Zhan |
| RSK-12 | Scope growth (diagnosis, native apps, integrations) | M | M | Exclusions in document 01, VIII.B; changes only through the supervisor | Both |
| RSK-13 | A student cannot explain the other's part at a defense | M | H | Mandatory review of every pull request; each student presents one part of the other's design at a rehearsal | Both |
