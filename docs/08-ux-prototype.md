# 8. UX and Prototype

## 8.1 Purpose

The checklist asks for mockups of key user scenarios. For a project with a user interface, these are screens. The prototype in `prototype/` is a clickable, static mockup. It shows how a parent and a specialist move through the scenarios that the API supports. It is not connected to the backend. The screens will be implemented in the React client, which is not part of the backend work in this repository.

## 8.2 Users and main scenarios

| Scenario | Actor | Goal | Screens |
|---|---|---|---|
| S1 | Parent | Register, log in | Login and registration |
| S2 | Parent | Add a child (age 0 to 5 years) | Children list, add child form |
| S3 | Parent | Grant a specialist access to one child and revoke it later | Child profile, access block |
| S4 | Parent | Read what specialists wrote about the child | Child profile, notes block (read only) |
| S5 | Specialist | See only the children granted to them | My children list |
| S6 | Specialist | Add, edit and delete their own notes on a granted child | Child page, notes block |
| S7 | Parent or specialist | Record a measurement and see it on the WHO growth chart | Growth block: entry form, chart with z-score lines (Arsen; API implemented, screen planned) |
| S8 | Parent or specialist | Answer the milestone checklist for the child's current age | Milestones block: checklist by domain (Arsen; API implemented, screen planned) |
| S9 | Parent or specialist | See open signals and mark them as discussed | Signals block on the child overview (Arsen; API implemented, screen planned) |
| S10 | Parent | See reminders for the next checklist and the next preventive examination | Notifications list (Arsen; API implemented, screen planned) |

The content of S7 to S10 follows the monitoring model in [document 00](00-monitoring-model.md).

## 8.3 Screen-to-API mapping

| Screen element | Endpoint |
|---|---|
| Register | `POST /api/v1/auth/register` |
| Login | `POST /api/v1/auth/login` |
| Children list (parent) | `GET /api/v1/children` |
| Add child | `POST /api/v1/children` |
| Child profile | `GET /api/v1/children/{childId}` |
| Edit child | `PATCH /api/v1/children/{childId}` |
| Delete child | `DELETE /api/v1/children/{childId}` |
| Grant list and add grant | `GET|POST /api/v1/children/{childId}/access-grants` |
| Revoke grant | `DELETE /api/v1/children/{childId}/access-grants/{grantId}` |
| Notes list | `GET /api/v1/children/{childId}/notes` |
| Add note | `POST /api/v1/children/{childId}/notes` |
| Edit note | `PATCH /api/v1/notes/{noteId}` |
| Delete note | `DELETE /api/v1/notes/{noteId}` |
| Add measurement | `POST /api/v1/children/{childId}/measurements` |
| Growth chart | `GET /api/v1/children/{childId}/growth/{indicator}` |
| Current checklist | `GET /api/v1/children/{childId}/milestones/current` |
| Answer milestones | `POST /api/v1/children/{childId}/milestones/answers` |
| Signals | `GET /api/v1/children/{childId}/signals` |
| Notifications | `GET /api/v1/me/notifications` |

## 8.4 Interaction rules

- **Age validation before submit:** the add-child form shows the allowed range (0 to 5 years) and blocks a birth date outside it. The server still validates (422).
- **Access visibility:** a parent sees the list of granted specialists with the grant date and a revoke action. A specialist never sees the grant block.
- **Note ownership:** edit and delete buttons appear only on the specialist's own notes. A parent sees notes read only.
- **Empty states:** a specialist with no granted children sees an explanation and no list; a child with no notes sees a short prompt.
- **Errors:** a 404 on a child is shown as "not found or not available", not as a permission error, matching the API's visibility rule.

## 8.5 Design principles

1. **Phone first.** The layout works from 360 px width without horizontal scrolling (NFR-USE-01).
2. **One task per screen.** Each screen supports one scenario.
3. **Reference, not diagnosis.** Growth is shown against the WHO lines with the source named on the chart; milestones are shown as "most children do this by this age" with the source. Signals use the fixed texts from document 00, section 0.5, and never the words "norm", "delay", "disorder" or "risk" (FR-SIG-02).
4. **Source of every answer.** Each measurement and milestone answer shows whether a parent or a specialist recorded it.
5. **Consent visible.** A parent always sees who has access to the child.
6. **Accessibility basics.** Labels on every field, focus outlines, text contrast suitable for reading on a phone in daylight.

## 8.6 Prototype

- Location: `prototype/` (open `index.html` in a browser or run `python3 -m http.server` in the folder).
- Data: in-memory with optional browser storage; demo data is invented.
- Scope: scenarios S1 to S6 without live API calls. S7 to S10 currently appear as a placeholder block; mockups of the growth chart, the checklist and the signals are task DIP-28.
- Limitations: no real authentication, no offline mode, no accessibility audit yet.

The prototype's own README lists which screen covers which scenario.

## 8.7 Client technology (planned)

The production client is a React application built as a PWA (ADR-004). The manifest includes name, short name, 192 and 512 px icons, a start URL and standalone display mode, and the site is served over HTTPS, which the installability criteria require (document 05, T4).

## 8.8 Open UX questions

These are answered through the interviews in document 02:

- Do parents want to see specialist notes in full or as a summary?
- How often do parents expect to add observations? This decides whether a quick-entry mode is needed.
- Do specialists want to write notes for several children at once?
- Do parents read the growth chart better with z-score lines or with percentile lines?
- Is the wording of the signals understood as a suggestion, not as a diagnosis (assumption A4)?
