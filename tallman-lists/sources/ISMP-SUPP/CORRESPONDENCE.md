# ISMP — Authority Correspondence

This file records direct correspondence with the Institute for Safe Medication Practices
(ISMP) regarding interpretation of entries in the ISMP List of Look-Alike Drug Names. It is
a traceability record supporting the source extract decisions in this directory.

---

## 2026 — Intent of all-lowercase entries (`leucovorin`, `morphine`, `penicillin`, `tretinoin`)

**Issue:** [#57](https://github.com/MattCordell/ToTallman/issues/57) — Investigate intent of
all-lowercase entries currently marked as comparators.

**Question put to ISMP:** For `leucovorin`, `morphine`, `penicillin` and `tretinoin`, are the
all-lowercase entries intentional always-lowercase Tall Man forms, or are they plain LASA
comparators documented for context only?

**Response from ISMP (verbatim):**

> Thank you for reaching out. And, thank you for trying to operationalize tall man lettering
> in electronic systems.
>
> We use and encourage the use of the letter casing as you see in the list. For the names
> that are in all lower case, we do not have a tall men recommendation. For example, we
> deliberately do not use tall man lettering for morphine as there really are no good options
> to highlight difference between morphine and the "-morphone" part of HYDROmorphone as they
> are almost identical. We rely on the distinctive "HYDRO-" part of HYDROmorphone while keeping
> morphine all lower case. Tretinoin is another good example of this with tretinoin fully
> contained within ISOtretinoin.
>
> I hope this helps. Please let me know if you have any other questions.

**Resolution:** Interpretation 1 (comparator) confirmed. For the all-lowercase entries
(`leucovorin`, `morphine`, `penicillin`, `tretinoin`), ISMP has **no Tall Man recommendation** —
they deliberately keep these names lowercase and rely on the distinctive capitalised portion
of the *paired* name (e.g. the `HYDRO-` of HYDROmorphone, the `ISO-` of ISOtretinoin) to
create contrast. The current treatment is correct: these rows retain the `comparator` flag in
`20230100.0.csv` and are **excluded** from the built TML output. Input forms of these drugs are
returned unchanged by the runtime algorithm.

**Note on licensing:** ISMP also affirmed they "use and encourage the use of the letter casing
as you see in the list." See `meta.json` `licence_notes` for redistribution constraints on the
ISMP source document itself.
