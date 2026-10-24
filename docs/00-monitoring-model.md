# 0. Monitoring Model

**Status at pre-defense 1:** this is the specified model. It is the basis for the requirements (document 06), the architecture (document 07) and the prototype (document 08). Implementation is planned for milestones M2 and M3 (document 10); no code exists yet.

## 0.1 Purpose

For each child aged 0 to 5 the system keeps one dated record. The record holds what parents and specialists measured, observed and wrote, compares it with published references and shows where a conversation with a specialist may help. **The system never diagnoses.** It does not classify a child, give a score or name a condition.

## 0.2 What is recorded

| Record | Fields | Who records | Rules | Status |
|---|---|---|---|---|
| Child profile | Full name, birth date, sex (`male`, `female`), optional gestational age at birth in whole weeks (22 to 44) | Parent (owner) | Age 0 to 5 years at creation; sex is required because the WHO standards are sex-specific | Specified |
| Growth measurement | Date, weight (kg, 0.01), length or height (cm, 0.1) with the method (`recumbent` or `standing`), head circumference (cm, 0.1) | Parent or granted specialist | At least one value; date not before birth and not in the future; standing height not before 9 months; input limits in FR-GRW-01 | Specified |
| Milestone answer | Item, answer `yes`, `not_yet` or `not_sure`, date | Parent or granted specialist | Append-only; parent and specialist answers are kept separately, the latest answer counts | Specified |
| Specialist note | Text of 1 to 4000 characters | Granted specialist | Only the author edits or deletes; the owner parent reads all notes | Specified |
| Access grant | Child, specialist email, granted and revoked time | Parent (owner) | One active grant per child and specialist; revocation takes effect at the next request | Specified |

Every record keeps its author, the author's role and the time of creation. Changes of a measurement are kept as revisions (FR-GRW-04).

## 0.3 What is calculated: growth

Reference: WHO Child Growth Standards (document 03, R1 and R2).

- **Indicators:** weight-for-age, length/height-for-age, weight-for-length (45 to 110 cm) or weight-for-height (65 to 120 cm), BMI-for-age, head circumference-for-age.
- **Age range:** 0 to 60 months. Above 60 months no z-score is computed and the response gives the reason.
- **Sex:** every table is sex-specific, so the child profile must have a sex.
- **Method:** the LMS method, z = ((value / M)^L − 1) / (L × S), with WHO's adjustment beyond ±3 SD for weight-based indicators; percentile = 100 × Φ(z). Length measured standing before 731 days gets +0.7 cm, length measured lying from 731 days gets −0.7 cm, as in WHO's `anthro` software (R4, ADR-006).
- **Corrected age:** when gestational age is below 37 weeks and the chronological age is below 24 months, the age used is chronological age minus (40 − gestational age) weeks.
- **Implausible values:** WHO's flags for biologically implausible z-scores are used for signal G2.

Z-scores are computed when a record is read, so a correction of the birth date or of the reference data never leaves stale values.

## 0.4 What is calculated: milestones

References: CDC 2022 evidence-informed checklists (document 03, S1 and R7) and the WHO windows of achievement for six gross motor milestones (S2 and R3).

- **CDC checklists:** 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, 3, 4 and 5 years; four domains (social and emotional 42 items, language and communication 40, cognitive 33, movement and physical development 44); **159 items** in total. Each item is a skill that at least 75% of children show by that age.
- **WHO motor milestones:** sitting without support, hands-and-knees crawling, standing with assistance, walking with assistance, standing alone, walking alone, each with the age window from the WHO Motor Development Study (S2).
- **Current checklist:** the latest checklist whose age the child has reached, by corrected age where it applies (0.3). A newborn sees the upcoming 2-month checklist. Earlier checklists stay available.
- **Texts:** English from CDC; Russian and Kazakh translations must be reviewed before use with participants (NFR-REF-02, assumption A8).

## 0.5 Signals

A signal is a dated note in the record that a value or an answer is outside the reference. It suggests a conversation with a specialist. It is never a diagnosis.

| Type | Rule | Fixed text (English) |
|---|---|---|
| G1 | The latest z-score of a growth indicator is below −2 or above +2 | "This value is outside the range in which about 95 of 100 healthy children of the same age and sex are found (WHO Child Growth Standards). Please discuss it with your pediatrician or nurse." |
| G2 | The latest value is flagged as implausible by the WHO limits | "This value is very unusual for the child's age. Please check the measurement and enter it again if it was a typing error." |
| M1 | The latest answer to a CDC item is `not_yet` and the child's age (corrected where it applies) is at or after the checklist age | "Most children (at least 3 of 4) do this by this age (CDC). You may want to talk about it with your child's doctor, nurse or another specialist." |
| W1 | The latest answer to a WHO motor milestone is `not_yet` after the upper end of its window, **except crawling** (some healthy children never crawl) | "Most children reach this milestone by this age (WHO). You may want to talk about it with your child's doctor or nurse." |

Rules shared by all signals:

- `not_sure` never raises a signal.
- There is at most one open signal per child, type and subject (indicator or item).
- **States:** `open` → `discussed` (a parent or granted specialist marks it, with who and when) → `resolved` (set automatically when the condition ends, for example a new measurement inside ±2 or a `yes` answer).
- Every signal shows the value or item, the reference, the date and the source record.
- Signal and notification texts never contain the words "norm", "delay", "disorder" or "risk" in any language (FR-SIG-02).
- The thresholds and their sources are kept as reference data (ADR-005), so they can be reviewed without changing code.

## 0.6 Reminders and notifications

Notifications are **in-app** in version 1 (ADR-007). E-mail and web push are future work.

| Event | Recipients |
|---|---|
| A checklist becomes due (the child reaches its age) | Owner parent |
| A preventive examination age is reached (Order No. ҚР ДСМ-264/2020, R11: 1, 5, 6, 9, 12, 15, 18, 21, 24 and 30 months, 3, 4 and 5 years) | Owner parent |
| A new signal is opened | Owner parent and granted specialists, except the author of the record |
| A new specialist note is added | Owner parent |

A periodic job (planned hourly) re-evaluates signals and creates due reminders once per age; a unique key per recipient and event prevents duplicates. The examination ages are to be checked against the current revision of the order before use.

## 0.7 What each role sees

| | Owner parent | Granted specialist | Other users |
|---|---|---|---|
| Child profile | Read, edit, delete | Read | Not visible (404) |
| Access grants | Create, list, revoke | Not allowed (403) | Not visible (404) |
| Measurements, answers | Record, read; edit or delete own | Record, read; edit or delete own | Not visible (404) |
| Notes | Read all | Write; read all; edit or delete own | Not visible (404) |
| Signals | Read, mark as discussed | Read, mark as discussed | Not visible (404) |
| Notifications | Own only | Own only | Not visible (404) |

403 means the actor can see the resource but may not perform the action; 404 means the actor cannot see it at all. There is no administrator role.

## 0.8 End-to-end scenario

1. A parent registers, accepts the consent text and creates a profile for a girl born at 34 weeks, now 10 months old (corrected age about 8.5 months).
2. The parent enters a weight from the polyclinic printout. The system computes the weight-for-age z-score by corrected age; it is −2.3, so signal G1 opens with its fixed text.
3. The parent opens the current checklist (the 6-month checklist, by corrected age) and answers the items; one movement item is `not_yet`. Because the corrected age is past 6 months, signal M1 opens.
4. The parent grants access to a pediatric nurse by email. The nurse sees only this child, reads the signals and writes a note.
5. The parent receives an in-app notification about the note. After a conversation with the nurse, the parent marks both signals as discussed.
6. A month later a new weight is inside ±2; G1 is resolved automatically. A `yes` answer resolves M1.
7. The parent revokes the nurse's access; the nurse's next request for the child returns 404.

## 0.9 Limits

- The model records and compares; it does not screen or diagnose. Screening tools have only moderate accuracy for individual children (document 03, S6), so the system makes no claim about a child's condition.
- Parent reports agree with clinicians better for motor skills than for language and social skills (S4); every answer therefore shows whether a parent or a specialist gave it.
- The CDC checklists were written for children in the United States; the translations may change the meaning of an item (A8).
- The WHO growth standards end at 60 months; for older children the record keeps values without z-scores.
- The ±2 SD threshold for head circumference, the corrected-age limit of 24 months and the use of the national scales of Order No. 704 are open questions for the supervisor (document 11).
- Only synthetic data is used in development and evaluation; no real child's record is stored.
