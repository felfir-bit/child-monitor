# 9. Verification and Evaluation Plan

## 9.1 Goal

Demonstrate that the system achieves its aim (document 01): monitoring of growth and milestones against the WHO and CDC references, correctly computed and worded, in a record that parents control and specialists can contribute to, with correct access behaviour, a working API and usable screens. The plan defines the tests, the outcome metrics, the measurement conditions and the baseline.

## 9.2 Test levels

| Level | What it covers | Tool or method | Where |
|---|---|---|---|
| Unit | Age and corrected age, validation, password hashing, token issue and validation, configuration, reference catalog, message texts | `go test` | `src/internal/**/_test.go` |
| Service flows | 30 behavioural scenarios covering both students' modules and the authorization rules | `go test` (in-memory store) | `src/internal/service/servicetest` |
| Integration | The same 30 scenarios against a real PostgreSQL 16 database, including constraints, cascades and the embedded migrations | `go test` with `TEST_DATABASE_URL` | `src/internal/store/postgres` |
| HTTP | Status codes, error body shape, authentication on protected routes | `go test` with Fiber's test helper | `src/internal/httpapi` |
| API scenarios | The main scenario end-to-end over HTTP against the running stack | `tests/e2e/run_scenarios.sh` (curl) and `tests/api/scenarios.http` | `tests/` |
| Contract | The OpenAPI document is valid and lists all endpoints; every server route is documented | `kin-openapi` v0.128.0 `Validate`; `TestEveryRouteIsDocumented` | `src/api/openapi.yaml` |
| Static checks | Formatting and vet | `gofmt -l`, `go vet ./...` | CI-style local run |
| Performance | Latency under concurrent load | Load generator such as `hey` (to record version) | Compose stack on a laptop |
| Usability | Task success and time on the prototype and the implemented screens | Walkthrough with 5 participants | Interview room or video call |
| Security review | Password storage, token handling, secrets, data minimization | Checklist in 9.6 | Repository and database |
| Reference computation | Z-scores and percentiles against WHO's reference algorithm; checklist selection by age and corrected age; signal boundaries | `go test` with `src/internal/anthro/testdata/who_reference.csv` (300 cases); service flows | `src/internal/anthro`, `src/internal/service` |
| Wording | Signal and notification texts in all languages contain none of the forbidden words (FR-SIG-02) | `TestSignalTextsAvoidDiagnosticWords` | `src/internal/service/messages_test.go` |

## 9.3 Authorization matrix

This matrix is the most important test. Each row becomes a test case. The expected status is the required result. "Owner" means the parent who created the child; "Other parent" is any other parent account; "Granted" means an active grant; "Revoked" means a grant that has been revoked.

| # | Actor | Operation on child C (owned by Owner) | Expected |
|---|---|---|---|
| 1 | Owner | GET child | 200 |
| 2 | Other parent | GET child | 404 |
| 3 | Owner | PATCH child | 200 |
| 4 | Other parent | PATCH child | 404 |
| 5 | Granted specialist | GET child | 200 |
| 6 | Granted specialist | PATCH child | 403 |
| 7 | Granted specialist | DELETE child | 403 |
| 8 | Ungranted specialist | GET child | 404 |
| 9 | Revoked specialist | GET child, then GET notes | 404, 404 |
| 10 | Owner | POST grant for a valid specialist | 201 |
| 11 | Owner | POST grant for a valid specialist again | 409 |
| 12 | Owner | POST grant for an unknown email | 422 |
| 13 | Owner | POST grant for a parent account | 422 |
| 14 | Granted specialist | POST grant | 403 |
| 15 | Granted specialist | POST note | 201 |
| 16 | Ungranted specialist | POST note | 404 |
| 17 | Owner | POST note | 403 |
| 18 | Owner | GET notes | 200 |
| 19 | Other granted specialist (not the author) | PATCH note of author | 403 |
| 20 | Author specialist | PATCH own note | 200 |
| 21 | Author specialist | DELETE own note | 204 |
| 22 | Owner | PATCH a note | 403 |
| 23 | Any user, after token expiry | any protected endpoint | 401 |
| 24 | Any user, tampered token | any protected endpoint | 401 |
| 25 | Granted specialist | POST measurement, POST milestone answers | 201, 201 (author role `specialist`) |
| 26 | Ungranted specialist | GET measurements, chart, checklist, signals, history, overview; POST measurement or answers | 404 for each |
| 27 | Owner | PUT or DELETE a measurement recorded by the granted specialist | 403 |
| 28 | Author of a measurement | PUT, then DELETE own measurement | 200, 204; two revisions kept |
| 29 | Ungranted specialist | GET revisions of a measurement | 404 |
| 30 | Granted specialist | POST discuss on an open signal | 200 |
| 31 | Owner | POST discuss on the same signal again | 409 |
| 32 | Ungranted specialist | POST discuss | 404 |
| 33 | Specialist | POST read on the parent's notification | 404 |
| 34 | Owner | DELETE child | 204; measurements, answers, signals and notifications removed |

The 403 and 404 rules follow document 06, section 6.1. If the implementation returns a different code for a row, either the code or this table changes, and the change is recorded in the test report.

## 9.4 Outcome metrics

| ID | Metric | Definition | Target | Demonstrates |
|---|---|---|---|---|
| M1 | Authorization correctness | Share of the 34 matrix cases that return the expected status | 100% | Aim O2 |
| M2 | Contract conformance | Share of endpoints in document 07 that exist in the OpenAPI spec and respond as specified | 100% | Aim O3, FR-DOC-01 |
| M3 | Time to find a past note | Median seconds for a participant to find a specific note written three months earlier | System median at most 50% of the baseline median | Aim O1, A1 |
| M4 | Unaided task success | Share of participants who complete scenarios S2 to S6 without help | At least 80% | Usability of the screens |
| M5 | Perceived usability | System Usability Scale (SUS) score averaged over participants | At least 70: the overall mean SUS across 964 surveys was 69.5, and the adjective "good" corresponded to a mean of 71.4 (Bangor A, Kortum P, Miller J. Determining what individual SUS scores mean: adding an adjective rating scale. *Journal of Usability Studies*. 2009;4(3):114-123, [PDF](https://uxpajournal.org/wp-content/uploads/sites/7/pdf/JUS_Bangor_May2009.pdf)) | Usability |
| M8 | Z-score accuracy | Maximum absolute difference between the system's z-scores and those of WHO's `anthro` algorithm on a synthetic set of at least 200 measurements covering both sexes, ages 0 to 60 months, all six indicators and values beyond ±3 SD | At most 0.01 | Aim O4, FR-GRW-02 |
| M9 | Signal correctness | Share of boundary test cases (inside and outside ±2, implausible values, one day before and on a checklist age, inside and after a WHO motor window, with and without prematurity, `not_sure`, resolution) that produce exactly the expected signals | 100% | FR-SIG-01, FR-MS-02 |
| M10 | Chart reading | Share of participants who correctly say whether a plotted value lies between the −2 and +2 lines, and who describe a signal as "a reason to talk to a doctor" rather than a diagnosis | At least 80% | Assumption A4, UX principle 3 |
| M6 | Latency | 95th percentile response time for read and write endpoints | At most 300 ms with 20 concurrent users | NFR-PERF-01 |
| M7 | Test coverage of service layer | Statement coverage reported by `go test -cover ./internal/service/...` | At least 70% | NFR-MNT-01 |

**Note on M3 and M4.** With five participants, results are indicative only. The report states this limitation explicitly and does not generalize to the population.

## 9.5 Measurement conditions

- **Data:** synthetic. Two parent accounts, three specialist accounts, ten children aged 0 to 5 years (invented names and dates), about 100 notes spread over the children. The dataset is a script in `tests/`, so that every run starts from the same state.
- **Environment:** development laptop, Docker Desktop, the compose stack from `src/`, the same browser for all runs (Chromium-based), Wi-Fi off during latency runs to remove network noise.
- **Latency runs (M6):** 20 concurrent virtual users, 60 seconds, mixed read and write requests, repeated three times; the reported value is the median of the three 95th percentiles.
- **Usability sessions (M3, M4, M5):** five participants, one session each, 30 minutes. Each participant completes the tasks on the prototype or the implemented client. Timing starts when the task is read aloud and stops when the participant states that the note has been found or the task is abandoned.
- **Baseline (M3):** each participant also finds a note in their own usual method (notes app, paper notebook or messages), using the same dataset content written into that method. The baseline is the current practice, not an existing product.
- **Baseline (M8):** WHO's own implementation (R package `anthro`, document 03, R4). The tables are WHO's files from `github.com/WorldHealthOrganization/anthro` (`data-raw/growthstandards`, package version 1.1.0.9000). `tests/reference/generate_who_fixture.py` ports the `anthro_zscores` algorithm and writes 300 cases with a fixed seed (both sexes, 16 fixed boundary ages including 0, 730, 731 and 1826 days, the rest random; weights from 0.6 to 1.6 of the median so that values beyond ±3 SD are included). `tests/reference/verify_with_who_anthro.R` runs the same cases through the R package; it must be run on a machine with R and its output attached to the report.
- **Growth and milestone data:** synthetic children with invented measurements chosen to fall inside, near and outside the ±2 SD lines, and invented checklist answers; no real data.
- **Ethics:** participants are adults, consent is verbal and recorded in the report without names. Recordings are not kept.

## 9.6 Security and privacy checks

| Check | Method | Pass condition |
|---|---|---|
| Password storage | Read the `users` table | No plaintext; hash starts with `$argon2id$` |
| Token validation | Send tampered, expired and `alg: none` tokens | All return 401 |
| Secret handling | Search the repository for key-like strings; check `.gitignore` | No real secrets; `.env` ignored |
| Enumeration | Compare 404 bodies for "not yours" and "does not exist" | Identical bodies |
| Error leakage | Trigger a database error in a test | The response contains only the generic message |
| Data minimization | Review the schema | Only the fields listed in NFR-PRV-01 |
| Logs | Read logs after a login and a failed login | No password or token in logs |

## 9.7 Reporting

The evaluation report in the final submission contains: the test commands and their output, the authorization matrix with results, the metric values with the measurement conditions, the limitations of the sample, and the decisions taken after each failed check.

## 9.8 Acceptance for the first pre-defense (24 October)

Required at the first pre-defense:

- the unit, service, integration and HTTP tests run and pass;
- the OpenAPI spec exists, is valid and Swagger UI loads (M2 in its first form);
- the test plan (this document) and the scenario files exist.

## 9.9 Results on 22 October 2026

Environment: Go 1.24.7, PostgreSQL 16.15, Linux; API built from `src/` and run against an empty database.

| Check | Result |
|---|---|
| `gofmt -l .` and `go vet ./...` | No output, no findings |
| `go test -race ./...` | All packages pass |
| Service flows on PostgreSQL (`TEST_DATABASE_URL`) | 30 scenarios, 50 test cases with subtests, all pass |
| End-to-end script (`tests/e2e/run_scenarios.sh`) | 87 of 87 checks pass, including the scenario of document 00, section 0.8 |
| M1 authorization matrix | 34 of 34 rows covered by service flows, HTTP tests and the e2e script; all as expected |
| M2 contract | OpenAPI 3.0.3 valid (`kin-openapi` v0.128.0), 28 paths; every server route documented (test) |
| M7 coverage | `internal/service` 85.6%; `anthro` 84.9%; `httpapi` 77.8%; `reference` 72.5%; `domain` 70.2% |
| M8 z-score accuracy | 300 of 300 cases within 0.01 of the ported `anthro` algorithm for all six indicators; the run through the R package itself is pending (no R in the build environment) |
| M9 signal correctness | All boundary cases in the service flows pass |
| Migrations | Empty database: `001_init` and `002_monitoring` applied; database with the old schema: only `002_monitoring` applied |

Not yet measured: the usability study (M3, M4, M5, M10) and the latency runs (M6), planned for the final pre-defense when the client exists; the Docker stack (FR-OPS-02, FR-OPS-03) on a machine with Docker.
