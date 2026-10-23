# 2. Evidence of Relevance

## Status

**Current status: user interviews completed.** Five semi-structured interviews were conducted with user representatives on October 24, 2026: four parents of children aged 1–5 and one kindergarten educator. The interviews provide evidence supporting the problem statement, user needs and several requirements.

The checklist requirement of **3 to 5 discussions with user representatives** has been met. Interview findings are documented in section 2.4, with detailed anonymized notes stored in [evidence/interview-notes.md](evidence/interview-notes.md).

The findings support several design assumptions, while other assumptions remain partially supported or unverified. The small sample is not statistically representative, and the application has not yet been validated through usability testing.

## 2.1 Evidence sources

| Source | Who | Purpose | Status |
|---|---|---|---|
| Semi-structured interviews | 4 parents of children aged 1 to 5 | How records are kept now, what is missing, consent and sharing expectations | Completed (P1–P4) |
| Interviews with specialists | 1 kindergarten educator | How observations are documented and handed over, what specialists would need | Completed (S1) |
| Discussion with the supervisor | Zhuldyz Basheyeva | Confirmation of the problem statement, the scope and the access rules | Partly done by the supervisor's justification; to be confirmed in writing |
| Review of existing practice | Observation of current forms and notebooks, with consent | Which fields are recorded and how often | Not started |

Recruitment and consent rules: participants are adults, take part voluntarily, can stop at any time and are told that no personal data will be published. Notes are stored without names. Participants are referred to by codes P1–P4 and S1.

## 2.2 Interview guide (parents)

1. Tell me about your child. How old are they now?
2. How do you currently note what your child can do (new words, motor skills, social behaviour)?
3. Where are these notes kept? Can you find a note from three months ago within a minute?
4. Has anyone else (a nursery teacher, a doctor, a relative) written about your child? How did you learn about it?
5. Would you want a specialist to see your notes? What would you want to control?
6. What worries you about storing these notes in an app?
7. What would make you stop using such an app?

The full interview guide, including questions about growth measurements and questions for specialists, is available in [evidence/00-interview-guide.md](evidence/00-interview-guide.md).

## 2.3 Assumption register

These are the claims the design currently depends on. Each one is assessed against the evidence collected in section 2.4.

| ID | Assumption | Depends on | Evidence status |
|---|---|---|---|
| A1 | Parents keep development notes in fragmented places (paper, phone, messages). | Problem statement | Supported by P1, P2, P3 and P4; records are distributed across clinic documents, phone notes and messages |
| A2 | Parents want control over which specialist can see their child's profile. | Access model (FR-ACC) | Supported by P1–P4; parents expressed preferences for selective sharing and permission-based access |
| A3 | Specialists want to write notes about a child they work with, and want those notes to be attached to the same child record. | Notes model (FR-NOTE) | Partly supported by S1; the educator expressed willingness to add attributed observations with parental permission |
| A4 | Parents accept a record-keeping tool that does not give a diagnosis. | Scope (no diagnosis) | Supported by P1–P4; parents accepted non-diagnostic suggestions to consult a pediatrician |
| A5 | Parents would use a web app on a phone (PWA) rather than a native app. | Client choice (ADR-004) | Unverified; P4 expressed a preference for convenient mobile access but did not establish a preference for PWA over native applications |
| A6 | Records of observations are sensitive personal data and must be protected with consent and access rules. | Security requirements | Supported by the legal references in document 03 (section 3.4) and privacy concerns raised by P1–P4 and S1; consent wording still requires review |

## 2.4 Interview log

Five semi-structured interviews were conducted on October 24, 2026. Participants are identified by codes, and no names or contact details are stored in the repository.

| Code | Role | Date | Format (in person / online) | Duration | Key findings | Confirms / rejects assumption |
|---|---|---|---|---|---|---|
| P1 | Parent, child aged 3 | 2026-10-24 | Online | ~12 min | Growth records are scattered between clinic documents and phone notes. Wants selective specialist access and simple data entry. | Supports A1, A2, A4, A6 |
| P2 | Parent, child aged 1 | 2026-10-24 | Online | ~10 min | Measurements and developmental observations are difficult to retrieve. Wants understandable charts, privacy and non-diagnostic guidance. | Supports A1, A2, A4, A6 |
| P3 | Parent, child aged 5 | 2026-10-24 | In person | ~15 min | Kindergarten feedback is distributed across reports and messages. Wants a history of observations and permission-based sharing. | Supports A1, A2, A4, A6 |
| P4 | Parent, child aged 2 | 2026-10-24 | Online | ~12 min | Prefers low-effort record keeping, selective access and cautious notifications. Mobile access matters, but PWA preference is unclear. | Supports A1, A2, A4, A6; A5 remains unverified |
| S1 | Kindergarten educator, children aged 3–5 | 2026-10-24 | Online | ~15 min | Shared histories may help provide context. Would add attributed observations with parental consent and verify information independently. | Partly supports A3; supports A6 |

Detailed interview responses are stored in [evidence/interview-notes.md](evidence/interview-notes.md).

## 2.5 Verified findings versus assumptions

The committee asks whether verified findings are distinguished from assumptions. The rule for this project:

- **Verified finding:** a statement supported by an actual interview log entry, an observation record or a cited source (document 03 and document 04).
- **Assumption:** a claim that has not yet been sufficiently confirmed by the collected evidence.

The interviews provide qualitative support for A1, A2 and A4. A3 is partially supported by one educator, while A5 remains unverified. A6 is supported by both legal references and participant concerns.

Requirements in document 06 should distinguish interview-supported needs from untested implementation choices. The collected evidence supports the need for structured records, selective access, specialist observations and non-diagnostic guidance, but does not establish that a PWA is preferable to a native application.

Further validation should include usability testing, review of consent wording and additional specialist feedback.