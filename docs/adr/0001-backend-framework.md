# ADR-001: Backend framework

Status: accepted

## Context

The service needs a REST API with JWT authentication, JSON error handling, metrics and a small team of two students with a deadline.

## Decision

Use Go with the Fiber v2 framework.

## Alternatives

- Go standard library `net/http` with Go 1.22 method routing (fewer dependencies, more boilerplate).
- Gin (not evaluated against a source; kept as a known alternative).

## Consequences

Fiber is built on fasthttp. Libraries that expect `http.Handler` need an adaptor, which the planned metrics endpoint will use. If the adaptor becomes a problem, the standard library is the fallback.

See document 05, section 5.2.
