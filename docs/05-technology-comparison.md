# 5. Technology Comparison

This document compares the alternatives for eight key decisions. Each decision lists two or three reasonable options, the criteria, the choice and the reason. The decisions are recorded as ADRs in `docs/adr/` (ADR-001 to ADR-006; decision 5 is part of ADR-003). Technical references T1 to T8 are listed in section 5.11; S and R identifiers refer to document 03.

## 5.1 Criteria

Derived from the requirements in document 06:

| ID | Criterion | Requirement reference |
|---|---|---|
| K1 | Security defaults (password hashing, token validation, injection safety) | NFR-SEC |
| K2 | Fit to the access model (per-child relationships and constraints) | FR-ACC |
| K3 | Team skill and learning time before the first pre-defense | Delivery constraint |
| K4 | Operability (containers, health checks, metrics) | FR-OPS |
| K5 | Maintainability and testability | NFR-MNT |
| K6 | Support for time-series data and reference computations | FR-GRW, FR-MS, FR-ANL |
| K7 | Scientific validity and licensing of reference content | Document 00, NFR-REF |

## 5.2 Decision 1: Backend framework

| Option | Summary | Assessment |
|---|---|---|
| **A. Go with Fiber v2** (chosen) | Express-style framework built on fasthttp, with JWT middleware for Fiber v2 (T7) and a metrics adaptor. | Fast to set up, familiar API style. Uses fasthttp instead of `net/http`, so some standard-library middleware needs an adaptor. |
| B. Go with the standard library `net/http` | Since Go 1.22, `ServeMux` patterns match HTTP methods and capture path wildcards (T5). | Fewest dependencies, but more code for middleware, JSON errors and grouping. |
| C. Go with Gin | Mature router with a large middleware ecosystem. | Comparable in function to A. Not evaluated against a source in this review; listed as a known alternative. |

**Choice: A (Fiber).** It gives the middleware the project needs with an API both students know. **Trade-off:** fasthttp instead of `net/http`; the Prometheus handler runs through an adaptor. Option B is the fallback.

## 5.3 Decision 2: Data storage

| Option | Summary | Assessment |
|---|---|---|
| **A. PostgreSQL 16** (chosen) | Relational database with constraints, transactions, `TIMESTAMPTZ`, `NUMERIC` and partial unique indexes. | Foreign keys and partial unique indexes enforce grant rules in the database. Exact decimal types for measurements. Reference tables (WHO LMS, milestone items) are ordinary tables. |
| B. MongoDB | Document database with flexible schemas. | Flexible for observations, but ownership, grants and unique active grants would need application-side enforcement. Not evaluated against a source in this review. |
| C. TimescaleDB (PostgreSQL extension) | Hypertables split rows into time-based chunks (T8). | Not needed for a few measurements per child per month. **Kept as an upgrade path** if data volume grows. |

**Choice: A (PostgreSQL).** **Trade-off:** no time-series partitioning; not a risk at the project's data volume.

## 5.4 Decision 3: Client-server interaction style

| Option | Summary | Assessment |
|---|---|---|
| **A. REST with JSON and OpenAPI** (chosen) | Resource-based endpoints documented in OpenAPI 3.0. | Works in every browser without tooling; Swagger UI gives an interactive contract (FR-DOC). |
| B. gRPC | Binary protocol over HTTP/2 with generated clients. | Browsers do not expose HTTP/2 framing, so a web client needs gRPC-Web and a translating proxy (T6). The team has gRPC experience, which would favour B only between servers. |
| C. GraphQL | Single endpoint with client-defined queries. | Useful for many clients with different data needs; the project has one client. Not evaluated against a source in this review. |

**Choice: A (REST).** **Trade-off:** endpoints for charts must return series in one request to avoid many round trips (FR-GRW-03).

## 5.5 Decision 4: Authentication

| Option | Summary | Assessment |
|---|---|---|
| **A. Stateless JWT (HS256) with short lifetime** (chosen) | Signed access token in the `Authorization: Bearer` header. | RFC 8725 requires the caller to fix the accepted algorithms and advises against accepting `none` (T2); both are implemented. **Trade-off:** no revocation before expiry without extra state; mitigated by a one-hour lifetime and by checking grants on every request. |
| B. Server-side sessions with an opaque cookie | Session identifier in an HTTP-only cookie, state in the database. | Immediate revocation; needs session storage and CSRF protection. Fiber's JWT middleware can also read tokens from a cookie (T7). |
| C. OAuth 2.0 / OpenID Connect with an external provider | Delegated login. | Adds a provider dependency that specialists may not have. Out of scope for version 1. |

**Choice: A (JWT).** Revoking a grant takes effect at the next request because grants are checked in the database (FR-ACC-05).

## 5.6 Decision 5: Password hashing and password policy

| Option | Summary | Assessment |
|---|---|---|
| **A. Argon2id** (chosen) | Memory-hard function, first choice in OWASP guidance (T1). | Configuration m = 19 MiB, t = 2, p = 1, one of the OWASP minimum configurations. Available in `golang.org/x/crypto`. |
| B. bcrypt | OWASP lists it for legacy systems where Argon2 and scrypt are unavailable, with a 72-byte input limit (T1). | Not the preferred choice for a new system. |
| C. PBKDF2-HMAC-SHA-256 | Suited to FIPS-140 environments, 600,000 iterations (T1). | Only needed for FIPS compliance. |

**Choice: A (Argon2id).**

**Password policy.** NIST SP 800-63B-4 (July 2025, T3) requires a minimum of 15 characters for passwords used as a single authentication factor (8 characters only when the password is part of multi-factor authentication), recommends allowing at least 64 characters, and forbids composition rules. The current implementation accepts 8 to 72 bytes, a limit inherited from bcrypt that Argon2id does not have, and counts bytes, so a Cyrillic password is cut at 36 characters. **Decision:** change the rule to 15 to 128 characters, counted as Unicode characters (FR-AUTH-02, task DIP-24).

## 5.7 Decision 6: Client application

| Option | Summary | Assessment |
|---|---|---|
| **A. React progressive web app** (chosen) | One web codebase, installable on the home screen. | Installability needs a manifest with a name, 192 and 512 px icons, a start URL and a display mode, served over HTTPS; a service worker is not required for installation (T4). |
| B. Native apps (for example Flutter or React Native) | Separate store apps. | Better device integration; adds store publication and a second toolchain. Not evaluated against a source in this review. |
| C. Server-rendered pages (Go templates) | HTML rendered by the backend. | Simpler deployment; poorer interaction for charts and checklists. |

**Choice: A (PWA).** **Trade-off:** web push is not available on every platform; notifications must also be visible in the app (FR-NTF-02).

## 5.8 Decision 7: Development reference content

| Option | Summary | Assessment |
|---|---|---|
| **A. CDC 2022 checklists plus WHO motor windows** (chosen) | Free checklists from 2 months to 5 years; each milestone reached by at least 75% of children by that age (S1, R7); WHO windows of achievement for six gross motor milestones (S2, R3). | Peer-reviewed, free, used in a public app (R8). Written for the United States; Russian and Kazakh translations must be prepared and reviewed. |
| B. ASQ-3 | Parent-completed questionnaire with scoring, validated in many studies. | Licensed product sold with paid online access (document 04, E4). The project has no licence, and scores would imply screening accuracy that parent use cannot guarantee (S4, S6). |
| C. National scales of neuropsychic development (Order No. 704, R10) | Scales used by Kazakhstan's child development rooms; the rules refer to them in an appendix. | Matches local practice exactly. Designed for administration by a nurse; the appendix with the scales has not yet been reviewed by the team. |

**Choice: A**, with option C as an open question for the supervisor (document 11). **Trade-off:** content from another country; mitigated by translation review and by showing the source of every item.

## 5.9 Decision 8: Z-score computation

| Option | Summary | Assessment |
|---|---|---|
| **A. LMS computation in Go with WHO tables stored as reference data** (chosen) | Embed WHO's own LMS table files (R1, R2, from the `anthro` package) in the program with a version tag; compute z-scores and percentiles in Go following the `anthro` algorithm. | No external service; deterministic and testable. Requires care with the WHO adjustment beyond ±3 SD for weight-based indicators. |
| B. Call WHO's R package `anthro` (R4) from a separate service | Reference implementation by WHO. | Correct by definition, but adds an R runtime and a network call to every chart request. |
| C. Precomputed percentile lookup tables | Store percentile curves only. | Simple for charts, but gives no exact z-score for signals. |

**Choice: A.** Option B is used **as the test oracle**: a synthetic test set is computed with the `anthro` algorithm, and the Go results must match within 0.01 SD (document 09, M8). Embedding the tables instead of loading them into PostgreSQL keeps the calculation a pure function that is tested without a database; the tables are read-only and change only with a new release of the standard.

## 5.10 Summary

| Decision | Chosen | Main alternative | Deciding criteria |
|---|---|---|---|
| Backend framework | Go + Fiber v2 | Go `net/http` | K3, K5 |
| Storage | PostgreSQL | TimescaleDB as upgrade path | K1, K2, K6 |
| Interaction | REST + OpenAPI | gRPC | K2, K3 |
| Authentication | JWT HS256, short lifetime | Server-side sessions | K1, K2 |
| Password hashing | Argon2id, 15 to 128 characters | bcrypt (legacy) | K1 |
| Client | React PWA | Native apps | K3, K5 |
| Reference content | CDC 2022 + WHO motor windows | National scales (Order No. 704) | K7 |
| Z-scores | LMS in Go, tested against WHO `anthro` | WHO `anthro` as a service | K5, K6, K7 |

## 5.11 Technical references

All links opened on 22 October 2026.

| ID | Source | Link |
|---|---|---|
| T1 | OWASP. Password Storage Cheat Sheet. | https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html |
| T2 | Sheffer Y, Hardt D, Jones M. RFC 8725: JSON Web Token Best Current Practices. IETF, February 2020. | https://www.rfc-editor.org/rfc/rfc8725 |
| T3 | NIST. SP 800-63B-4: Digital Identity Guidelines, Authentication and Authenticator Management. July 2025 (supersedes SP 800-63B of 2020). | https://csrc.nist.gov/pubs/sp/800/63/B/4/final |
| T4 | MDN Web Docs. Making PWAs installable. | https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_Installable |
| T5 | The Go Blog. Routing Enhancements for Go 1.22. 13 February 2024. | https://go.dev/blog/routing-enhancements |
| T6 | gRPC project. gRPC-Web protocol (PROTOCOL-WEB.md). | https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-WEB.md |
| T7 | Fiber documentation. JWT middleware, v1.x for Fiber v2. | https://docs.gofiber.io/contrib/jwt_v1.x.x/jwt/ |
| T8 | Tiger Data (formerly Timescale) documentation. Partition a hypertable. | https://www.tigerdata.com/docs/learn/hypertables/partitioning-hypertables |
