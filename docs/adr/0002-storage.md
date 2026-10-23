# ADR-002: Storage

Status: accepted

## Context

Ownership, per-child grants and author-only notes are relational rules that should be enforced by the database where possible. The second module needs dated histories.

## Decision

Use PostgreSQL 16 with `TIMESTAMPTZ` timestamps, foreign keys with cascade rules, and a partial unique index for active grants.

## Alternatives

- MongoDB (flexible schema, rules enforced in the application only).
- TimescaleDB as a PostgreSQL extension (kept as the upgrade path for measurement history).

## Consequences

Schema changes are versioned SQL files in `src/migrations/`. Time-series performance is not optimized in version 1; the data volume of the evaluation does not require it.

See document 05, section 5.3.
