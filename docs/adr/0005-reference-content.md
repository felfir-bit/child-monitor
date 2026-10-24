# ADR-005: Development reference content

Status: accepted for development; the content source remains to be confirmed by the supervisor (document 11, question 8)

## Context

The system compares a child's records with references (document 00). The references must be scientifically sound, free to use, available for ages 0 to 5, and understandable to parents in Russian and Kazakh.

## Decision

Use the WHO Child Growth Standards for growth, the CDC 2022 evidence-informed milestone checklists for development, and the WHO windows of achievement for six gross motor milestones. Store them as versioned reference data with their source.

Planned implementation (milestone M3):

- `src/internal/reference/data/milestones.json` will hold 159 CDC items (12 checklists, 42 social and emotional, 40 language and communication, 33 cognitive, 44 movement and physical, as in Zubler et al. 2022) with the English text from CDC's *Learn the Signs. Act Early.* checklists and reviewed Russian and Kazakh texts; 6 WHO motor milestones with their windows; the source of each item and the review status of each language.
- `src/internal/reference/data/examinations.json` will hold the preventive examination ages from Annex 1 of Order No. ҚР ДСМ-264/2020 (1, 5, 6, 9, 12, 15, 18, 21, 24, 30 months, 3, 4 and 5 years).
- `src/internal/reference/data/signal_rules.json` will hold the thresholds and the source of every signal rule, and the corrected age rule.
- The files will be embedded in the binary and validated at start-up (unique ids, known domains and ages, valid windows). Planned tests will check the published counts.

## Alternatives

- ASQ-3: validated, but a licensed product; its scores would imply screening accuracy.
- National scales of neuropsychic development from Order No. 704: match local practice; designed for nurses; not yet reviewed by the team.

## Consequences

The Russian and Kazakh texts must be written and reviewed before use with participants; the reviewer and date go into the catalog (NFR-REF-02). Every item, chart and signal names its source. Replacing the content source means replacing the JSON files and their version; stored answers keep only item ids.

See document 05, section 5.8.
