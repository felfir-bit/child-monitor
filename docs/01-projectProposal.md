# Project Proposal

## I. Project Title

****Development of a Digital System for Monitoring Child Development****

Working name: ****Child Development Monitor****

## II. Project Team and Supervision

The project is carried out by students of group SE-2410, Astana IT University. Responsibilities are distributed by technical area, as shown in Table I. The distribution follows the supervisor's justification document.

****TABLE I. Team Members and Responsibilities****

| Member | Area | Responsibilities |

| --- | --- | --- |

| Zhan Erkebulan (Жан Еркебулан Еркебуланулы) | Backend | Authentication and roles, child profiles, access control, specialist notes, API documentation, containerization and monitoring; project management |

| Tassimov Arsen (Тасимов Арсен Малекович) | Backend — indicators and analytics | Development indicators, observation history, dynamics analytics, notifications; testing and integration of these modules |

The web client is built by both students, split by screens. The literature review, the comparisons, the requirements, the diagrams, the prototype and the evaluation are shared work.

****Supervisor:**** Zhuldyz Basheyeva (Башеева Жулдыз), Astana IT University.

## III. Background and Problem Statement

### A. Context

The first five years of life matter for later health, learning and behaviour [2]. Pediatric guidance recommends that doctors ask about development at every health visit and also run a standardized screening at fixed ages [1]. We read this as a case for repeated observation over time. A single check says little about how a child is changing.

In everyday life this information ends up in many places. Parents write things in a notebook, take photos, send messages to a partner or just remember. A kindergarten teacher or a psychologist who works with the same child keeps their own notes. Nobody holds the whole picture, and a parent often learns what a specialist saw only if the specialist tells them in person.

### B. Limitations of Current Tools

Screening questionnaires filled in by parents are the most studied digital-friendly tool, and their accuracy is moderate. In a Chilean cohort of 306 term and preterm children, ASQ-3 reached 75% sensitivity and 81% specificity against the Bayley-III [3]. A recent case-control study of the TOY8 digital screening tool in 127 children aged 3 to 5 reported sensitivity of 0.77 to 0.84 and specificity of 0.65 to 0.67 [4]. Results like these are not good enough to put a label on an individual child. For that reason the system we build records observations and shows how they change, and it leaves interpretation to a specialist.

We compared five existing systems using public documentation: CDC Milestone Tracker, Kinedu, Baby Connect, ASQ Online with ASQ Family Access, and Damumed (document 04). These systems address different aspects of developmental tracking, screening, clinical records or information sharing. The comparison did not establish that any single reviewed system combines WHO-based growth records, CDC/WHO developmental observations, parent-controlled per-child specialist access and attributed specialist notes in the manner proposed here. Feature claims are limited to publicly available evidence; the systems have not been comprehensively evaluated through hands-on testing.

Time is another constraint. A scoping review of parents' use of digital tools reports that parents see them as useful but often lack the time to apply recommendations [5]. A record-keeping tool therefore has to be quick to use, otherwise it will not be used.

### C. Problem Statement

Parents and specialists who work with the same young child often lack a unified, structured record. Observations are scattered, they cannot easily be compared over months, and the parent has no simple way to decide which specialist sees what. The tools that exist either screen the child with questionnaires of moderate accuracy or let a parent keep a private log, but they do not combine a parent-controlled record with specialist contributions.

### D. Working Assumptions

The initial assumptions were assessed through five semi-structured interviews conducted on 24 October 2026 with four parents and one kindergarten educator (document 02). The interviews provide qualitative support for several needs, but do not establish population-wide preferences or validate the implemented system. The statuses below summarize the evidence; detailed participant-level findings are in document 02.

1. Parents keep child growth and developmental information across several unconnected sources (supported by P1–P4).

2. Parents want to decide which specialist can see their child's profile (supported by P1–P4).

3. Specialists want to write attributed notes attached to the same child record (partially supported by S1).

4. Parents accept a record-keeping tool that provides non-diagnostic guidance (supported by P1–P4).

5. Parents prefer a progressive web application over a native mobile app (unverified; mobile convenience was mentioned by P4).

Records of a child's development are personal data. The Kazakhstan law on personal data [6] applies, so access control and consent are part of the design from the start. The specific consent obligations and data categories must be checked against the official legal text before implementation and deployment.

## IV. Target Users

The first group is parents of children aged 0 to 5. They create a child profile, decide which specialists may see it, and read what specialists have written. The second group is specialists such as kindergarten teachers, educators and psychologists. A specialist sees only the children whose parent has given access, and can add notes about them.

The system is not a medical device. It does not diagnose, score or classify a child.

## V. Aim

The aim of the project is to build a secure digital system that keeps one development record for each child aged 0 to 5, lets the parent control who has access to it, and lets authorized specialists add notes and follow how the child's indicators change over time.

## VI. Objectives

The objectives and their completion criteria are listed in Table II. The numerical thresholds are set in the verification and evaluation plan (document 09).

****TABLE II. Project Objectives and Completion Criteria****

| # | Objective | Completion criterion |

| --- | --- | --- |

| O1 | Specify requirements for parents, specialists and the system | Document 06 lists functional and non-functional requirements with priorities (P0, P1, P2) and an acceptance criterion for each |

| O2 | Design an access model with two roles (parent, specialist) and per-child grants | All 34 rows of the authorization matrix in document 09 return the expected status in automated tests |

| O3 | Implement the backend for authentication, child profiles, access control and specialist notes | The API is documented in OpenAPI; unit, HTTP and PostgreSQL integration tests pass; service-layer test coverage is at least 70% |

| O4 | Implement indicator recording, observation history, dynamics analytics and notifications (second student) | The modules work through the same API and the same access rules; tests pass |

| O5 | Evaluate data-access correctness and usability on synthetic data | Report with at least five usability sessions, compared with the participants' current way of keeping notes; at least 80% unaided task success |

## VII. Expected Outcomes

The project is expected to deliver the following:

1. A Git repository that shows the analysis, design, planning and supervision of the project, including commits and reviews from both students.

2. A backend with a documented REST API (Swagger UI at \`/docs\`) and an automated test suite.

3. Editable diagrams and their rendered exports.

4. A clickable prototype of the main screens for parents and specialists.

5. An evaluation report based on synthetic data and a small usability study.

6. The second student's modules for indicators, history and analytics, integrated with the same API.

## VIII. Scope

### A. Inclusions

The project covers registration and login for parents and specialists with email and password, and JWT-based sessions. A parent can create profiles for children aged 0 to 5 and give a specialist access to a single child by email. The parent can revoke that access at any time, and it stops with the next request. A specialist with access can read the child's profile and write notes. Only the author of a note can edit or delete it. The parent can read all notes but cannot change them.

The second student's part adds indicators, observation history, dynamics analytics and notifications on top of the same access rules.

The first pre-defense submission covers user research, literature and system comparisons, technology selection, requirements, architecture and editable diagrams, a clickable UX prototype, a verification plan, and project management evidence. The full backend implementation, integration tests, containerization and monitoring dashboards are outside the scope of this submitted milestone and belong to subsequent development stages.

### B. Exclusions

The following are excluded from the scope of the project:

1. ****Medical diagnosis, risk scoring and automatic classification of a child's development.**** The system records observations and shows how they change. Parent questionnaires and digital screening tools have only moderate accuracy [3], [4], so a label for an individual child would not be justified.

2. ****Native mobile applications and app store publication.**** The client is planned as a React progressive web app.

3. ****Integration with clinics, kindergartens or government information systems.****

4. ****Clinical validation of developmental norms.**** A comparison with age norms is possible only with cited sources and an explicit disclaimer.

5. ****Refresh tokens, two-factor authentication and organizations with several tenants.**** These are listed as future work.

6. ****Production hosting and real users.**** The evaluation uses synthetic data only, and no real child's record is stored.

## IX. Engineering Complexity

The engineering complexity of the project arises from the integration of several technically demanding components:

1. ****A two-level access model.**** Access to a child depends on the user's role and on ownership or an active grant, which is checked on every request, so that a revoked grant stops working immediately.

2. ****Sensitive data about young children.**** Development records of minors are personal data [6], which requires secure password storage, token validation, data minimization and an age rule for the child.

3. ****Rules enforced in the database.**** Foreign keys, cascading deletes and a unique index on active grants keep ownership and access consistent, and the same scenarios must pass on the in-memory and on the PostgreSQL store.

4. ****Observation history as time-dependent data.**** Indicator values are stored with their revisions, ordered by date, and used to calculate change and trend, which must be presented as a record and not as a diagnosis.

5. ****Notifications on shared records.**** A new note or observation has to reach every user with access to the child except its author, while the delivery channel is still undecided.

6. ****Two modules in one system.**** Two separately developed modules share one API, one database and one access policy, so the contract between them must be explicit.

7. ****Verification of access and usability.**** Access rules are checked by an authorization matrix of 34 defined cases, and usability is measured against a baseline of current note-keeping practice.

## X. Constraints and Risks

The deadline for the first pre-defense is 24 October 2026. The team has two students who work on separate modules in parallel. Five user interviews have been completed (document 02), providing preliminary qualitative evidence for the problem statement. The sample is small, specialist feedback is limited to one educator, and usability testing is still planned; the PWA preference also remains unverified. The full risk register and the milestones are in document 10.

## References

[1] P. H. Lipkin and M. M. Macias, Council on Children With Disabilities, "Promoting optimal development: Identifying infants and young children with developmental disorders through developmental surveillance and screening," **Pediatrics**, vol. 145, no. 1, Art. no. e20193449, 2020.

[2] M. M. Black **et al.**, "Early childhood development coming of age: Science through the life course," **Lancet**, vol. 389, no. 10064, pp. 77–90, 2017.

[3] L. Schonhaut, I. Armijo, M. Schönstedt, J. Alvarez, and M. Cordero, "Validity of the Ages and Stages Questionnaires in term and preterm infants," **Pediatrics**, vol. 131, no. 5, pp. e1468–e1474, 2013, doi: 10.1542/peds.2012-3313.

[4] T. H. Toh **et al.**, "Case-control accuracy study for TOY8 digital developmental screening tool for detecting delays among children aged 3–5 years," **Front. Pediatr.**, vol. 13, 2025, doi: 10.3389/fped.2025.1706162.

[5] N. Anjum, M. M. Hasan, N. Jahan, S. I. Ahamed, A. Garefino, and N. Sakib, "Early digital engagement among younger children and the transformation of parenting in the digital age from an mHealth perspective: Scoping review," **JMIR Pediatr. Parent.**, vol. 8, Art. no. e60355, 2025, doi: 10.2196/60355.

[6] Republic of Kazakhstan, Law No. 94-V "On personal data and their protection," 2013. [Online]. Available: https://adilet.zan.kz/rus/docs/Z1300000094/z13094.html