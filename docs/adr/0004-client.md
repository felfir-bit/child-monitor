# ADR-004: Client application

Status: accepted

## Context

Parents and specialists use the system on phones and desktops. The team has no mobile store process within the project time.

## Decision

Build a React single-page application that is installable as a progressive web app (manifest, icons, HTTPS).

## Alternatives

- Native mobile applications (two code paths or a cross-platform framework; store publication).
- Server-rendered pages (poorer interactive experience, couples the frontend to the backend).

## Consequences

Web push notifications are not reliable on all mobile platforms, so the notification module must not depend on them in version 1. The notification channel decision is recorded separately.

See document 05, section 5.7.
