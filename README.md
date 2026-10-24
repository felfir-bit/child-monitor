# Child Development Monitor

**Development of a Digital System for Monitoring Child Development**

Diploma project, Software Engineering, group SE-2410, Astana IT University.
Task tracking: [YouTrack, project DIP](https://chil-monitoring-system.youtrack.cloud/projects/DIP). Repository: [felfir-bit/child-monitor](https://github.com/felfir-bit/child-monitor).

## What the system will do

For each child aged 0 to 5 the system keeps one dated record of **growth measurements** (weight, length or height with the measuring method, head circumference), **milestone answers** (`yes`, `not_yet`, `not_sure`) and **specialist notes**. Measurements are compared with the WHO Child Growth Standards (z-scores and percentiles for 0 to 60 months, corrected age for children born before 37 weeks until 24 months). Milestone answers follow the CDC 2022 evidence-informed checklists and the WHO windows for six gross motor milestones. When a value or an answer is outside the reference, the system shows a signal (G1, G2, M1, W1) that suggests a conversation with a specialist; **the system never diagnoses**. Reminders follow the Kazakhstan preventive examination ages, and notifications are shown in the app. The full model is in [document 00](docs/00-monitoring-model.md).

## Problem

Between polyclinic visits, families have no structured record of their child's growth and development. Measurements stay in the clinic system or in a notebook, and a speech therapist, a psychologist or a kindergarten teacher keeps separate notes. Values are hard to compare with a reference or over months, and a parent has no simple way to decide which specialist sees what. The existing tools we compared (document 04) screen the child, keep a private parent log or hold the clinic record, but none combines a parent-controlled record with reference-based monitoring and specialist notes. The problem statement rests on documentary evidence and on four needs interviews (three parents, one pediatrician) logged in document 02.

## Users

- **Parents** of children aged 0 to 5: create child profiles, record measurements and milestone answers, grant and revoke per-child access for a specialist by email, read specialist notes.
- **Specialists** (pediatric nurse or pediatrician, speech therapist, psychologist, kindergarten teacher): see only the children granted to them, record observations and write notes.

There is no administrator role.

## Team

| Member | Area | Responsibilities |
| --- | --- | --- |
| Zhan Erkebulan (Жан Еркебулан) | Profiles, access and operations | Authentication and roles, child profiles, access control, specialist notes, API documentation, containerization and monitoring; project management |
| Tasimov Arsen Malekovich (Тасимов Арсен Малекович) | Indicators and analytics | Growth and development indicators, observation history, dynamics analytics, visualization, notifications |

**Supervisor:** Zhuldyz Basheyeva (Башеева Жулдыз), Astana IT University.

## Planned technologies

Go with Fiber v2, PostgreSQL 16, REST with OpenAPI 3.0.3, JWT (HS256, one-hour lifetime) and Argon2id password hashing (passwords of 15 to 128 characters), a React progressive web app, Docker Compose with Prometheus and Grafana. In a real deployment the data is stored in Kazakhstan (Law No. 94-V). The choices are compared in document 05 and recorded in `docs/adr/`.

## Status at pre-defense 1 (24 October 2026)

**Delivered (documentation only):** monitoring model, proposal, evidence of relevance (documentary findings and four interviews), literature review, comparison of existing systems, technology comparison with seven ADRs, requirements, architecture with eight diagrams, clickable prototype of scenarios SC1 to SC6, verification plan, project plan and risks, pre-defense preparation.

**Open:**

- Four needs interviews are logged (3 parents, 1 specialist; document 02). More specialists (speech therapist, teacher) would strengthen A3.
- No supervisor feedback is recorded yet (document 11).
- Mockups for scenarios SC7 to SC10 (growth chart, checklist, signals, reminders) are planned.
- `src/`, `tests/` and `config/` contain only `.gitkeep`. Implementation starts at milestone M2 (document 10).

## How to review

1. Read the documents in order; the index is [docs/README.md](docs/README.md).
2. Diagrams: PlantUML sources in [diagrams/src/](diagrams/src/), SVG and PNG exports in [diagrams/rendered/](diagrams/rendered/), description in [diagrams/README.md](diagrams/README.md).
3. Prototype: open [prototype/index.html](prototype/index.html) in a browser. Demo accounts: `parent@example.com` (parent) and `specialist@example.com` (specialist); the password is not checked. Details in [prototype/README.md](prototype/README.md).

## Repository structure

```
.gitignore
README.md
config/            empty until M2 (Prometheus and Grafana configuration)
diagrams/
  README.md
  src/             8 PlantUML sources
  rendered/        SVG and PNG exports
docs/
  README.md        index of documents and identifiers
  00-monitoring-model.md ... 12-pre-defense-preparation.md
  adr/             ADR-001 to ADR-007
  evidence/        interview guide and interview notes
prototype/         clickable static mockup (HTML, CSS, JS)
src/               empty until M2 (Go service)
tests/             empty until M2
```

## Working rules

Each student commits from their own GitHub account (Zhan: `felfir-bit`, Arsen: `k1ays`). Every change belongs to a YouTrack task: the branch is named `DIP-<n>-<slug>`, the commit message starts with `DIP-<n>:`, and the change reaches `main` only through a pull request reviewed by the other student. Secrets are never committed. Submission tags (`pre-defense-1`, `pre-defense-2`, `final-pre-defense`) are never moved. Details are in [document 10](docs/10-project-management-risks.md).

Full project proposal: [docs/01-project-proposal.md](docs/01-project-proposal.md)
