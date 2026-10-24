# ADR-006: Z-score computation

Status: accepted

## Context

Growth charts and signals G1 and G2 need z-scores and percentiles from the WHO Child Growth Standards for both sexes, from birth to 60 months.

## Decision

Compute z-scores in Go (planned package `src/internal/anthro`, milestone M3) with the algorithm of WHO's R package `anthro`, using WHO's own table files from that package embedded in the binary with the tag `WHO-2006`:

- tables by day of age for weight-for-age, length/height-for-age, BMI-for-age and head circumference-for-age, and by 0.1 cm for weight-for-length (45 to 110 cm) and weight-for-height (65 to 120 cm), with linear interpolation;
- length measured standing before 731 days gets +0.7 cm, length measured lying from 731 days gets −0.7 cm;
- z = ((value / M)^L − 1) / (L × S); for weight-based indicators beyond ±3 SD the WHO extension using the distance between the 2 SD and 3 SD values;
- WHO's flags for implausible values (used by signal G2);
- z rounded to two decimals, percentile = 100 × Φ(z).

Compute on read, not on write.

## Alternatives

- Load the tables into PostgreSQL: adds a database dependency to a pure calculation and a migration for every table change.
- Call WHO's R package `anthro` from a separate service: correct by definition; adds an R runtime and a network call.
- Precomputed percentile curves only: no exact z-score for signals.

## Consequences

At milestone M3 a test fixture of at least 200 synthetic cases will be generated with a port of the `anthro` algorithm and checked against the R package itself; the Go results must match within 0.01 (document 09, metric M8). The planned fixture location is `src/internal/anthro/testdata/`. The calculation depends on the child's sex (FR-CHILD-05).

See document 05, section 5.9.
