# ADR-007: Notification channel

Status: accepted

## Context

Document 00, section 0.6 lists four events that notify a parent or a specialist: a due checklist, a preventive examination age, a new signal and a new specialist note. The channel was left open (in-app, e-mail, web push).

## Decision

Version 1 delivers notifications in the app only. NotificationService stores one row per recipient in `notifications`, and the client reads `GET /api/v1/me/notifications` (unread first) and marks them read. A unique key per recipient and event makes the periodic reminder job safe to repeat. Texts are rendered when read, in the language the client asks for.

## Alternatives

- E-mail: needs an SMTP provider, verified addresses, unsubscribe handling and a decision on where personal data leaves the system.
- Web push: needs the PWA service worker and VAPID keys; the client does not exist yet.

## Consequences

Users see notifications only when they open the app. E-mail or web push can be added later as another consumer of the same notification rows, without changing the services that create them.
