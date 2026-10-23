# Diagrams

Editable PlantUML sources are in `src/`. Rendered exports (SVG and PNG) are in `rendered/`, with the same base names. All diagrams follow the monitoring model in `docs/00-monitoring-model.md` and the architecture in `docs/07-architecture.md`.

All names (packages, services, tables, endpoints) are taken from the code in `src/` as of 22 October 2026.

## Required by the checklist

| File | What it shows |
|---|---|
| `system-context.puml` | Parent, specialist and operator; the polyclinic as the source of measured values (no integration); WHO Child Growth Standards, CDC 2022 checklists and Kazakhstan examination rules embedded as reference data; in-app notifications; Prometheus and Grafana |
| `use-case.puml` | UC1 to UC6 for profiles and access (Zhan) and UC7 to UC14 for overview, growth, milestones, signals, history and reminders (Arsen); z-score computation, checklist selection and signal rules are included use cases; the scheduler triggers reminders and time-based signals |
| `component.puml` | Go packages: `httpapi`, the services of both students with their listener links (ChildListener, NoteListener, SignalListener), AccessPolicy, the pure packages (`anthro`, `reference`, `domain`, `security`), `store` and `migrations`; the React client as the next step |
| `container.puml` | Browser (client and Swagger UI), reverse proxy, API container with embedded reference data and the reminder job, PostgreSQL tables, Prometheus, Grafana; server located in Kazakhstan |

## How the system works

| File | What it shows |
|---|---|
| `data-model.puml` | The ten tables created by migrations 001 and 002 with keys, constraints and cascades, and the embedded reference files |
| `sequence-measurement.puml` | `POST .../measurements`: authentication, access check, 400 and 422 validation, z-scores by `anthro`, signal evaluation (G1, G2, resolution), notifications, response |
| `sequence-access.puml` | A parent grants access, the specialist reads the child and writes a note, the parent revokes access, and access ends at the next request |
| `activity-monitoring.puml` | The monitoring cycle for one child as implemented: corrected age, measurement and checklist branches, evaluation of G1, G2, M1 and W1, resolution, notifications and the hourly reminder job |

Elements marked `planned` (dashed outline, grey fill) are not built yet: only the web client and the reverse proxy. Reference elements (green) are published standards embedded as data.

## Rendering

Requirements: Java and a PlantUML jar. From `diagrams/`:

```
java -jar plantuml.jar -tsvg -o ../rendered src/*.puml
java -jar plantuml.jar -tpng -o ../rendered src/*.puml
```

A render is valid when the SVG contains no `Syntax Error` text and the files are not empty.
