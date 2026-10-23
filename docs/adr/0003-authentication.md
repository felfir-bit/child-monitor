# ADR-003: Authentication

Status: accepted

## Context

The API is consumed by a browser client and tested with command-line tools. The service should stay stateless and easy to test.

## Decision

Issue JWT access tokens signed with HS256, valid for one hour. Validate the algorithm explicitly. Store passwords with Argon2id.

## Alternatives

- Server-side sessions with an HTTP-only cookie (immediate revocation, needs CSRF protection).
- OAuth 2.0 and OpenID Connect with an external provider (out of scope for version 1).

## Consequences

Tokens cannot be revoked before expiry. Access to a child is nevertheless checked against the database on every request, so a revoked grant stops working immediately. Refresh tokens are future work.

See document 05, sections 5.5 and 5.6.
