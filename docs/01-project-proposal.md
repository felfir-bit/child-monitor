# 1. Project Proposal

## I. Project Title

**Development of a Digital System for Monitoring Child Development**

Working name: **Child Development Monitor**

Repository: [felfir-bit/child-monitor](https://github.com/felfir-bit/child-monitor). Task tracking: [YouTrack, project DIP](https://child-monitoring.youtrack.cloud).

## II. Project Team and Supervision

The project is carried out by students of group SE-2410, Astana IT University. Responsibilities are distributed by technical area, as shown in Table I. The distribution follows the supervisor's justification document.

**TABLE I. Team Members and Responsibilities**

| Member | Area | Responsibilities |
| --- | --- | --- |
| Zhan Erkebulan (Жан Еркебулан) | Backend: profiles and access | Authentication and roles, child profiles, access control, specialist notes, API documentation, containerization and monitoring; project management |
| Tasimov Arsen Malekovich (Тасимов Арсен Малекович) | Backend: indicators and analytics | Growth and development indicators, observation history, dynamics analytics, visualization, notifications; testing and integration of these modules |

The web client is built by both students, split by screens. The literature review, the comparisons, the requirements, the diagrams, the prototype and the evaluation are shared work; the tasks for pre-defense 1 are listed in document 10, section 10.4.

**Supervisor:** Zhuldyz Basheyeva (Башеева Жулдыз), Astana IT University.

## III. Background and Problem Statement

### A. Context

Pediatric guidance recommends developmental surveillance at every health visit, with standardized screening at fixed ages [1]. A single check says little about how a child is changing; repeated, dated observations do. In Kazakhstan, weight, height and head circumference of children under five are measured at preventive examinations [7], development is screened from birth with questionnaires for parents and a nurse's assessment [8], and the results are entered in the clinic's medical information system [9].

Between visits the family has no structured record of its own. Parents write values in a notebook, take photos of the clinic's printout or keep them in messages. A speech therapist, a psychologist or a kindergarten teacher who works with the same child keeps separate notes. Nobody holds the whole picture, and a parent often learns what a specialist saw only if the specialist tells them in person.

### B. Limitations of Current Tools

Parent reports are a useful source of everyday observations, but they agree with clinicians better for motor skills than for language and social communication [2]. Digital screening tools have moderate accuracy: a case-control study of the TOY8 tool in 127 children aged 3 to 5 reported sensitivity of 0.77 to 0.84 and specificity of 0.65 to 0.67 [3]. Results like these do not justify labelling an individual child. For that reason the system records observations, compares them with published references and leaves interpretation to a specialist.

We compared five existing systems using public documentation: CDC Milestone Tracker, Kinedu, Baby Connect, ASQ Online with ASQ Family Access, and Damumed (document 04). Each covers part of the problem: milestone checklists, development activities, shared logging, professional screening or clinic records. In the public sources none of them combines WHO-based growth records, evidence-informed milestone checklists, parent-controlled access for a specialist to one particular child, and attributed specialist notes in the same record. The comparison is based on public descriptions; hands-on testing of the apps is a follow-up task.

Time is another constraint. A scoping review of parents' use of digital tools reports that parents find them useful but often lack the time to apply recommendations [4]. A record-keeping tool therefore has to be quick to use.

### C. Problem Statement

Parents and specialists who work with the same young child have no shared, structured record of the child's growth and development between polyclinic visits. Measurements and observations are scattered, they cannot easily be compared with a reference or over months, and the parent has no simple way to decide which specialist sees what. Existing tools either screen the child, keep a private parent log or hold the clinic's record, but do not combine a parent-controlled record with reference-based monitoring and specialist contributions.

### D. Working Assumptions

The design depends on the following assumptions. They were tested in four semi-structured needs interviews on 23 October 2026 with three parents (P1 to P3) and one pediatrician (SP1) (document 02, section 2.5). A1, A2, A4 and A6 are supported, and A7 is supported for weight and height; A3 is partly supported, because only one specialist was interviewed, and A8 because the language of the tested items was not recorded; A5 is mixed (two parents prefer a web app, one a store app). The requirements that depend on them are labelled in document 06, section 6.1a.

1. Families do not have a structured record of growth and development between polyclinic visits (A1).
2. Parents want to decide which specialist can see their child's record (A2).
3. Specialists want to add attributed notes and observations to the same child record (A3).
4. Parents accept signals that suggest a conversation with a specialist instead of a diagnosis (A4).
5. Parents would use a web application on a phone (PWA) rather than a native app (A5).

The full register, including A6 to A8 (sensitivity of the data, willingness to enter measurements, understanding of translated milestone items), is in document 02, section 2.4.

Records of a child's development are personal data. The Kazakhstan law on personal data [6] applies: the consent of the legal representative, storage on the territory of Kazakhstan and protection duties are part of the design from the start. The exact wording of consent is to be agreed with the supervisor (document 11).

## IV. Target Users

The first group is parents of children aged 0 to 5. They create a child profile, record measurements and milestone answers, see growth charts and signals, decide which specialists may see the child, and read what specialists have written.

The second group is specialists: pediatric nurses or pediatricians, speech therapists, psychologists and kindergarten teachers. A specialist sees only the children whose parent has given access, records their own observations and writes notes about those children.

The system is not a medical device. It does not diagnose, score or classify a child.

## V. Aim

To develop a secure web system, installable as a progressive web app, in which parents and the specialists they authorize monitor the physical growth and developmental milestones of a child aged 0 to 5 against internationally accepted references (the WHO Child Growth Standards [10] and the CDC 2022 evidence-informed milestone checklists [5]), keep one dated history of measurements, observations and specialist notes, receive reminders, and see signals that suggest a conversation with a specialist, without the system producing a diagnosis. The monitoring model is described in document 00.

## VI. Objectives

The objectives and their completion criteria are listed in Table II. The metrics and thresholds are defined in the verification and evaluation plan (document 09).

**TABLE II. Project Objectives and Completion Criteria**

| # | Objective | Completion criterion |
| --- | --- | --- |
| O1 | Define the monitoring model and the requirements for parents, specialists and the system | Documents 00 and 06: functional and non-functional requirements with priorities (P0, P1, P2) and an acceptance criterion for each; supervisor review recorded in document 11 |
| O2 | Design and implement an access model with two roles (parent, specialist) and per-child grants | All 34 rows of the authorization matrix in document 09 return the expected status in automated tests (metric M1) |
| O3 | Implement authentication, child profiles, access control and specialist notes (Zhan) | The API is documented in OpenAPI; unit, HTTP and PostgreSQL integration tests pass; service-layer coverage is at least 70% (M2, M7) |
| O4 | Implement growth measurements with WHO z-scores, milestone checklists, signals, history and notifications (Arsen) | Z-scores within 0.01 of WHO's `anthro` software on a synthetic test set (M8); all signal boundary cases pass (M9) |
| O5 | Package and monitor the system | One-command start with Docker Compose; health and metrics endpoints; Grafana dashboard |
| O6 | Evaluate correctness and usability on synthetic data | Report with at least five usability sessions compared with the participants' current way of keeping records; at least 80% unaided task success (M4) and a SUS score of at least 70 (M5) |

## VII. Expected Outcomes

**At pre-defense 1 (24 October 2026):** analysis and design documents 00 to 12, editable diagrams with rendered exports, a clickable prototype of scenarios SC1 to SC6, a verification plan, and a YouTrack project with tasks linked to branches and reviewed pull requests from both students. Running code is not part of this milestone.

**At the final defense:**

1. A backend with a documented REST API (OpenAPI, Swagger UI) and an automated test suite.
2. Growth charts and milestone checklists based on the cited references, with signals worded as suggestions to talk to a specialist.
3. A web client (React PWA) with the screens designed in the prototype.
4. Updated diagrams and documentation that match the implementation.
5. An evaluation report based on synthetic data and a small usability study.

## VIII. Scope

### A. Inclusions

- Registration and login for parents and specialists with email and password; JWT-based sessions; consent recorded at registration.
- Child profiles for children aged 0 to 5, with sex and optional gestational age (needed for the WHO standards and corrected age).
- Per-child access grants from a parent to a specialist by email, with revocation that takes effect at the next request.
- Specialist notes on granted children; only the author edits or deletes a note; the parent reads all notes.
- Growth measurements (weight, length or height, head circumference) with z-scores and percentiles from the WHO Child Growth Standards for 0 to 60 months.
- Milestone checklists from the CDC 2022 revision and the WHO windows for six gross motor milestones; answers from parents and specialists stored separately.
- Signals G1, G2, M1 and W1 (document 00, section 0.5), reminders and in-app notifications (ADR-007).
- REST API with OpenAPI documentation, Docker deployment, Prometheus metrics and a Grafana dashboard.

### B. Exclusions

1. **Medical diagnosis, risk scoring and automatic classification of a child's development.** The system records observations and compares them with references; screening tools have only moderate accuracy [3], so a label for an individual child would not be justified.
2. **Proprietary screening instruments** (ASQ-3, Denver II), which require a licence.
3. **Native mobile applications and app store publication.** The client is planned as a React progressive web app.
4. **Integration with Damumed, kindergartens or other information systems.**
5. **Refresh tokens, two-factor authentication and organizations with several tenants.** These are future work.
6. **Production hosting and real users' data.** The evaluation uses synthetic data and adult participants only; no real child's record is stored.

## IX. Engineering Complexity

1. **A two-level access model.** Access to a child depends on the user's role and on ownership or an active grant, checked on every request, so that a revoked grant stops working immediately and other families' children stay invisible (404).
2. **Reference computation.** Z-scores with the WHO LMS method, sex- and age-specific tables, the WHO adjustment beyond ±3 SD and corrected age for preterm children, tested against WHO's own software.
3. **Versioned reference data.** WHO tables and milestone items are stored as data with their source and version, so a reference can be updated without changing code.
4. **Sensitive data about young children.** Records of minors are personal data [6]: secure password storage (Argon2id), token validation, data minimization, consent and storage in Kazakhstan.
5. **Time-dependent data from several authors.** Measurements and observations are stored with their revisions and authors, ordered by date, and used to show change, which must be presented as a record and not as a diagnosis.
6. **Two modules in one system.** Two separately developed modules share one API, one database and one access policy, so the contract between them must be explicit (document 07, section 7.10).

## X. Constraints and Risks

The deadline for the first pre-defense is 24 October 2026. The team has two students who work on separate modules in parallel. Four needs interviews are logged (document 02); the sample is small and qualitative, so the problem statement also rests on the documentary evidence in document 02, section 2.1. Evaluation uses synthetic data only. The full risk register and the milestones are in document 10.

## References

The identifiers in brackets after each entry refer to the full source list in document 03.

[1] P. H. Lipkin and M. M. Macias, AAP Council on Children With Disabilities, "Promoting optimal development: Identifying infants and young children with developmental disorders through developmental surveillance and screening," *Pediatrics*, vol. 145, no. 1, Art. no. e20193449, 2020. (S3)

[2] A. Federico, D. Shi, and J. Bradshaw, "Agreement between parental report and clinician observation of infant developmental skills," *Front. Psychol.*, vol. 12, Art. no. 734341, 2021, doi: 10.3389/fpsyg.2021.734341. (S4)

[3] T. H. Toh *et al.*, "Case-control accuracy study for TOY8 digital developmental screening tool for detecting delays among children aged 3–5 years," *Front. Pediatr.*, vol. 13, Art. no. 1706162, 2025, doi: 10.3389/fped.2025.1706162. (S6)

[4] N. Anjum, M. M. Hasan, N. Jahan, S. I. Ahamed, A. Garefino, and N. Sakib, "Early digital engagement among younger children and the transformation of parenting in the digital age from an mHealth perspective: Scoping review," *JMIR Pediatr. Parent.*, vol. 8, Art. no. e60355, 2025, doi: 10.2196/60355. (S10)

[5] J. M. Zubler *et al.*, "Evidence-informed milestones for developmental surveillance tools," *Pediatrics*, vol. 149, no. 3, Art. no. e2021052138, 2022. (S1)

[6] Republic of Kazakhstan, Law No. 94-V "On personal data and their protection," 21 May 2013, with amendments. [Online]. Available: https://adilet.zan.kz/rus/docs/Z1300000094 (R13)

[7] Ministry of Health of the Republic of Kazakhstan, Order No. ҚР ДСМ-264/2020 on the rules, scope and frequency of preventive medical examinations of target groups, 15 December 2020. (R11)

[8] Ministry of Health of the Republic of Kazakhstan, Order No. 704 "On approval of the rules for organizing screening," 9 September 2010, with amendments. (R10)

[9] Ministry of Health of the Republic of Kazakhstan, Order No. ҚР ДСМ-25 "On approval of the standard for organizing pediatric care in the Republic of Kazakhstan," 15 March 2022. (R12)

[10] World Health Organization, *WHO Child Growth Standards: Methods and Development*. Geneva, Switzerland: WHO, 2006. (R1)