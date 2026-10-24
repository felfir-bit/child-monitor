# 6. Requirements Specification

## 6.1 Conventions

- **Priority:** P0 = must have for the project to be considered working; P1 = should have, planned for the final defense; P2 = could have, future work.
- **Status:** the state of the requirement at the time of this document. The lead maintains it in YouTrack; this table is the baseline.
- **Acceptance criteria** are written so that each one can be checked by a test, a request or an observation (see document 09 for the procedure).
- **Assumption** marks a requirement that depends on an unverified assumption from document 02, section 2.4 (see 6.1a).
- **Roles:** *Parent* owns child profiles; *Specialist* works with children granted by a parent. *Actor* means any authenticated user.
- **HTTP status conventions:** 401 when the request is not authenticated; 403 when the actor can see the resource but may not perform the action; 404 when the actor cannot see the resource at all (this hides the existence of other users' children); 409 for conflicts; 400 for malformed JSON, unknown fields or an invalid field value (format, length, allowed values, input limits); 422 for a well-formed value that breaks a rule about stored data (birth date range, a record date before birth or in the future, standing height before 9 months, an unknown specialist or milestone item).

**Status values:** *Specified*: the requirement and its acceptance criteria are defined and reviewed for pre-defense 1; implementation is planned for milestones M2 to M4 (document 10). *Planned*: specified but scheduled after the final defense scope is agreed. *Future work*: outside version 1. No code exists in this documentation submission, so every requirement is at most Specified.

## 6.1a Research traceability

Requirements that depend on assumptions A1 to A8 (document 02, section 2.4) are marked below. The assumptions were tested in four needs interviews (P1 to P3, SP1; document 02, section 2.5); a requirement built on an assumption that is not yet supported remains labelled **Assumption**. When an assumption is supported, the label becomes **Supported (participant codes)**, with the same meaning as in document 02, section 2.4; when it is contradicted, the requirement is revised and the change is logged in document 11.

| Assumption | Requirement area | Interview evidence | Other verification |
|---|---|---|---|
| A1, A7 | FR-GRW, FR-ANL | Supported (P1, P2, P3; SP1 for A7); head circumference often not tracked | Retrieval time M3 (document 09) |
| A2 | FR-ACC | Supported (P1, P2, P3, SP1) | Access and revoke walkthrough, M4 |
| A3 | FR-NOTE, FR-MS-03 | Assumption: partly supported (SP1, P2); one specialist only | More specialist interviews |
| A4 | FR-SIG, FR-NTF | Supported (P1, P2, P3, SP1) | Chart and wording comprehension, M10 |
| A5 | ADR-004 (client) | Mixed: P1, P3 web app; P2 store app | Design decision; checked in the usability sessions |
| A6 | NFR-SEC, NFR-PRV | Supported (P1, P2, P3); also R13 and S12 | Security checks, document 09, 9.6 |
| A8 | FR-MS-01, NFR-REF-02 | Assumption: partly supported (P1, P2, P3, FU1); language not recorded | Translation review with the supervisor |

## 6.2 Functional requirements: authentication and roles (Zhan)

| ID | Requirement | Priority | Acceptance criteria | Status |
|---|---|---|---|---|
| FR-AUTH-01 | A user can register as a parent or as a specialist with email, password and full name. | P0 | `POST /api/v1/auth/register` returns 201 for valid input; a duplicate email returns 409; a malformed email or missing field returns 400. Email is stored lowercased. | Specified |
| FR-AUTH-02 | Passwords are 15 to 128 characters long (counted as Unicode characters, no composition rules, NIST SP 800-63B-4, document 05, T3) and are stored only as Argon2id hashes. | P0 | The database contains no plaintext password; the stored value starts with `$argon2id$`; a 14-character password returns 400; a 64-character Cyrillic password is accepted. | Specified |
| FR-AUTH-03 | A registered user can log in and receive a bearer token. | P0 | Correct credentials return 200 with `access_token`, `token_type: Bearer` and `expires_in: 3600`. Wrong password and unknown email both return 401 with the same message. | Specified |
| FR-AUTH-04 | Every protected endpoint requires a valid token. | P0 | Requests with no token, a tampered token, an expired token or a token with `alg: none` return 401. | Specified |
| FR-AUTH-05 | A user can read their own profile. | P1 | `GET /api/v1/me` returns the user's id, email, full name and role, and no password data. | Specified |
| FR-AUTH-06 | Registration records the user's consent to the processing of personal data (Law No. 94-V, articles 7 and 8) with the text version and time. | P0 | Registration without `accept_terms: true` returns 400; `GET /api/v1/me` returns `consent_version` and `consented_at`. | Specified |
| FR-ROLE-01 | Each user has exactly one role, `parent` or `specialist`, fixed at registration. There is no administrator role in version 1. | P0 | The role appears in the token; no endpoint changes a user's role. | Specified |

**Assumption A5 (web client) and A4 (no diagnosis) affect the scope of this group, not its requirements.** Interview evidence: A4 supported (P1, P2, P3, SP1); A5 mixed (P1, P3 for, P2 against).

## 6.3 Functional requirements: child profiles and access (Zhan)

| ID | Requirement | Priority | Acceptance criteria | Status |
|---|---|---|---|---|
| FR-CHILD-01 | A parent creates a child profile with full name and birth date. | P0 | `POST /api/v1/children` returns 201 for a child aged 0 to 5 years. A birth date in the future, or a child 6 years old or more, returns 422 with a message about the age range. | Specified |
| FR-CHILD-02 | A parent sees only their own children in the list. | P0 | Two parents with one child each: each list contains exactly one child. | Specified |
| FR-CHILD-03 | A parent reads, updates and deletes their own child. | P0 | Owner gets 200 on read and update and 204 on delete. A different parent gets 404. After deletion, the child and all of its records (grants, notes, measurements, answers, signals, notifications) are removed (cascade). | Specified |
| FR-CHILD-04 | The child's age is shown in years and months. | P1 | Every child response contains `age` with days, months, years and a text such as "2 years 4 months" or "2 года 4 месяца" (`lang=ru`). | Specified |
| FR-CHILD-05 | The child profile stores sex (`male` or `female`), required because the WHO growth standards are sex-specific (document 00, 0.3). | P0 | `POST /api/v1/children` without `sex` or with another value returns 400; the value is returned on read and can be corrected by the owner. | Specified |
| FR-CHILD-06 | The child profile optionally stores gestational age at birth in whole weeks (22 to 44); the API returns corrected age when it is below 37 weeks and the child is younger than 24 months. | P1 | A value outside 22 to 44 returns 400; for 35 weeks and a chronological age of 14 months the response shows a corrected age 35 days smaller (12 months). | Specified |
| FR-ACC-01 | A parent grants a specialist access to a child by the specialist's email. | P0 | `POST .../access-grants` returns 201. An unknown email or an account that is not a specialist returns 422. A second active grant for the same pair returns 409. | Specified |
| FR-ACC-02 | A parent revokes a grant at any time, and revocation takes effect immediately. | P0 | After `DELETE .../access-grants/{grantId}` the specialist receives 404 on the child, its notes and the child list on the next request. | Specified |
| FR-ACC-03 | A specialist sees and reads only children with an active grant. | P0 | A specialist with no grant receives 404 when reading the child; the child does not appear in the specialist's list. | Specified |
| FR-ACC-04 | A specialist cannot change a child's profile or manage grants. | P0 | `PATCH` and `DELETE` on a child by a granted specialist return 403. Grant creation and listing by a specialist return 403. | Specified |
| FR-ACC-05 | Access is evaluated on every request against the database, not only from the token. | P0 | A grant revoked while a token is still valid stops working on the next request (tested in the authorization matrix, document 09). | Specified |

**Assumption A2 (parents want control of access) is the basis for FR-ACC-01 to FR-ACC-05.** Interview evidence: supported (P1, P2, P3, SP1).

## 6.4 Functional requirements: specialist notes (Zhan)

| ID | Requirement | Priority | Acceptance criteria | Status |
|---|---|---|---|---|
| FR-NOTE-01 | A granted specialist adds a note to a child: 1 to 4000 characters. | P0 | `POST .../notes` returns 201 with author, timestamps and body. An empty or over-long body returns 400. | Specified |
| FR-NOTE-02 | The owner parent and granted specialists see all notes for the child, newest first. | P0 | The owner gets 200 with notes; a specialist with a grant gets 200; a specialist without a grant gets 404. | Specified |
| FR-NOTE-03 | Only the author can edit or delete a note. | P0 | Another specialist, and the owner parent, get 403 on `PATCH` and `DELETE`. The author gets 200 and 204. | Specified |
| FR-NOTE-04 | Notes store creation and last-update times. | P1 | `updated_at` changes after an edit and `created_at` does not. | Specified |

**Assumption A3 (specialists write notes about a child they work with) is the basis for FR-NOTE-01.** Interview evidence: partly supported (SP1 would write short recommendations; P2).

## 6.5 Functional requirements: API, documentation and operations (Zhan)

| ID | Requirement | Priority | Acceptance criteria | Status |
|---|---|---|---|---|
| FR-DOC-01 | The API is documented as OpenAPI 3.0. | P0 | `GET /api/v1/openapi.yaml` returns the spec; the spec lists every endpoint in document 07. The spec passes a validator (tool and output recorded in document 09). | Specified |
| FR-DOC-02 | Interactive API documentation is available. | P0 | `GET /docs` shows Swagger UI loading the spec. | Specified |
| FR-OPS-01 | The service exposes health and metrics endpoints. | P0 | `GET /healthz` returns 200 with `status: ok`; `GET /metrics` returns Prometheus text format with request counters. | Specified |
| FR-OPS-02 | The whole stack starts with one command. | P0 | `docker compose up` in `src/` starts PostgreSQL, the API, Prometheus and Grafana; all become healthy without manual steps after `.env` is created. | Specified |
| FR-OPS-03 | Grafana shows a provisioned dashboard for the API. | P1 | The dashboard appears after start with request rate and error ratio panels. | Specified |
| FR-OPS-04 | Secrets are provided through environment variables, and the application refuses to start with a missing or weak JWT secret. | P0 | Start with `JWT_SECRET` shorter than 32 bytes fails with a clear message. | Specified |
## 6.6 Functional requirements: growth, milestones, signals, history and notifications (Arsen)

These requirements implement the monitoring model in [document 00](00-monitoring-model.md). They are owned by the second student (the module split is in document 07, section 7.4). Every endpoint below uses the access policy from document 07, section 7.10: the owner parent and specialists with an active grant may read and write records; others receive 404.

### Growth measurements

| ID | Requirement | Priority | Acceptance criteria | Status |
|---|---|---|---|---|
| FR-GRW-01 | A parent or granted specialist records a measurement: date, weight (kg, 0.01), length or height (cm, 0.1) with the method (recumbent or standing), head circumference (cm, 0.1). At least one value is required. | P0 | 201 with the author's role; a date in the future or before birth returns 422; standing height before 9 months returns 422; an entry with no value, a length without method, or values outside the input limits (weight 0.3 to 50 kg, length or height 25 to 150 cm, head circumference 18 to 60 cm) return 400. | Specified |
| FR-GRW-02 | For every measurement up to 60 months the API returns z-scores and percentiles for weight-for-age, length/height-for-age, weight-for-length or weight-for-height, BMI-for-age and head circumference-for-age, from the WHO Child Growth Standards for the child's sex (document 03, R1, R2). | P0 | On a synthetic test set of at least 200 cases the z-scores match the WHO `anthro` algorithm within 0.01 (document 09, M8). For ages over 60 months the scores are empty and `not_assessed_reason` is `age_over_60_months`. Every assessment carries `reference: WHO-2006`. | Specified |
| FR-GRW-03 | The API returns a chart series for one indicator: the child's points and the WHO lines for z = −3, −2, 0, +2, +3, each with its percentile (about 0.1, 2.3, 50, 97.7 and 99.9), so that the client can label the lines with percentiles for parents (document 08, 8.8). | P0 | One request returns both series; the lines are computed from the same WHO tables (birth median for boys 3.35 kg); each line carries its z value and percentile. | Specified |
| FR-GRW-04 | Editing or deleting a measurement is allowed to its author; the previous value is kept as a revision. | P1 | Another user receives 403; `GET /api/v1/measurements/{id}/revisions` shows the old value, the new value, the author of the change and the time. A deleted measurement leaves the lists and keeps its revisions. | Specified |
### Milestones

| ID | Requirement | Priority | Acceptance criteria | Status |
|---|---|---|---|---|
| FR-MS-01 | The system holds the milestone reference list: CDC 2022 checklist items for 2, 4, 6, 9, 12, 15, 18, 24 and 30 months and 3, 4 and 5 years in four domains (S1), and the six WHO gross motor milestones with their windows (S2, R3), with English, Russian and Kazakh text and the source of each item. | P0 | The catalog is embedded in the program with a version tag (`GET /api/v1/reference`); it has 159 CDC items (42 social and emotional, 40 language, 33 cognitive, 44 movement, as in S1) and 6 WHO items; every item has a domain, an age or window, and a source. English texts are CDC's; Russian and Kazakh texts are reviewed before use with participants (NFR-REF-02). | Specified |
| FR-MS-02 | The API returns the checklist that matches the child's age, or the corrected age when gestational age is below 37 weeks, together with the existing answers. | P0 | Tested at the boundaries: one day before 12 months gives the 9-month checklist, on the 12-month birthday the 12-month one; a child born at 32 weeks and 13 months old gets the 9-month checklist, at 38 weeks the 12-month one; a newborn gets the upcoming 2-month checklist. Earlier checklists are available at `.../milestones/checklists/{age}`. | Specified |
| FR-MS-03 | A parent or granted specialist answers an item with `yes`, `not_yet` or `not_sure` and a date; parent and specialist answers are stored separately and shown with their source. | P0 | Every answer is kept with author, role and date; the checklist shows the latest parent answer, the latest specialist answer and the latest answer overall for each item. | Specified |
| FR-MS-04 | The API returns milestone progress per domain for each checklist: counts of `yes`, `not_yet`, `not_sure` and unanswered items. | P1 | Counts match the latest answers. | Specified |
### Signals

| ID | Requirement | Priority | Acceptance criteria | Status |
|---|---|---|---|---|
| FR-SIG-01 | The system raises signals G1 (z-score below −2 or above +2), G2 (value flagged as implausible by the WHO `anthro` limits, check the entry), M1 (latest answer `not_yet` at or after the checklist age, by corrected age) and W1 (latest answer `not_yet` to a WHO motor milestone after the upper end of its window, except crawling), as defined in document 00, section 0.5. | P0 | Tests cover each signal type at its boundary, `not_sure` never raising a signal, one open signal per child, type and subject, and automatic resolution when the condition ends. Thresholds and their sources are kept in the reference data (`signal_rules.json`, ADR-005). | Specified |
| FR-SIG-02 | A signal is shown with the value or item, the reference, the date, the source record and the fixed text from document 00; it never contains the words "norm", "delay", "disorder" or "risk". | P0 | An automated test scans every signal and notification text in all languages for the forbidden words (English and Russian). | Specified |
| FR-SIG-03 | A parent or granted specialist marks a signal as discussed; the history keeps who and when. | P1 | The signal list orders open, discussed and resolved signals and can filter by status; a second mark returns 409. | Specified |
### History, analytics and notifications

| ID | Requirement | Priority | Acceptance criteria | Status |
|---|---|---|---|---|
| FR-ANL-01 | The child's history lists measurements, milestone answers, signals and notes by date, newest first, with filters by type. | P0 | Filtering by one or several types returns only their entries in date order. | Specified |
| FR-ANL-02 | For each growth indicator the system shows the change in z-score between consecutive measurements. | P1 | For a series of at least three measurements the shown changes equal the differences of the computed z-scores. | Specified |
| FR-ANL-04 | The child overview shows age and corrected age, open signals, progress of the current checklist, the next checklist and the last and next preventive examination, and the latest measurement. | P1 | `GET /api/v1/children/{id}/overview` returns these fields for the owner and granted specialists. | Specified |
| FR-NTF-01 | Notifications are created for: a checklist that becomes due, a preventive examination age from Order No. ҚР ДСМ-264/2020 (R11), a new signal, and a new specialist note (document 00, section 0.6). | P1 | Each event creates one notification per recipient defined in document 00, excluding the author; repeated runs of the reminder job create no duplicates. | Specified |
| FR-NTF-02 | Notifications are visible in the app; any other channel is future work (ADR-007). | P1 | The list endpoint returns unread notifications first; marking one as read changes its state; another user's notification returns 404. | Specified |
| FR-ANL-03 | Export of a child's history as CSV and a printable summary for a doctor's visit. | P2 | The export contains the same rows as the history for the same filter. | Planned |

**Assumptions A1, A7 and A8** (document 02, section 2.4) are the basis for FR-GRW-01 and FR-MS-01. Interview evidence: A1 supported (P1, P2, P3); A7 supported for weight and height (P1, P2, P3, SP1); A8 partly supported (FU1, language not recorded).

## 6.7 Non-functional requirements

| ID | Category | Requirement | Priority | Acceptance criteria | Verification |
|---|---|---|---|---|---|
| NFR-SEC-01 | Security | Password hashing uses Argon2id with an OWASP configuration (document 05, T1). | P0 | Unit test checks the PHC string prefix and parameters. | Unit test |
| NFR-SEC-02 | Security | Tokens are validated with a fixed algorithm, have an expiry and are signed with a secret of at least 32 bytes (document 05, T2). | P0 | Tests for tampered, expired and `alg: none` tokens all return 401. | Unit test |
| NFR-SEC-03 | Security | No secret is committed to the repository. Configuration examples contain placeholder values only. | P0 | Repository scan finds no real secret; `.env` is in `.gitignore`. | Manual review, document 10 |
| NFR-SEC-04 | Security | Traffic in production is served over HTTPS through a reverse proxy. | P1 | Documented in document 07 as deployment requirement; not part of the compose stack. | Documentation review |
| NFR-SEC-05 | Security | Login attempts are rate-limited. | P2 | Not in version 1. | Future work |
| NFR-PRV-01 | Privacy | The system stores only what it needs: email, full name, password hash; child's name, birth date, sex and optional gestational age; grants, notes, measurements, milestone answers, signals and notifications. No address, national identification number or identifiers from other systems. | P0 | Schema review against this list. | Schema review |
| NFR-PRV-02 | Privacy | Evaluation uses synthetic data only; no real children's records are used or stored. | P0 | The seed data uses invented names. | Documentation and data review |
| NFR-PRV-03 | Privacy | In a real deployment the database is located in Kazakhstan (Law No. 94-V, article 12, document 03, R13), and the parent's consent to processing as the child's legal representative (articles 7 and 8) is recorded at registration with the date and the text version. | P1 | Deployment document names the hosting location; the `users` table stores the consent date and version (FR-AUTH-06). | Documentation and schema review |
| NFR-PRV-04 | Privacy | The client contains no third-party analytics or advertising trackers (document 03, S12). | P0 | Network inspection of the client shows requests only to the system's own origin. | Manual test |
| NFR-REF-01 | Reference data | WHO tables and milestone items are stored as versioned reference data with their source; every computed value and signal can be traced to the reference version used. | P0 | The API response for a z-score includes the reference identifier `WHO-2006`; every signal names its reference; `GET /api/v1/reference` lists the catalog version and sources. | Unit test |
| NFR-REF-02 | Reference data | Russian and Kazakh texts of milestone items are reviewed before use with participants, and the reviewer and date are recorded. | P1 | The reference file lists the reviewer and date for each language. | Documentation review |
| NFR-PERF-01 | Performance | Read and write endpoints respond within 300 ms at the 95th percentile for 20 concurrent users on the compose stack on a development laptop. | P1 | Measured with the procedure in document 09. | Load test |
| NFR-REL-01 | Reliability | The service shuts down gracefully on SIGINT and SIGTERM and reports health through `/healthz`. | P0 | Process exits after in-flight requests complete (manual test). | Manual test |
| NFR-MNT-01 | Maintainability | Authorization and age rules live in the service layer, covered by unit tests. | P0 | `go test ./...` passes; authorization matrix tests cover every row in document 09. | Automated tests |
| NFR-MNT-02 | Maintainability | Code is formatted and passes `go vet`. | P0 | `gofmt -l` prints nothing; `go vet ./...` passes. | Automated check |
| NFR-PORT-01 | Portability | The backend runs as a container on Linux, macOS and Windows with Docker. | P1 | Compose stack runs on at least two operating systems (tested by the two students). | Manual test |
| NFR-USE-01 | Usability | The web client works on a 360 px wide phone screen without horizontal scrolling. | P1 | Checked in the prototype and, from milestone M4, in the React client. | Manual test |
| NFR-DOC-01 | Documentation | Setup, run and test instructions exist for a new developer. | P0 | A reader who has not seen the project can start the stack with the README alone. | Walkthrough |

## 6.8 Requirement-to-test traceability

Every P0 functional requirement maps to at least one planned automated test or documented manual test in document 09. The requirement-to-test table is created with the first tests at milestone M2 and kept next to the tests.

## 6.9 Known limitations of the design

- No refresh tokens in version 1: a user logs in again after one hour (FR-AUTH-03); usability is limited.
- No pagination in version 1: lists return all items, acceptable for the synthetic data volume.
- Role self-selection at registration: any person can register as a specialist. A real deployment needs an invitation or verification step (future work).
- Russian and Kazakh texts of the milestone items are not written yet; they are prepared and reviewed at milestone M3 (NFR-REF-02).
- Z-score accuracy (M8) is checked against WHO's own `anthro` software; the R package run is part of milestone M3.
- CSV export (FR-ANL-03) is P2 and planned after version 1.
- Two forms of sharing raised in the interviews are not in version 1: read-only access through a QR code or link (P2) and access limited in time to one consultation (P3). Both are future work; version 1 grants access by specialist email until the parent revokes it.