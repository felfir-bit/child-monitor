# Child Development Monitor

**Development of a Digital System for Monitoring Child Development**

Child Development Monitor is a web system that keeps one structured development record for each child aged 0 to 5. The parent owns the record and decides which specialists may see it. Specialists with access add notes, and the second part of the system shows how the child's indicators change over time. The system records observations. It does not diagnose.

## Problem Statement

Observations of a young child are kept in scattered places such as notebooks, phone photos and messages, and parents and specialists who work with the same child rarely share one record. It is hard to compare what a child could do months ago with what they can do now, and a parent has no simple way to decide which specialist sees what. Existing tools either screen the child with questionnaires of moderate accuracy or let a parent keep a private log, and none of the systems we reviewed combines a parent-controlled record with specialist contributions.

## Target Users

- Parents of children aged 0 to 5, who create child profiles, grant and revoke specialist access, and read specialist notes.
- Specialists (teachers, educators, psychologists) who see only the children granted to them and write notes about those children.

## Expected Outcomes

- A backend with a documented REST API and an automated test suite.
- Parent-controlled access to a child's record, with per-child grants for specialists.
- Observation history and dynamics of development indicators.
- A clickable prototype of the main screens.
- An evaluation report covering access correctness and usability on synthetic data.

## Team

| Member | Area | Responsibilities |
| --- | --- | --- |
| Zhan Erkebulan | Backend | Authentication and roles, child profiles, access control, specialist notes, API documentation, containerization and monitoring; project management |
| Tassimov Arsen | Indicators and analytics | Development indicators, observation history, dynamics analytics, notifications; testing and integration of these modules |

**Supervisor:** Zhuldyz Basheyeva, Astana IT University.

Group SE-2410, Astana IT University.

## Scope and Status

**Included:** registration and login for parents and specialists; child profiles with the 0 to 5 age rule; per-child access grants with revocation; specialist notes with author-only changes; indicators, observation history, analytics and notifications (second student, planned).

**Excluded:** diagnosis and risk scoring, native mobile apps, integration with clinics or government systems, real children's data.

**Status (pre-defense 1, 24 October 2026):** analysis and design documents, diagrams and the prototype are drafted.

Full project proposal: [docs/01-project-proposal.md](docs/01-project-proposal.md)
