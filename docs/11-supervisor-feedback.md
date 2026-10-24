# 11. Supervisor Feedback

**Project:** Development of a Digital System for Monitoring Child Development  
**Supervisor:** Zhuldyz Basheyeva (Башеева Жулдыз), Astana IT University  
**Stage:** Pre-defense 1 — 24 October 2026  
**Status:** Supervisor feedback received; action tracking in progress

## 11.1 Supervisor evaluation

| Item | Supervisor’s comment |
|---|---|
| Problem and relevance | The project addresses the fragmentation of child growth and development records between family and specialists. The documented interviews with three parents and one pediatrician provide initial evidence. Additional feedback from a speech therapist or teacher would strengthen the needs analysis. |
| Project scope and engineering complexity | The proposed parent-controlled child record, reference-based growth monitoring, milestone checklists, specialist notes and access management form a coherent software engineering scope. Prioritize a demonstrable end-to-end MVP and keep diagnostic functions explicitly outside the scope. |
| Literature review and existing systems | The literature review and comparison of five systems provide a foundation for the proposed solution. Clearly distinguish documented product capabilities from assumptions and retain citations for reference standards and limitations. |
| Requirements specification | The requirements cover child profiles, access control, measurements, milestones, specialist observations and notifications. Verify that each mandatory requirement has a measurable acceptance criterion, including access revocation and non-diagnostic signal wording. |
| Architecture and diagrams | The repository includes system context, use case, container, component, data-model, sequence and activity diagrams. Review consistency between these diagrams, the requirement identifiers and the planned API boundaries before implementation. |
| Technology choice | Go/Fiber, PostgreSQL, React PWA, REST/OpenAPI and Docker Compose are documented as the proposed stack, with architecture decision records. The next stage should validate integration and security assumptions in a small working vertical slice. |
| UX and prototype | A clickable prototype covers scenarios SC1–SC6. Extend the prototype to growth charts, milestone checklists, signals and reminders (SC7–SC10), and check whether parents can understand reference-based signals without interpreting them as diagnoses. |
| Verification and evaluation | The verification plan should demonstrate calculation correctness, role-based access, consent withdrawal, usability and comparison against the baseline workflow. Agree with the supervisor on participant numbers, thresholds and authoritative reference datasets. |
| Project management and risks | The repository records team responsibilities, YouTrack-based tasks, milestone planning and project risks. Maintain separate task branches, peer-reviewed pull requests and evidence of individual contributions. Implementation and automated tests remain future work at this stage. |
| Data protection and clinical boundaries | Because the system concerns children, review consent wording, data residency, retention and specialist permissions before using real information. Continue using demonstration data; growth and milestone signals must remain informational and must not present diagnoses. |

## 11.2 Supervisor decision

**Decision recorded from the reported consultation: Approved with changes.** The analysis and design deliverables demonstrate a relevant engineering problem and a coherent implementation plan. Progression to MVP implementation is recommended, conditional on prioritizing consent and authorization, validating medical reference rules with qualified reviewers, and providing an integrated end-to-end demonstration. The written decision should be verified with the supervisor before formal submission.

## 11.3 Questions and follow-up recommendations

| Topic | Question | Document | Follow-up recommendation |
|---|---|---|---|
| Monitoring scope | Is growth, milestones, notes, and non-diagnostic signals the appropriate diploma scope? | 00 | Keep growth, milestones, notes and informational signals within scope; explicitly exclude diagnosis, treatment recommendations and clinical validation. |
| Consent | Is registration consent wording sufficient under Law No. 94-V, and who should review it? | 06, FR-AUTH-06 | Require review by a qualified Kazakhstan data-protection/legal adviser before real-data collection; record consent purpose, withdrawal and access audit requirements. |
| Citation style | Should the project use IEEE or another required citation style? | 01, 03 | Use IEEE consistently unless the department publishes another mandatory format; confirm with the supervisor. |
| Notifications | Is the in-app notification approach acceptable for version 1? | ADR-007 | Accept in-app notifications for MVP, provided the user can view them reliably and the limitations of delivery are documented. |
| Usability evaluation | Is a sample of five participants acceptable? | 09 | Five participants can be an initial formative usability sample, not proof of broad usability; record recruitment, tasks and limitations. |
| Corrected age | Should corrected age be used until 24 months? | 00, FR-CHILD-06 | Use corrected age for eligible preterm children up to 24 months only after confirming the chosen clinical reference and documenting the calculation. |
| Growth thresholds | Is ±2 SD appropriate for head circumference, weight, and length? | 00, FR-SIG-01 | Do not approve ±2 SD uniformly without validation; specify reference-specific age, sex, measurement and interpretation rules and expert review. |
| Milestone standards | Should Order No. 704 national scales be used instead of or alongside CDC checklists? | 05, ADR-005 | Compare Kazakhstan Order No. 704 requirements with CDC checklists and document the selection; obtain expert approval before treating either as authoritative for the product. |
| Localization | Who can review Russian and Kazakh milestone wording? | NFR-REF-02 | Arrange review by qualified Russian- and Kazakh-speaking child-development professionals and maintain approved translations with version tracking. |
| Interviews | Are three parent interviews and one pediatrician interview sufficient, or is another specialist needed? | 02 | Four interviews are useful preliminary evidence; add at least one speech therapist or educator if feasible and distinguish interview evidence from assumptions. |
| Signal wording | Should the pediatrician-consultation wording suggested by SP1 be adopted? | 00 | Prefer non-alarming informational language such as “Recommended to consult your pediatrician at the next planned visit” only after clinical and usability review; define urgent exceptions separately if applicable. |

## 11.4 Feedback log

| No. | Date | Source | Document | Comment (summary) | Decision | Task | Status |
|---|---|---|---|---|---|---|---|
| 1 | 23.10.2026 | Supervisor consultation  | 00, 02 | Strengthen evidence of relevance with an additional speech therapist or educator interview. | Recommend additional interview | DIP-2 | Open |
| 2 | 23.10.2026 | Supervisor consultation  | 00, 06 | Prioritize the core MVP and explicitly exclude diagnostic functionality. | Confirm MVP boundaries | DIP-1 / DIP-6 | Done |
| 3 | 23.10.2026 | Supervisor consultation  | 03, 04 | Link research conclusions and existing-system comparisons to verifiable sources. | Improve evidence traceability | DIP-3 / DIP-4 | Open |
| 4 | 23.10.2026 | Supervisor consultation  | 06 | Add measurable acceptance criteria for access revocation and non-diagnostic signals. | Refine mandatory requirements | DIP-6 | In progress |
| 5 | 23.10.2026 | Supervisor consultation  | 07, 08 | Check consistency between diagrams, requirements, data model and API boundaries. | Review architecture | DIP-7 | Open |
| 6 | 23.10.2026 | Supervisor consultation | 05, ADRs | Validate frontend–backend–database integration and security assumptions in a working vertical slice. | Plan integration proof | DIP-5 | Open |
| 7 | 23.10.2026 | Supervisor consultation | 10 | Extend prototype to SC7–SC10 and assess parent comprehension of signals. | Extend prototype | DIP-8 | Open |
| 8 | 23.10.2026 | Supervisor consultation  | 09 | Specify calculation, authorization and consent-withdrawal tests; confirm usability sample. | Refine evaluation plan | DIP-9 | In progress |
| 9 | 23.10.2026 | Supervisor consultation  | 00, 06, 09 | Confirm growth reference datasets, corrected-age limit, signal thresholds and localization review. | Seek domain validation | DIP-6 / DIP-9 | Open |
| 10 | 23.10.2026 | Supervisor consultation  | 11, YouTrack | Use task branches and peer-reviewed pull requests; keep individual contributions traceable. | Maintain review evidence | DIP-10 / DIP-11 | In progress |


**Evidence for statuses:**

- **#1 — Open:** Four interviews documented; additional specialist interview not evidenced.
- **#2 — Done:** Non-diagnostic scope and MVP boundaries documented in 00 and 06; implementation remains pending.
- **#3 — Open:** Literature and comparison documents exist; requested traceability revisions not evidenced.
- **#4 — In progress:** Acceptance criteria are documented in 06; additional review and test execution remain pending.
- **#5 — Open:** Diagrams and editable sources exist; completed cross-document consistency review not evidenced.
- **#6 — Open:** Technology choices and ADRs documented; no integrated application in the supplied archive.
- **#7 — Open:** SC1–SC6 prototype exists; SC7–SC10 remain placeholders.
- **#8 — In progress:** Verification plan specifies tests and five-person usability study; tests have not been implemented.
- **#9 — Open:** Reference rules documented, but independent clinical/legal/language validation not evidenced.
- **#10 — In progress:** Project tracking is documented; branch, PR and reviewer history cannot be verified from ZIP.

**Status assessment (24.10.2026):** Based on the submitted project archive. “Done” means the specific documentation change is present, not that the software is implemented or the supervisor signed off. “In progress” means the deliverable exists but the requested review, verification or implementation remains incomplete. Git/YouTrack activity outside the ZIP was not independently verified.

**Feedback source:** The team reports that the supervisor communicated these comments during a consultation. The consultation took place on 23 October 2026; written confirmation has not yet been provided. Statuses describe follow-up work, not supervisor approval of implementation.

**Status values:** Open, In progress, Done, Not accepted (with a reason).

## 11.5 Checkpoints

| Checkpoint | What is reviewed | Date |
|---|---|---|
| Weekly meeting | Progress against YouTrack tasks and open questions | Weekly |
| Before pre-defense 1 | Documents 00–12, prototype, verification plan | Before 24 October 2026 |
| After pre-defense 1 | Committee remarks from document 12, section 12.6 | After 24 October 2026 |
| M2, M3, M4 | Demonstration of each student’s modules | Agreed with supervisor |

## 11.6 Confirmation

**Supervisor:** Zhuldyz Basheyeva  
**Final decision:** Approved with changes (reported by team; written confirmation pending)  
**Consultation date:** 23.10.2026  
**Comments or corrections:** 24.10.2026  
**Supervisor confirmation:** Pending written confirmation
