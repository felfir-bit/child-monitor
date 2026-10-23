# ADR-006: Z-score computation

Status: accepted

## Context

Growth charts and signals G1 and G2 need z-scores and percentiles from the WHO Child Growth Standards for both sexes, from birth to 60 months.

## Decision

Compute z-scores in Go (`src/internal/anthro`) with the algorithm of WHO's R package `anthro`, using WHO's own table files from that package embedded in the binary with the tag `WHO-2006`:

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

`src/internal/anthro/testdata/who_reference.csv` holds 300 synthetic cases computed with a port of the `anthro` algorithm (`tests/reference/generate_who_fixture.py`); the Go results match within 0.01 (document 09, M8). `tests/reference/verify_with_who_anthro.R` checks the same cases against the real R package on a machine with R. The child profile stores sex (FR-CHILD-05).

See document 05, section 5.9.
