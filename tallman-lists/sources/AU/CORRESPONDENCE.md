# AU (ACSQHC) — Authority Correspondence

This file records direct correspondence with the Australian Commission on Safety and
Quality in Health Care (the Commission / ACSQHC) regarding interpretation of entries in
the National Mixed-Case Lettering List. It is a traceability record supporting the source
extract decisions in this directory.

---

## 2026 — Intent of all-lowercase entries (`fluoxetine`, `morphine`, `tretinoin`)

**Issue:** [#57](https://github.com/MattCordell/ToTallman/issues/57) — Investigate intent of
all-lowercase entries currently marked as comparators.

**Question put to the Commission:** For `fluoxetine`, `morphine` and `tretinoin`, are the
all-lowercase entries intentional always-lowercase mixed-case forms, or are they plain
LASA comparators documented for context only?

**Response from the Australian Commission on Safety and Quality in Health Care (verbatim):**

> Thank you for contacting the Australian Commission on Safety and Quality in Health Care
> (the Commission) and for your enquiry regarding the National Mixed-Case Lettering List.
>
> The entries you have identified – fluoxetine, morphine and tretinoin, are included as
> comparators within the look-alike, sound-alike (LASA) pairs. They provide context for the
> mixed-case lettering applied to the paired medicine names that have been identified as
> requiring differentiation.
>
> As you may be aware, the Commission's [National Mixed-Case Lettering List](https://www.safetyandquality.gov.au/publications-and-resources/resource-library/national-mixed-case-lettering-list)
> is not intended to be an exhaustive list of all LASA medicine names. Health service
> organisations may choose to apply 'mixed-case lettering' to additional medicine pairs,
> following endorsement through their local medicines governance processes.
>
> Further guidance on the principles for applying 'mixed-case' lettering, including risk
> assessment processes and application to locally identified LASA medicine names can be found
> in 'Mixed case lettering': Principles for application.
>
> I hope this is helpful. Please feel free to reach out should you have any further enquiries.

**Resolution:** Interpretation 1 (comparator) confirmed. `fluoxetine`, `morphine` and
`tretinoin` are LASA comparators provided for context only — the Commission has **not**
assigned a mixed-case (Tall Man) form to them. The current treatment is correct: these rows
retain the `comparator` flag in `20240400.0.csv` and are **excluded** from the built TML
output. Input forms of these drugs are returned unchanged by the runtime algorithm.
