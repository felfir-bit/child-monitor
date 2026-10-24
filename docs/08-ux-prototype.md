# 8. UX and Prototype

## 8.1 Purpose

The checklist asks for mockups of key user scenarios. For a project with a user interface, these are screens. The prototype in `prototype/` is a clickable, static mockup. It shows how a parent and a specialist will move through the scenarios of the planned API. It is not connected to a backend; no backend exists yet. The screens will be implemented in the React client at milestone M4.

## 8.2 Users and main scenarios

| Scenario | Actor | Goal | Screens |
|---|---|---|---|
| SC1 | Parent | Register, log in | Login and registration |
| SC2 | Parent | Add a child (age 0 to 5 years) | Children list, add child form |
| SC3 | Parent | Grant a specialist access to one child and revoke it later | Child profile, access block |
| SC4 | Parent | Read what specialists wrote about the child | Child profile, notes block (read only) |
| SC5 | Specialist | See only the children granted to them | My children list |
| SC6 | Specialist | Add, edit and delete their own notes on a granted child | Child page, notes block |
| SC7 | Parent or specialist | Record a measurement and see it on the WHO growth chart | Growth block: entry form, chart with z-score lines (Arsen; API and screen planned) |
| SC8 | Parent or specialist | Answer the milestone checklist for the child's current age | Milestones block: checklist by domain (Arsen; API and screen planned) |
| SC9 | Parent or specialist | See open signals and mark them as discussed | Signals block on the child overview (Arsen; API and screen planned) |
| SC10 | Parent | See reminders for the next checklist and the next preventive examination | Notifications list (Arsen; API and screen planned) |

The content of SC7 to SC10 follows the monitoring model in [document 00](00-monitoring-model.md).

## 8.3 Screen-to-API mapping

The endpoints are the planned contract from document 07, section 7.9.

| Screen element | Endpoint |
|---|---|
| Register | `POST /api/v1/auth/register` |
| Login | `POST /api/v1/auth/login` |
| Children list (parent) | `GET /api/v1/children` |
| Add child | `POST /api/v1/children` |
| Child profile | `GET /api/v1/children/{childId}` |
| Edit child | `PATCH /api/v1/children/{childId}` |
| Delete child | `DELETE /api/v1/children/{childId}` |
| Grant list and add grant | `GET\|POST /api/v1/children/{childId}/access-grants` |
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
- Scope: scenarios SC1 to SC6 without API calls. SC7 to SC10 appear as a placeholder block; mockups of the growth chart, the checklist, the signals and the reminders are planned for pre-defense 2.
- Limitations: no real authentication, no offline mode, no accessibility audit yet.

The prototype's own README lists which screen covers which scenario.

## 8.7 Client technology (planned)

The production client is a React application built as a PWA (ADR-004). The manifest includes name, short name, 192 and 512 px icons, a start URL and standalone display mode, and the site is served over HTTPS, which the installability criteria require (document 05, T4).

## 8.8 UX questions answered in the interviews

The questions were asked in the needs interviews on 23 October 2026 (document 02, section 2.5) through the follow-up questions in [evidence/00-interview-guide.md](evidence/00-interview-guide.md):

| Question | Asked through | Answer | Design decision |
|---|---|---|---|
| Is the wording of a milestone item understood as intended (A8)? | FU1 | P1, P2, P3 explained the item correctly; the language was not recorded | Keep short item texts; repeat FU1 with the reviewed Russian and Kazakh texts |
| Specialist notes in full or as a summary? | FU2 | Summary: P1, P3; full: P2 | Show a short preview of each note that expands to the full text |
| How often do parents expect to add observations? | FU2 | After visits, weekly, every 2–3 weeks or monthly (P1, P2, P3); nobody daily | No daily prompts and no separate quick-entry mode in version 1 |
| Website on the phone (PWA) or store app (A5)? | FU3 | Web app: P1, P3; store app: P2 | Keep the PWA (ADR-004); check again in the usability sessions |
| Do specialists want to write notes for several children at once? | Specialist follow-up | No (SP1) | No batch entry |
| Percentile lines or z-score lines on growth charts? | Specialist follow-up | Percentiles are easier to explain to parents (SP1) | Label the chart lines with percentiles for parents (z = −2, 0, +2 shown as about the 2nd, 50th and 98th percentile; FR-GRW-03); z-scores stay visible to specialists |
| Are signals understood as a suggestion, not a diagnosis (A4)? | Parent question 7, specialist question 4 | Accepted by P1, P2, P3; SP1 advises neutral wording without words such as "delay" or "pathology" | Keep the fixed texts of document 00, 0.5 |
| What would make parents stop? | Parent question 8 | Complex screens, daily entry, aggressive push notifications, many mandatory fields, paid basics | One required value per measurement; in-app notifications only (ADR-007) |

## 8.9 Assumptions behind the design

| Assumption (document 02, 2.4) | Design decision | How it is checked | Interview result |
|---|---|---|---|
| A1 Families have no structured record between polyclinic visits | One dated history per child (SC7 to SC10) | Interviews; time to find a past note, metric M3 (document 09) | Supported (P1, P2, P3) |
| A2 Parents want control over which specialist sees the record | Access block with grant and revoke on the child profile (SC3) | Interviews; access and revoke walkthrough (metric M4) | Supported (P1, P2, P3, SP1) |
| A3 Specialists want to add notes and observations to the same record | Notes block for granted specialists; specialist answers shown separately (SC6, SC8) | Specialist interviews; FU2 | Partly supported (SP1, P2) |
| A4 Parents accept signals that suggest a conversation instead of a diagnosis | Fixed signal texts, source on every chart (principle 3) | Interviews; chart reading, metric M10 | Supported (P1, P2, P3, SP1) |
| A5 Parents would use a phone web app (PWA) rather than a native app | Phone-first layout, installable PWA (8.7) | FU3; usability sessions | Mixed (P1, P3 for; P2 against) |
| A6 Child records are sensitive and need consent and access rules | Consent at registration, visible list of who has access (principle 5) | Security checks, document 09, 9.6 | Supported (P1, P2, P3) |
| A7 Parents can obtain measurements and are willing to enter them | Short measurement form with one required value (SC7) | Interviews (parent questions 1, 2) | Supported for weight and height (P1, P2, P3) |
| A8 Russian and Kazakh milestone texts are understood as intended | Item texts with source; reviewed translations | FU1; translation review (NFR-REF-02) | Partly supported (P1, P2, P3) |
