# 7. Architecture and Diagrams

**Status at pre-defense 1:** this document describes the target design. Implementation starts at milestone M2 (document 10); `src/`, `tests/` and `config/` are empty in this submission. Every package, file, migration, table and endpoint named below is planned.

## 7.1 Architectural style

The system is a **modular monolith** on the server side and a **single-page web client** installable as a PWA.

- One Go service (planned in `src/`) will contain all server modules. Modules are separated by package and by layer, so each can be developed, tested and later extracted without changing the contract.
- The client talks to the service only through the documented REST API (document 05, decision 3).
- Persistence is one PostgreSQL database. Each module owns its tables.

A modular monolith was chosen over microservices because the team has two students, a deadline of 24 October for the first pre-defense, and a domain of about ten entities. Microservices would add network failure modes, deployment units and contracts to maintain without a matching benefit at this size.

## 7.2 Diagrams

Eight PlantUML sources are in `diagrams/src/`, with SVG and PNG exports in `diagrams/rendered/`. The first four are the diagrams required by the checklist; the other four show how the monitoring model (document 00) works. They show the target design: package, service, table and endpoint names are the planned names used in this document.

| Diagram | Source | What it shows |
|---|---|---|
| System context | `diagrams/src/system-context.puml` | Parent, specialist and operator; the polyclinic as the source of measured values (no integration); WHO, CDC and Kazakhstan references embedded as data; Prometheus and Grafana |
| Use case | `diagrams/src/use-case.puml` | UC1 to UC6 (profiles and access, Zhan) and UC7 to UC14 (overview, growth, milestones, signals, history, reminders, Arsen), with the included z-score, checklist selection and signal rules |
| Component | `diagrams/src/component.puml` | Go packages and services: HTTP layer, the services of both students, AccessPolicy, the `anthro` and `reference` packages, stores and migrations |
| Container | `diagrams/src/container.puml` | Browser client, reverse proxy, API container (with the reminder job and embedded reference data), PostgreSQL, Prometheus, Grafana; server located in Kazakhstan |
| Data model | `diagrams/src/data-model.puml` | The ten planned tables, with keys, relations and cascade rules |
| Sequence: measurement | `diagrams/src/sequence-measurement.puml` | Recording a measurement: authentication, access check, validation, z-scores, signal evaluation, notifications |
| Sequence: access | `diagrams/src/sequence-access.puml` | Granting access, the specialist's work with the child, revocation taking effect at the next request |
| Activity: monitoring cycle | `diagrams/src/activity-monitoring.puml` | Corrected age, measurement and checklist branches, signal rules G1, G2, M1, W1, resolution, notifications and the reminder job |

## 7.3 Layers of the server

Planned Go packages:

```
HTTP layer        internal/httpapi     Fiber routes, handlers, request and response mapping, JWT middleware,
                                       error mapping, language selection, metrics, Swagger UI
   |
Service layer     internal/service     AuthService, ChildService, GrantService, NoteService, AccessPolicy (Zhan)
                                       GrowthService, MilestoneService, SignalService, HistoryService,
                                       NotificationService, ReminderService (Arsen)
                                       all authorization decisions are made here; services.go wires them
   |
Domain            internal/domain      entities, roles, sentinel errors, validation, age and corrected age
Calculation       internal/anthro      WHO z-scores and percentiles, reference curves (pure functions)
Reference data    internal/reference   CDC and WHO milestone catalog, examination ages, signal rules (embedded JSON)
Security          internal/security    Argon2id hashing, JWT issue and parse
   |
Storage           internal/store       repository interfaces; PostgreSQL implementation (pgx);
                                       in-memory implementation for unit tests
Schema            migrations           SQL migrations embedded in the binary and applied at start-up
```

Dependencies point downwards only. The HTTP layer contains no access rules; it translates service errors into status codes. `anthro` and `reference` depend on nothing else in the project, so the calculations can be tested on their own.

## 7.4 Components and responsibilities

| Component | Planned code location | Responsibility | Owner |
|---|---|---|---|
| Auth handlers and service | `service/auth.go` | Registration with consent, login, current user | Zhan |
| Token and password module | `security/` | JWT issuing and validation, Argon2id hashing | Zhan |
| Child profile service | `service/children.go` | Create, read, update, delete child profiles; age rule; sex and gestational age | Zhan |
| GrantService and AccessPolicy | `service/grants.go`, `service/policy.go` | Grants and revocations; the visibility rule for every child-scoped record (`RequireChildAccess`, `RequireOwner`, `Audience`) | Zhan |
| Note service | `service/notes.go` | Notes by granted specialists, author-only changes | Zhan |
| Documentation | `api/openapi.yaml`, `httpapi/docs.go` | OpenAPI spec and Swagger UI | Zhan |
| Monitoring and packaging | `httpapi/middleware.go`, `Dockerfile`, `docker-compose.yml`, `config/` | Prometheus metrics, Grafana dashboard, containers | Zhan |
| Migrations | `migrations/` | Schema versions applied at start-up | Zhan (core tables), Arsen (monitoring tables) |
| Reference data | `reference/`, `anthro/data/` | WHO LMS tables, WHO motor windows, CDC 2022 items, examination ages, signal rules, each with source and version | Arsen |
| Z-score calculation | `anthro/` | WHO `anthro` algorithm: length/height adjustment, LMS z-scores, ±3 SD extension, implausibility flags, percentiles, reference curves | Arsen |
| GrowthService | `service/growth.go` | Measurements, revisions, assessments, chart series with z-score changes | Arsen |
| MilestoneService | `service/milestones.go` | Checklist selection by age or corrected age, answers by parents and specialists, progress per domain | Arsen |
| SignalService | `service/signals.go`, `service/signal_rules.go` | Rules G1, G2, M1 and W1, opening, refreshing and resolving signals, marking as discussed | Arsen |
| HistoryService | `service/history.go` | Combined dated history with type filter; child overview | Arsen |
| NotificationService and ReminderService | `service/notifications.go`, `service/reminders.go`, `service/messages.go` | In-app notifications for signals, notes, due checklists and examinations; the periodic job; texts in English and Russian | Arsen |
| Web client (React PWA) | `client/` (M4) | Screens for parents and specialists, service worker and manifest | Both, split by screens |

## 7.5 Data model

Diagram: `diagrams/rendered/data-model.svg`. PostgreSQL 16. The schema is planned as two migrations, `src/migrations/001_init.sql` (M2) and `002_monitoring.sql` (M3), applied by the API at start-up and recorded in `schema_migrations`. All timestamps are `TIMESTAMPTZ` in UTC. Every table that belongs to a child references `children(id)` with `ON DELETE CASCADE`, so deleting a child removes all of its records.

```
users                         id, email (unique, lowercased), full_name, role ('parent' | 'specialist'),
                              password_hash (Argon2id PHC), consent_version, consented_at, created_at

children                      id, owner_id -> users, full_name, birth_date,
                              sex ('male' | 'female'), gestational_age_weeks (22 to 44, null),
                              created_at, updated_at

access_grants                 id, child_id -> children, specialist_id -> users, granted_at, revoked_at (null)
                              unique (child_id, specialist_id) where revoked_at is null

specialist_notes              id, child_id -> children, author_id -> users, body (1 to 4000), created_at, updated_at

growth_measurements           id, child_id -> children, author_id -> users, author_role, measured_on,
                              weight_kg numeric(5,2), length_cm numeric(4,1), length_method,
                              head_circumference_cm numeric(4,1), created_at, updated_at, deleted_at (null)
                              check: at least one value; length and method together

growth_measurement_revisions  id, measurement_id -> growth_measurements, action ('updated' | 'deleted'),
                              before_values jsonb, after_values jsonb (null when deleted), changed_by -> users, changed_at

milestone_observations        id, child_id -> children, item_id (catalog id), author_id -> users, author_role,
                              answer ('yes' | 'not_yet' | 'not_sure'), observed_on, created_at

signals                       id, child_id -> children, type ('G1' | 'G2' | 'M1' | 'W1'), subject (indicator or item id),
                              source_id (measurement or observation), reference, value, observed_on, created_at,
                              discussed_at, discussed_by -> users, resolved_at
                              unique (child_id, type, subject) where resolved_at is null

notifications                 id, recipient_id -> users, child_id -> children, kind, params jsonb, dedup_key,
                              created_at, read_at;  unique (recipient_id, dedup_key)

schema_migrations             version, applied_at
```

Reference data will not be stored in the database. The WHO LMS tables (WHO's own files from the `anthro` package), the milestone catalog, the examination ages and the signal rules will be embedded in the binary from `src/internal/anthro/data/` and `src/internal/reference/data/`, validated at start-up and identified by version tags (`WHO-2006`, catalog `2026-10-1`). Records keep only the item id or indicator code, so a translation fix never touches stored data.

Z-scores will be computed when read, from the measurement and the WHO table for the child's sex and age (or length), so a correction of the reference data or of the child's birth date never leaves stale values. Milestone answers are append-only: a new answer is added, and the latest one counts.

## 7.6 Key flows

### Granting access

1. Parent sends `POST /api/v1/children/{childId}/access-grants` with the specialist's email.
2. The HTTP layer validates the JWT and the body.
3. GrantService calls `AccessPolicy.RequireOwner`; a non-owner receives 404 (or 403 if a granted specialist).
4. The specialist account is looked up by email; a missing account or a non-specialist account gives 422.
5. An active grant for the same pair gives 409.
6. The grant row is inserted and the response returns 201.

### Adding a specialist note

1. Specialist sends `POST /api/v1/children/{childId}/notes`.
2. NoteService calls `AccessPolicy.RequireChildAccess`, which checks for an active grant. No grant gives 404.
3. The note is stored with the actor as author and the response returns 201.
4. NotificationService notifies the owner parent (`note_added`).

### Revocation

Revocation sets `revoked_at`. Every later request re-checks the grant in the database, so access stops at the next request, even if the specialist still holds a valid token (FR-ACC-05).

### Recording a measurement

1. A parent or granted specialist sends `POST /api/v1/children/{childId}/measurements`.
2. GrowthService calls `AccessPolicy.RequireChildAccess`; no access gives 404.
3. The values are validated and rounded (FR-GRW-01) and stored with the author and role.
4. SignalService re-evaluates the child: for each indicator it takes the latest measurement with a score, computes z-scores with `anthro`, and opens G2 for an implausible value or G1 for |z| > 2. Open signals whose condition ended are resolved.
5. NotificationService notifies the owner and the granted specialists about each new signal, except the author.
6. The response returns the measurement with its z-scores and percentiles, the reference version and the new signals.

Correction and deletion (`PUT` and `DELETE /api/v1/measurements/{id}`) are allowed to the author only, write a revision in the same transaction, and run the same evaluation.

### Answering a milestone checklist

1. The client requests `GET /api/v1/children/{childId}/milestones/current`; MilestoneService computes the age (corrected below 37 weeks and 24 months) and returns the latest checklist reached, with the latest parent and specialist answers and the six WHO motor milestones.
2. The user sends answers to `POST /api/v1/children/{childId}/milestones/answers`.
3. SignalService applies M1 (latest answer `not_yet`, checklist age reached) and W1 (latest answer `not_yet`, corrected age past the window, not crawling); signals and notifications are created as above.

### Reminder job

`ReminderService.Run` will start with the API and run at start and every `REMINDER_INTERVAL` (default one hour). For each child it re-evaluates signals (an earlier `not_yet` becomes M1 when the child reaches the checklist age), and creates `checklist_due` and `examination_due` notifications for the most recent ages reached. A unique key per recipient makes repeated runs harmless. The same check runs immediately when a child is created or edited.

## 7.7 Security architecture

| Concern | Measure |
|---|---|
| Authentication | JWT HS256 with explicit algorithm check, one-hour lifetime, secret from environment (document 05, T2) |
| Password storage | Argon2id with m = 19456 KiB, t = 2, p = 1; 16-byte random salt; passwords of 15 to 128 characters (document 05, T1, T3) |
| Authorization | Ownership and grants checked in the service layer on every request for every child-scoped record; 404 for invisible resources |
| Input validation | Length and range limits, date checks against the birth date and today, JSON decoding into typed structs with unknown fields rejected |
| Errors | Uniform error JSON; internal details are logged, not returned |
| Secrets | Environment variables only; `.env` ignored by git; example file with placeholders |
| Transport | HTTPS required in deployment through a reverse proxy (NFR-SEC-04) |
| Data | Synthetic data only for evaluation; minimal data set (NFR-PRV-01); consent recorded with version and time (FR-AUTH-06) |

Threat notes for the pre-defense:

- **Enumeration:** handled by 404 for resources the actor cannot see.
- **Privilege escalation:** the role is fixed at registration and checked in the service layer; there is no endpoint that changes it.
- **Token theft:** the token lifetime is short; the access model still re-checks grants. Refresh tokens and revocation lists are future work.
- **Brute force on login:** not mitigated in version 1 (NFR-SEC-05, P2).

## 7.8 Deployment view

The planned `src/docker-compose.yml` (milestone M2) defines four services:

| Service | Image or build | Port | Notes |
|---|---|---|---|
| postgres | postgres:16-alpine | 5432 (internal) | Data volume `pgdata` |
| api | built from `src/Dockerfile` | 8080 | Waits for PostgreSQL health; applies migrations; runs the reminder job; reads `.env` |
| prometheus | prom/prometheus | 9090 | Scrapes `api:8080/metrics` using `config/prometheus/prometheus.yml` |
| grafana | grafana/grafana | 3000 | Provisioned datasource and dashboard from `config/grafana/` |

Configuration: `HTTP_ADDR`, `DATABASE_URL`, `JWT_SECRET` (at least 32 bytes), `JWT_TTL`, `REMINDER_INTERVAL`, `LOG_LEVEL`.

## 7.9 Interface contract

Planned contract: `src/api/openapi.yaml` (OpenAPI 3.0.3, 28 paths, milestone M2 for Zhan's endpoints and M3 for Arsen's), to be served at `/api/v1/openapi.yaml` and shown at `/docs`. A planned test will check that every route registered in the server is documented.

| Area | Endpoints |
|---|---|
| Auth | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/me` |
| Children | `POST /api/v1/children`, `GET /api/v1/children`, `GET\|PATCH\|DELETE /api/v1/children/{childId}` |
| Access | `POST\|GET /api/v1/children/{childId}/access-grants`, `DELETE /api/v1/children/{childId}/access-grants/{grantId}` |
| Notes | `POST\|GET /api/v1/children/{childId}/notes`, `PATCH\|DELETE /api/v1/notes/{noteId}` |
| Growth | `POST\|GET /api/v1/children/{childId}/measurements`, `PUT\|DELETE /api/v1/measurements/{measurementId}`, `GET /api/v1/measurements/{measurementId}/revisions`, `GET /api/v1/children/{childId}/growth/{indicator}` |
| Milestones | `GET /api/v1/children/{childId}/milestones/current`, `GET .../milestones/checklists/{ageMonths}`, `POST .../milestones/answers`, `GET .../milestones/progress` |
| Signals | `GET /api/v1/children/{childId}/signals`, `POST /api/v1/signals/{signalId}/discuss` |
| Overview and history | `GET /api/v1/children/{childId}/overview`, `GET /api/v1/children/{childId}/history` |
| Notifications | `GET /api/v1/me/notifications`, `POST /api/v1/notifications/{notificationId}/read` |
| Reference | `GET /api/v1/reference` |
| Operations | `GET /healthz`, `GET /metrics`, `GET /docs`, `GET /api/v1/openapi.yaml` |

Error body: `{"error": {"code": "snake_case_code", "message": "human readable text"}}`. Texts (ages, item texts, signal messages, notifications) are in English by default and in Russian with `lang=ru` or `Accept-Language: ru`.

## 7.10 Integration between the two students' modules

The modules integrate through the service layer, not through each other's tables:

- `AccessPolicy.RequireChildAccess(ctx, childID, actor)` (owner or active grant), `AccessPolicy.RequireOwner(ctx, childID, actor)` (owner only) and `AccessPolicy.Audience(ctx, child)` (owner and granted specialists) are the single source of truth for who may see or change a child's data and who is notified. Every monitoring service will call them first. Planned location: `src/internal/service/policy.go`.
- The monitoring tables reference `children(id)` and `users(id)` with foreign keys and cascade rules.
- The core services expose two listener interfaces: `ChildListener` (a child was created or edited: reminders and signals are re-checked) and `NoteListener` (a note was added: the parent is notified). `SignalListener` connects SignalService to NotificationService. The wiring is planned in `src/internal/service/services.go`, so each module can be tested without the others.
- Age and corrected age will be computed in one place, `domain.AgeOf`, with the rule from `signal_rules.json`.

## 7.11 Architecture decision records

Short records are in `docs/adr/`:

- ADR-001 Backend framework: Go with Fiber
- ADR-002 Storage: PostgreSQL
- ADR-003 Authentication: JWT with short lifetime
- ADR-004 Client: React PWA
- ADR-005 Reference content: WHO growth standards, CDC 2022 checklists, WHO motor windows (accepted)
- ADR-006 Z-score computation: WHO `anthro` algorithm in Go with embedded WHO tables (accepted)
- ADR-007 Notification channel: in-app notifications in version 1 (accepted)

Each record cites the comparison in document 05.
