# 3. Literature Review

## 3.1 Scope and method

This review covers four questions that shape the system design:

1. How is child development monitored in practice, and what are the strengths and limits of standardized screening?
2. What is the evidence for digital tools that parents and clinicians use to record or screen development?
3. What is the evidence for mobile and digital apps that follow children's growth over time?
4. Which security and data-protection rules apply to records about young children?

**Method.** The sources were identified through web search (queries are listed in appendix A) and checked by fetching the publisher or repository page. Bibliographic details marked as *to confirm* were not visible in the pages that could be read and must be checked against the DOI or PubMed record before the final submission. This is a structured narrative review, not a systematic review. A systematic review would require a predefined protocol and database searches, which are listed as future work.

**Currency.** Rapidly changing topics (digital screening, mHealth) draw their core sources from 2020 to 2025. Older sources (2001, 2013, 2017) are kept only as foundations: the ASQ accuracy study, the Lancet series on early childhood development and the RBAC standard.

## 3.2 Scientific publications (9 sources)

| ID | Citation | Type | Verification status |
|---|---|---|---|
| S1 | Lipkin PH, Macias MM; Council on Children With Disabilities. *Promoting Optimal Development: Identifying Infants and Young Children With Developmental Disorders Through Developmental Surveillance and Screening.* Pediatrics. 2020;145(1):e20193449. | Clinical policy report (peer-reviewed journal) | Title, journal, volume and article number confirmed on the AAP-hosted version; author list *to confirm* |
| S2 | Black MM, Walker SP, Fernald LCH, et al. *Early childhood development coming of age: science through the life course.* Lancet. 2017;389(10064):77-90. | Lancet series paper | Title confirmed; journal details *to confirm* |
| S3 | Schonhaut L, Armijo I, Schönstedt M, Alvarez J, Cordero M. *Validity of the Ages and Stages Questionnaires in term and preterm infants.* Pediatrics. 2013;131(5):e1468-74. DOI 10.1542/peds.2012-3313. | Validation study, n=306 | Confirmed |
| S4 | *A parent-completed developmental questionnaire: follow up of ex-premature infants.* J Paediatr Child Health. 2001;37(2):125-9. DOI 10.1046/j.1440-1754.2001.00604.x | Validation study, n=136 | Title, journal, DOI confirmed; author list *to confirm* |
| S5 | Toh TH, Lim YM-F, Lee JS-Y, Chan W-N, Low Z-Y, Dahian K, Chew S-C, Sivasampu S, Law WK-B, Amar-Singh HSS. *Case-control accuracy study for TOY8 digital developmental screening tool for detecting delays among children aged 3-5 years.* Frontiers in Pediatrics. 2025;13. DOI 10.3389/fped.2025.1706162. | Case-control accuracy study, n=127 | Confirmed (first author and author list read from the article page) |
| S6 | Wo SW, Alagappar PN, Yahya AN, et al. *Validation of the English version of the TOY8 developmental screening tool: examining measurement invariance across languages, gender and income groups.* BMC Psychology. 2025;13:214. DOI 10.1186/s40359-025-02489-3. | Psychometric validation | Title, journal, article number and DOI confirmed; full author list *to confirm* |
| S7 | Anjum N, Hasan MM, Jahan N, Ahamed SI, Garefino A, Sakib N. *Early Digital Engagement Among Younger Children and the Transformation of Parenting in the Digital Age From an mHealth Perspective: Scoping Review.* JMIR Pediatrics and Parenting. 2025;8:e60355. DOI 10.2196/60355. | Scoping review, 36 included articles | Confirmed |
| S8 | Kustiawan TC, Nadhiroh SR, Ramli R, Butryee C. *Use of mobile app to monitoring growth outcome of children: A systematic literature review.* Digital Health. 2022;8. DOI 10.1177/20552076221138641. | Systematic literature review, 12 studies | Confirmed |
| S9 | Ferraiolo DF, Sandhu R, Gavrila S, Kuhn DR, Chandramouli R. *Proposed NIST Standard for Role-Based Access Control.* ACM Transactions on Information and System Security. 2001;4(3). | Standard proposal with reference model | Authors and journal confirmed; page range *to confirm* |

## 3.3 Standards, guidelines and legal sources (10 sources)

| ID | Source | Use in this project |
|---|---|---|
| N1 | CDC, *Learn the Signs. Act Early.* Developmental milestone checklists, https://cdc.gov/act-early/families/milestones-matter.html | Reference for which milestones parents are asked about; not a source of norms in version 1 |
| N2 | OWASP, *Password Storage Cheat Sheet*, https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html | Argon2id parameters (m = 19 MiB, t = 2, p = 1) for password hashing |
| N3 | IETF, *RFC 8725: JSON Web Token Best Current Practices*, https://www.rfc-editor.org/rfc/rfc8725 | Explicit algorithm validation, short token lifetime, no sensitive data in tokens |
| N4 | NIST, *SP 800-63B Digital Identity Guidelines*, https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63b.pdf | Password policy: length-based rules and no forced composition rules. Section reference *to confirm* by the students |
| N5 | GDPR, Article 8 (conditions for a child's consent), https://gdpr-text.com/read/article-8/ | Reference model for consent. The age threshold is 16 with parental consent below it (member states may set 13 to 16). Applied by analogy; the project is not subject to the GDPR |
| N6 | Law of the Republic of Kazakhstan No. 94-V (2013), *On personal data and their protection*, https://adilet.zan.kz/rus/docs/Z1300000094/z13094.htm | Applicable national framework for personal data. The article numbers for consent and special categories of data *to confirm* on the official text |
| N7 | MDN, *Making PWAs installable*, https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_Installable | Installability criteria for the web client: manifest with name, icons (192 and 512 px), start URL and display mode; HTTPS |
| N8 | Fiber documentation, *JWT middleware*, https://docs.gofiber.io/contrib/jwt | Token extraction from the Authorization header or a cookie, and key configuration |
| N9 | Go Blog, *Routing enhancements for Go 1.22*, https://go.dev/blog/routing-enhancements | Method-aware routing in the standard library, considered as an alternative in document 05 |
| N10 | gRPC project, *gRPC-Web protocol*, https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-WEB.md | Browsers do not expose HTTP/2 framing, so native gRPC cannot be called from the web client without a proxy |

**Totals:** 19 sources, of which 9 are scientific publications. The requirement (at least 12 meaningfully used sources, at least 8 scientific) is met. Each source is used in the analysis below.

## 3.4 Critical analysis

### Approaches to monitoring development

Clinical practice relies on two complementary mechanisms. S1 recommends **developmental surveillance** (asking about milestones and observing the child at every health visit) and **standardized screening** at defined ages, so that concerns are identified early. Surveillance is continuous but informal; screening is structured but occasional. Read together, the two mechanisms suggest that a single snapshot is weaker than repeated observation. This supports a design in which parents and specialists record observations over time rather than rely on a one-off assessment. The students must check the exact wording of S1 in the full text before quoting it.

The ASQ family of parent-completed questionnaires is the most studied tool of this kind. The accuracy figures show a clear trade-off:

- In ex-premature infants (S4, n=136), the ASQ reached 90% sensitivity and 77% specificity, but only 40% positive predictive value. Most positive screens were false alarms.
- In a Chilean cohort of term and preterm children (S3, n=306), ASQ-3 reached 75% sensitivity and 81% specificity, with modest agreement with the Bayley-III (r = 0.56). Accuracy improved with age.

**Implication for design.** A screening result from a parent questionnaire is not reliable enough to label a child. The system therefore records observations and makes their dynamics visible, but does not produce risk scores or diagnoses. Any interpretation is left to a specialist.

### Digital screening tools

S5 evaluated the TOY8 digital developmental screening tool in a case-control design against the Griffiths III scale (n=127, children aged 3-5 years). Sensitivity was 0.77 for any mild-to-moderate delay and 0.84 for severe delay; specificity was 0.67 and 0.65. S6 confirmed measurement invariance across language, gender and income groups for the English version. The authors of S5 note that the sample came from one region and that sensitivity was low for gross motor and personal-adaptive subscales.

**Implication for design.** Digital screening is feasible and increasingly validated, but accuracy for individual children remains moderate and sample-dependent. This is a further reason not to build automatic classification into version 1. A future module could import validated screening results, labeled as such, without implying diagnostic accuracy.

### Parents and mobile health tools

S7 is a scoping review of 36 articles on parents' early digital engagement and mHealth. It reports that parents often see digital tools as beneficial but cite a lack of tools and time to apply recommended interventions, and it proposes an app with tracking, parental guidance and activity suggestions. The implication for this project is that a record-keeping tool must be fast to use, because parents' time is the limiting factor.

S8 is a systematic review of 12 studies of mobile apps for growth monitoring. It reports improved growth outcomes in some settings and calls for larger, longer studies. The quality evidence is therefore limited. The implication is that apps are promising for tracking change over time, which is exactly the design choice of a dated observation history.

### Access control and security

S9 standardizes role-based access control (RBAC) with core roles, role hierarchies and separation-of-duty constraints. The project uses two roles (parent, specialist), which map to core RBAC. Access to a specific child, however, depends on an ownership relationship and an explicit grant. That is an object-level relationship, which the standard does not model directly. The project therefore combines RBAC roles with per-child grants and enforces both in one service layer. This is a deliberate extension and is documented as such in document 06.

For tokens, N3 recommends explicit algorithm validation (rejecting `none` and unexpected algorithms), short lifetimes and no sensitive data in claims. N8 shows the standard middleware pattern used in Fiber. For passwords, N2 recommends Argon2id as the first choice, with bcrypt only for legacy systems; the project uses Argon2id with the OWASP parameters. N4 supports a minimum length rule for user-chosen passwords without forced composition rules.

For legal framing, N5 sets the reference model for consent: below a threshold age the parent gives consent. Here the parent is the account holder and the person who consents, which fits the model. N6 is the applicable national law; the students must verify its consent and special-category provisions in the official text. Records of development are treated as sensitive, and the project never uses real children's data.

### Limitations of the evidence

- The sources are heterogeneous: clinical reports, small validation studies and reviews of apps of varying quality.
- Most accuracy figures come from settings outside Kazakhstan. They do not transfer directly to local populations.
- The commercial product sources (document 04) are vendor and store listings. They describe features, not verified performance.
- The search was not systematic. A reader should treat this review as a foundation and an overview, not a complete map of the field.

## 3.5 Analysis table

| ID | Year | Topic | Key result or statement | Consequence for the project |
|---|---|---|---|---|
| S1 | 2020 | Surveillance and screening | Surveillance at health visits plus standardized screening at defined ages | Record observations over time; no one-off labels |
| S2 | 2017 | Early development as a life-course issue | Early childhood development shapes later outcomes; the paper calls for science-based, life-course monitoring | Motivation and age range 0 to 5 |
| S3 | 2013 | ASQ-3 validity | Sensitivity 75%, specificity 81%, modest agreement with Bayley-III | Parent questionnaires are not reliable enough to diagnose |
| S4 | 2001 | ASQ in ex-premature infants | Sensitivity 90%, specificity 77%, PPV 40% | High false-positive rate; no automatic risk flags |
| S5 | 2025 | Digital screening accuracy (TOY8) | Sensitivity 0.77 to 0.84, specificity 0.65 to 0.67; weaker in some subscales | Digital tools need caution; future import only with labels |
| S6 | 2025 | Measurement invariance (TOY8 English version) | Invariance across language, gender and income groups reported | Validation across subgroups is needed before any clinical use |
| S7 | 2025 | Parents and mHealth | Parents cite lack of tools and time | Fast data entry and simple screens |
| S8 | 2022 | Growth monitoring apps | Improvements in some settings; evidence quality limited | Dated history is the core feature |
| S9 | 2001 | RBAC standard | Core roles and separation-of-duty constraints | Two roles plus per-child grants (documented extension) |
| N1 | current | CDC milestones | Age-based milestone checklists | Reference for milestone content |
| N2 | current | Password storage | Argon2id first, parameters given | Implemented in the auth module |
| N3 | 2020 | JWT best practice | Explicit alg, short lifetimes | Implemented in the token module |
| N4 | current | Digital identity | Password length rules, no forced composition | Password policy FR-AUTH-02 |
| N5 | 2016 | GDPR Article 8 | Age 16 threshold; parental consent below | Consent model by analogy |
| N6 | 2013 | Kazakhstan personal data law | Applicable framework for personal data | Compliance checklist in document 09 |
| N7 | current | PWA installability | Manifest, icons, HTTPS | Client requirements in document 08 |
| N8 | current | Fiber JWT middleware | Token extraction and key configuration | Used with a custom claims check |
| N9 | 2024 | Go routing | Method-aware patterns in the standard library | Alternative in document 05 |
| N10 | current | gRPC-Web | Browsers cannot expose HTTP/2 framing | Reason for REST over gRPC for the web client |

## 3.6 Gaps and how the project responds

1. **No tool in the reviewed sources combines** parent-recorded observations, per-child access for professionals and dated history in one system for children aged 0 to 5. Document 04 confirms this gap for the commercial products.
2. **Accuracy is moderate** for every screening tool reviewed. The project does not claim diagnostic accuracy and labels its output as records.
3. **Evidence on parent-facing apps is limited** (S7, S8). The project will evaluate usability and access correctness with a small study (document 09) rather than claim clinical benefit.

## Appendix A. Search queries used

- Lipkin Macias 2020 Pediatrics developmental surveillance and screening clinical report
- Ages and Stages Questionnaire parent-completed validity sensitivity specificity
- mobile app child development monitoring parents systematic review
- Black 2017 Lancet early childhood development coming of age series
- digital developmental screening tool parents smartphone validation children 0-5
- TOY8 digital developmental screening tool case-control accuracy
- Use of mobile app to monitoring growth outcome of children systematic review
- Early Digital Engagement Among Younger Children scoping review mHealth
- Ferraiolo Kuhn 1992 role-based access control NIST model
- Password storage OWASP cheat sheet; NIST SP 800-63B; RFC 8725
- GDPR Article 8 conditions for children's consent
- Kazakhstan Law 94-V personal data
- gRPC-Web browser limitations; Go 1.22 ServeMux routing; TimescaleDB documentation
