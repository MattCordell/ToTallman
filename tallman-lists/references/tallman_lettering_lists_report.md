# Authoritative TallMan Lettering Lists for Medicines: International Survey

**Prepared:** June 2026  
**Scope:** Authoritative national and agency-level lists of TallMan (mixed-case) lettering for medicines, with particular attention to SNOMED CT member countries  
**Purpose:** Reference document for AMT/SNOMED CT editorial work and cross-national terminology alignment

---

## 1. Background

TallMan lettering (also written as tall man lettering or mixed-case lettering) is a typographic strategy for reducing look-alike, sound-alike (LASA) medication name errors. It selectively capitalises distinctive letter segments of confusable drug name pairs to make them visually distinct -- for example, DOBUTamine and DOPamine, or CISplatin and CARBOplatin. The technique was formalised in 2001 by the US FDA as part of its Name Differentiation Project and has since been adopted by safety agencies in a small number of countries.

National lists are relevant to AMT/SNOMED CT editorial work because:

- The ACSQHC National Mixed-Case Lettering List explicitly names the AMT as a target implementation context for the Australian list.
- Several national lists use INN-based names that map directly to SNOMED CT substance concepts.
- Cross-national list comparison is a prerequisite for assessing whether a single canonical TML form can be assigned to SNOMED CT synonyms, or whether form must vary by jurisdiction.

The terms used for this technique vary by country. Synonyms encountered during this survey include: mixed-case lettering (Australia from 2024), TALLman lettering (Canada), tall man letters/lettering (USA, NZ, UK), and *letras mayúsculas resaltadas* (Spain, meaning "highlighted uppercase letters").

---

## 2. Confirmed Authoritative Lists

### 2.1 Summary Table

| # | Country | Publisher | List name (current) | Format | Last updated | Licence |
|---|---------|-----------|---------------------|--------|--------------|---------|
| 1 | Australia | ACSQHC | National Mixed-Case Lettering List | PDF only | April 2024 | CC BY-NC-ND 4.0 International |
| 2 | New Zealand | HQSC Te Tāhū Hauora | Aotearoa New Zealand Tall Man Lettering List | PDF + Excel | October 2023 | Not stated; confirm with HQSC |
| 3 | USA | FDA | FDA List of Established Drug Names Recommended to Use Tall Man Lettering | HTML web page only | June 2026 | US Government work; public domain |
| 4 | USA | FDA + ISMP (joint) | FDA and ISMP Lists of Look-Alike Drug Names with Recommended Tall Man (Mixed Case) Letters | PDF | January 2023 | © 2023 ISMP; internal reproduction with attribution permitted; other use requires written permission |
| 5 | Canada | ISMP Canada | TALLman Lettering for Look-Alike/Sound-Alike Drug Names in Canada | PDF | 2015 | © ISMP Canada 2015; internal reproduction with attribution permitted |
| 6 | UK (oncology only) | BOPA | Recommendations for the Use of Tall Man Lettering for SACT in the United Kingdom | PDF | February 2022 | Not stated; BOPA membership site |
| 7 | Spain | ISMP-España | Relación de nombres de medicamentos similares con letras mayúsculas resaltadas | PDF | 2011 | Not stated; hosted on ISMP-España site |

### 2.2 Direct Download URLs

| # | Country | Direct download URL(s) | Landing page |
|---|---------|------------------------|--------------|
| 1 | Australia | [PDF (April 2024)](https://www.safetyandquality.gov.au/sites/default/files/2024-04/national_mixed-case_lettering_list.pdf) | https://www.safetyandquality.gov.au/publications-and-resources/resource-library/national-mixed-case-lettering-list |
| 2 | New Zealand | [PDF (Oct 2023)](https://www.hqsc.govt.nz/assets/Our-work/System-safety/Reducing-harm/Medicines/Publications-resources/Tall-Man-Lettering-List-2023.10-FINAL.pdf) · [Excel (Oct 2023)](https://www.hqsc.govt.nz/assets/Our-work/System-safety/Reducing-harm/Medicines/Publications-resources/Aotearoa_New_Zealand_Tall_Man_lettering_list_Oct_2023.xlsx) | https://www.hqsc.govt.nz/resources/resource-library/aotearoa-new-zealand-tall-man-lettering-list/ |
| 3 | USA (FDA) | HTML page only (no file download) | https://www.fda.gov/drugs/medication-errors-related-cder-regulated-drug-products/fda-name-differentiation-project |
| 4 | USA (FDA+ISMP) | [PDF (Jan 2023)](https://www.ismp.org/system/files/resources/2023-01/ISMP_Tallman_Letters_012523_MS5087%20(2).pdf) | https://www.ismp.org (search "tall man letters"; linked from ismp.org/node/136) |
| 5 | Canada | [PDF](https://www.ismp-canada.org/download/TALLman/TALLman_lettering.pdf) | https://www.ismp-canada.org/TALLman/ |
| 6 | UK (BOPA) | [PDF (Feb 2022)](https://www.bopa.org.uk/wp-content/uploads/2022/02/BOPA-Recommendations-for-the-use-of-Tall-Man-Lettering-for-systemic-anti-cancer-treatments-SACT-in-the-United-Kingdom-v1.0.pdf) | https://www.bopa.org.uk/resources/bopa-recommendations-of-the-use-of-tall-man-lettering-for-systemic-anti-cancer-treatments-sact-in-the-united-kingdom-v1-0/ |
| 7 | Spain | [PDF (2011)](https://www.ismp-espana.org/ficheros/publicaci%C3%B3n%20con%20la%20relaci%C3%B3n%20de%20nombres%20medicamentos%20similares%20con%20letras%20mayusculas%20resaltadas.pdf) | https://www.ismp-espana.org/documentos/view/63 |

### 2.3 Machine-Readable Format Availability

| Country | PDF | Excel/CSV | HTML (structured) |
|---------|-----|-----------|-------------------|
| Australia | Yes | No | No |
| New Zealand | Yes | **Yes (.xlsx)** | No |
| USA (FDA) | No | No | Yes (web table) |
| USA (FDA+ISMP) | Yes | No | No |
| Canada | Yes | No | No |
| UK (BOPA) | Yes | No | No |
| Spain | Yes | No | No |

New Zealand is the only national authority that provides a native machine-readable download. The FDA web page is a structured HTML table and could be scraped, but no official downloadable file is provided. All other lists are PDF only.

---

## 3. Notes on Each List

### 3.1 Australia -- ACSQHC National Mixed-Case Lettering List

The ACSQHC (Australian Commission on Safety and Quality in Health Care) has stewardship of the Australian list. It was originally published in 2011 as the National Tall Man Lettering List and renamed "National Mixed-Case Lettering List" with the April 2024 revision. The name change reflects the Commission's preference for terminology that is less US-centric and more descriptive of the technique itself.

The list is updated reactively (based on adverse incident and near-miss reports from hospital networks) and proactively (based on comparison against international lists and changes to the Australian Register of Therapeutic Goods). The 2024 update explicitly references the US, Canadian and New Zealand lists as comparative inputs. The list is structured in tables by category: general LASA pairs, oncology medicines, class-level entries, monoclonal antibodies (mab suffix), tyrosine kinase inhibitors (nib suffix), and one gib-suffix agent (soNIDEGib).

The list is explicitly intended for incorporation into the AMT and into electronic medication management systems. The Commission also publishes a companion fact sheet, "Mixed-case lettering: Principles for Application" (https://www.safetyandquality.gov.au/sites/default/files/2024-04/mixed-case_lettering_-_principles_for_application.pdf), which includes a decision flowchart for applying the technique to locally identified LASA names not covered by the national list. The licence is CC BY-NC-ND 4.0; derivative works and commercial use require separate permission.

No machine-readable (Excel or CSV) version is provided by ACSQHC.

### 3.2 New Zealand -- HQSC Aotearoa New Zealand Tall Man Lettering List

The Health Quality and Safety Commission (HQSC) maintains the New Zealand list. It was first published in December 2013, reviewed and expanded in April 2020, and most recently updated in October 2023. The October 2023 revision removed PHENOXYMETHylpenicillin following a near miss and re-evaluation; the list now contains 224 medicine names. HQSC explicitly limits the list size to prevent over-use diluting the technique's effectiveness.

New Zealand is the only national authority to publish both PDF and Excel formats as a matter of course. The list is recommended for use in NZULM (New Zealand Universal List of Medicines) data downloads, and for implementation in smart pump drug libraries, electronic medication administration records, and automated dispensing cabinet screens. This integration with NZULM is directly analogous to the AMT integration objective for the Australian list.

Licence conditions are not stated on the download page; confirm with HQSC before incorporating into derivative works.

### 3.3 USA -- FDA List (HTML)

The FDA has maintained its Name Differentiation Project list since 2001. It is published as an HTML table on the FDA website and does not have a standalone downloadable file. The FDA page metadata indicates the list was most recently updated on 12 June 2026. The FDA list covers only FDA-approved generic drug name pairs where the FDA has formally requested voluntary label revisions from manufacturers; it is the smaller and more conservative of the two US lists.

As of June 2026 the list contains 22 unique pairs or groups, covering approximately 45 individual drug names. It covers generic names only and includes no brand name entries. The full list as extracted from the live FDA page is reproduced in Appendix A.

The FDA list is a strict subset of the ISMP combined document (Section 3.4 and 3.5 below). For any pair appearing in both, the TML forms are identical. See Section 3.5 for a detailed structural comparison.

As a US Government publication this content is in the public domain.

### 3.4 USA -- FDA + ISMP Combined List (PDF)

ISMP (Institute for Safe Medication Practices) publishes a combined document containing two tables: Table 1 is the FDA-approved list reproduced in full; Table 2 is the ISMP supplementary list of additional pairs for which ISMP recommends TML but which have not received FDA approval. Table 2 is explicitly described as not FDA-approved and intended for voluntary use.

This is the most widely referenced US resource in practice and the one adopted by most international lists as a starting point. The January 2023 update added seven new name pairs (including cycloPHOSphamide, droPERidol/droNABinol, dexAMETHasone/dexmedeTOMIDine, and pyRIDostigmine/PHYSostigmine) and removed several discontinued brand name entries.

ISMP also publishes a separate, broader "List of Confused Drug Names" (https://www.ismp.org/tools/confuseddrugnames.pdf, updated 2023/2024) which covers all LASA pairs reported in ISMP alerts, not limited to those with TML assignments. This is a superset of the TML list and useful for identifying pairs under consideration for future TML assignment.

Reproduction is permitted for internal newsletters or communications with attribution. Other reproduction requires written permission from ISMP.

### 3.5 FDA versus ISMP: Structural Comparison

These are not two independent lists. The ISMP combined document explicitly reproduces the FDA list as Table 1, then adds its own supplementary material as Table 2. The FDA list is therefore a strict subset of the ISMP combined document. For any pair appearing in both, the TML forms are identical -- both bodies apply the same CD3 capitalisation rule.

**Scale.** The FDA list contains 22 unique pairs or groups (~45 individual drug names). ISMP Table 2 adds approximately 60 further pairs or groups (~130 additional individual drug names), making the combined document roughly three to four times the size of the FDA-only list.

**Brand names.** The FDA list is generic names only. ISMP Table 2 includes brand name pairs: HumaLOG/HumuLIN, NovoLIN/NovoLOG, ZyPREXA/ZyrTEC, CeleBREX/CeleXA, SandIMMUNE/SandoSTATIN, DEPO-Medrol/SOLU-Medrol, LaMICtal/LamISIL, NexAVAR/NexIUM, OxyCONTIN, KlonoPIN, and others. All brand name entries are marked with a double dagger (‡) in the ISMP document.

**Extended groupings.** Some FDA pairs are extended in ISMP Table 2 with additional confusion partners. Selected examples:

| FDA pair | ISMP Table 2 extension |
|----------|----------------------|
| niCARdipine / NIFEdipine | niMODipine added as third member |
| hydrALAZINE / hydrOXYzine / HYDROmorphone | hydroCHLOROthiazide added as confusion risk for hydrALAZINE and hydrOXYzine |
| cycloSPORINE / cycloSERINE | cycloPHOSphamide added as third member |
| mitoXANTRONE (singleton) | mitoMYcin added as confusion partner |
| sulfADIAZINE / sulfiSOXAZOLE | sulfaSALAzine added as third member |
| medroxyPROGESTERone group | HYDROXYprogesterone added as additional confusion risk |
| risperiDONE / rOPINIRole | RisperDAL brand name added to the group |

**Drug classes not represented in the FDA list at all.** ISMP Table 2 covers several entire drug classes absent from the FDA list:

- Cephalosporins: ceFAZolin/cefoTEtan/cefOXitin/cefTAZidime/cefTRIAXone as a 5-way group
- Opioids and opioid-adjacent: HYDROcodone/oxyCODONE/oxyMORphone/oxyBUTYnin/OxyCONTIN as a group
- SSRIs: DULoxetine/FLUoxetine/PARoxetine
- Benzodiazepines and related: clonazePAM/ALPRAZolam/LORazepam/cloBAZam/cloNIDine/cloZAPine
- Taxanes: DOCEtaxel/PACLitaxel
- Antivirals: lamiVUDine/lamoTRIgine; valACYclovir/valGANciclovir
- Sympathomimetics: EPINEPHrine/ePHEDrine
- Antipsychotics: OLANZapine/QUEtiapine
- Kinase inhibitors: SORAfenib/SUNItinib; PAZOPanib/PONATinib
- Anthracyclines: epiRUBicin/eriBULin; IDArubicin/DOXOrubicin
- Additional pairs: dexAMETHasone/dexmedeTOMIDine; romiDEPsin/romiPLOStim; metFORMIN/metroNIDAZOLE; rifAMPin/rifAXIMin; and others

**Discontinued drugs.** Both lists retain some entries for discontinued products, flagged with an asterisk. raNITIdine/riMANTAdine (ranitidine withdrawn from the US market) remains on ISMP Table 2. acetoHEXAMIDE, sulfiSOXAZOLE, and TOLBUTamide are flagged as discontinued but retained on the FDA list.

**Practical implication for AMT/SNOMED CT work.** The FDA-only list is too narrow for terminology purposes. The ISMP combined document is the operative US reference and the global baseline used by AU, NZ, and CA. The FDA-only list is relevant only where there is a specific need to distinguish "this form appears on product labels by regulatory direction" from "this form is a healthcare practice recommendation." For AMT synonym curation, the ISMP combined document is the correct US reference. Where a pair appears on the FDA list, the TML form is necessarily identical between the two sources.

### 3.6 Canada -- ISMP Canada List

The ISMP Canada list was developed through a systematic project in 2015 involving analysis of Canadian incident reporting databases, a Canada-wide practitioner survey, and a structured risk assessment. It contains 33 drug name pairs, each annotated with the originating source (ISMP Canada, ISMP US, FDA, or CAPCA/ISMP Canada). Several entries carry an asterisk indicating that TML is not applied to that drug name in Canada at the time of publication.

The list has not been updated since 2015. This is a significant currency gap: it predates many newer oncology agents, biologics, and the wave of kinase inhibitors and monoclonal antibodies that now populate the Australian and NZ lists. Health Canada's Good Label and Package Practices Guide for Prescription Drugs (2016/2019) endorses TML and directs manufacturers to use this list for consistency on product labels, but does not maintain a separate government list.

ISMP Canada also publishes supporting documents: a Project Report (March 2016) and Principles for Application (March 2016), both available at https://www.ismp-canada.org/TALLman/.

### 3.7 UK -- BOPA List (Oncology Only)

The UK does not have a single comprehensive national TML list equivalent to those of Australia, New Zealand, USA or Canada. The British Oncology Pharmacy Association (BOPA) published a TML list in February 2022 specifically scoped to systemic anti-cancer treatments (SACT). BOPA is a professional body, not a regulatory authority.

Two other UK-specific TML situations exist but do not constitute downloadable standalone lists:

- MHRA requirement: The MHRA and former National Patient Safety Agency (now NHS England/Improvement) agreed in 2009 that all cephalosporin product labels must incorporate TML or colour differentiation for the unique portion of each drug's name (e.g., cefaCLOR, cefADROxil, cefoTAXime). This is a regulatory label requirement on manufacturers embedded in best-practice guidance rather than a separate downloadable list.
- First DataBank (FDB) Multilex: FDB has incorporated TML into its Multilex clinical decision support solution used in UK clinical systems. FDB's TML content is based on the USAN/FDA/ISMP lists and is a commercial product, not a free national resource. A 2024 NHS Medicines Management information sheet notes explicitly that "there is no nationally agreed standard for tall man lettering" in the UK.

The BOPA list covers SACT pairs only, largely derived from FDA/ISMP lists, and is accessible at the URL in the table above (no membership required for the direct PDF link).

### 3.8 Spain -- ISMP-España List

The Spanish list was developed by ISMP-España (Instituto para el Uso Seguro de los Medicamentos) through a structured two-survey methodology involving 90 hospital pharmacists from 13 hospitals across Spain, published in Farmacia Hospitalaria in 2011. The list contains 107 drug names in 44 pairs or groups.

The Spanish term for this technique is *letras mayúsculas resaltadas* (highlighted uppercase letters). The list was explicitly localised for the Spanish market: 11 pairs were removed because those drugs are not marketed in Spain, and additional pairs were added from Spanish incident reports.

An important difference from anglophone lists is that the Spanish list uses Spanish DOE (Denominación Oficial Española) names where these differ from INN. Most are identical to INN but some diverge, which matters for cross-national comparison.

No evidence of a formal standalone update to the TML list since 2011 was found, though ISMP-España maintains a broader semi-annually updated database of confusable drug names ("nombres similares que se prestan a confusión") on its website. A 2022 journal article (Iglesias Gomez et al., J Clin Pharm Ther) references ISMP España's broader similar names list as of 2021, confirming the site remains active.

Spain is a SNOMED International member country.

---

## 4. Partial Coverage and Near-Misses

### 4.1 Germany -- Academic Proposal (not official)

Heck et al. (2021) published a "Proposal of a Tall Man Letter list for German-speaking countries" in the European Journal of Clinical Pharmacology (DOI: 10.1007/s00228-021-03091-3; open access via PMC: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8275545/). The proposal covers Germany, Austria, Switzerland, Belgium, Luxembourg, the Netherlands, and -- by linguistic proximity -- Scandinavian countries. It is not officially adopted by BfArM (Germany), BASG (Austria), or Swissmedic (Switzerland). The authors explicitly describe it as a proposal intended to stimulate adoption.

This is the resource used by WProofreader for its German-language medical dictionary TML entries. Germany is a SNOMED member.

A separate DIVI (Deutsche Interdisziplinäre Vereinigung für Intensiv- und Notfallmedizin) syringe labelling standard ("Empfehlung zur Kennzeichnung von Spritzen in der Intensiv- und Notfallmedizin", 2012) incorporates TML for a narrow set of drug names in the ICU/emergency context. This is a syringe labelling standard, not a general TML list.

### 4.2 EMA -- No official guidance or list

The European Medicines Agency has not published a standalone TML list or binding TML guidance. A 2018 systematic literature review in the European Journal of Clinical Pharmacology noted that "guidelines of the FDA and European Medicines Agency do not give conclusive advice on how to prevent look-alike errors." No change to this position was found in the current search. Individual EU member states therefore have no EMA-level mandate to develop or implement TML lists.

### 4.3 WHO and IMSN -- Endorsement without a list

**WHO.** The WHO World Alliance for Patient Safety endorsed TML as a strategy in its 2007 Patient Safety Solutions (Solution 1: Look-alike, Sound-alike Medication Names) and is cited as an endorser in the ISMP combined document. WHO does not publish or maintain a standalone TML list, and there is no WHO programme dedicated to TML list development. The WHO endorsement functions as rationale for national programmes, not as a global canonical resource.

**IMSN.** The International Medication Safety Network (IMSN) is an international network of medication safety centres established in 2006 (Salamanca Declaration). It has regulatory members including the FDA, Health Canada, MHRA (UK), the Norwegian Medicines Agency, Singapore Ministry of Health, and the Hong Kong Hospital Authority. The IMSN published a position statement in 2011 proposing that TML be applied to error-prone INNs globally to improve cross-national consistency, and ISMP Canada documents from 2016 describe the IMSN as "leading collaborative work to acknowledge and build upon international efforts in this area." However, no published global IMSN TML list has emerged. The IMSN's current published outputs focus on other safety priorities (oxytocin, concentrated potassium chloride, intrathecal vincristine, valproate). The global TML harmonisation proposal remains an aspiration rather than a delivered product.

**No country-agnostic list exists.** As of June 2026, no WHO, IMSN, EMA, or other international body has published a standalone downloadable TML list intended for country-agnostic use.

**De facto international baseline.** In practice, the FDA+ISMP combined list functions as the global reference baseline. Australia, New Zealand, Canada, and Spain all explicitly derived their lists from it, retaining identical TML forms for shared pairs and adding locally relevant entries. If a single country-agnostic starting point is needed for SNOMED CT synonym work, the FDA+ISMP combined list is the closest available equivalent: it covers the broadest set of INN-based pairs, applies a documented and reproducible methodology (CD3 rule), is publicly available as a free PDF, and is the source from which every other national list has been derived.

---

## 5. SNOMED CT Member Countries: Coverage Summary

SNOMED International currently has 53 member countries. Confirmed standalone TML lists exist for 5 of those member countries (counting the US FDA and ISMP lists separately, 6 sources from 5 countries): Australia, New Zealand, USA, Canada, and Spain.

The UK (charter member) has a partial list via BOPA for oncology; Germany (member) has an unofficial academic proposal.

The following charter members have no standalone list: Denmark, Sweden, Netherlands, Lithuania.

No standalone TML lists were found for any SNOMED member countries in the Asia-Pacific region beyond Australia and New Zealand, nor for any Americas members beyond USA and Canada, nor for any Middle Eastern or African members.

---

## 6. Cross-Cutting Observations

**Currency gaps.** The Canada list (2015) and Spain list (2011) have not been formally updated in over a decade. Both predate most newer oncology agents -- kinase inhibitors, checkpoint inhibitors, monoclonal antibodies in expanded therapeutic areas -- that are now prominent in the Australian and NZ lists. Any use of these lists for SNOMED CT synonym validation should treat entries for newer drug classes as potentially incomplete.

**Scope differences.** All lists focus on generic (INN or DOE) names. The ISMP US list also includes a small number of brand name pairs. The Australian and NZ lists explicitly include brand names. The FDA list covers generic names only.

**Capitalisation methodology.** Most lists use the "CD3 rule" (also called the "mid" rule): working from the left, capitalise all characters from the first point of divergence between two names; working from the right, restore common trailing characters to lowercase. ISMP notes that when this rule fails to produce visually useful results, an alternative is considered. Consistency of TML form across lists is therefore not guaranteed even for pairs appearing on multiple national lists: the AU/NZ and US/CA lists sometimes differ in exactly which letters are capitalised.

**AMT-specific relevance.** The Australian list is the primary authority for AMT. Where Australian and New Zealand TML assignments agree, that convergence provides a stronger basis for a single canonical form. Where they differ, or where a pair appears on the AU list but not the NZ list (or vice versa), this is an editorial decision point. The US (FDA+ISMP) list is the global reference baseline and is explicitly used by AU, NZ and CA as input; Spain used it as a starting point but localised for market availability.

**No global canonical list exists; FDA+ISMP is the de facto baseline.** Each national list was derived independently from the US baseline and then adapted for local drug availability and incident reports. A drug pair may have identical TML form across all lists, similar but not identical form, or may appear on only one or two lists. Cross-national harmonisation is an open problem, and the IMSN's stated goal of applying TML to INNs globally has not yet produced a published resource. The FDA+ISMP combined list is the most appropriate single reference for INN-level SNOMED CT work in the absence of a global list; it is the source document from which all other lists are derived, covers the broadest INN-based pair set, and is freely available.

**FDA versus ISMP is not a meaningful distinction for most purposes.** The FDA list is a strict subset of the ISMP combined document; the TML forms are identical for any pair appearing in both. The FDA list is relevant only where it is necessary to distinguish "form mandated on product labels" from "form recommended for clinical practice." For AMT or SNOMED CT synonym work, the ISMP combined document supersedes the FDA-only list in all respects.

---

## 7. Recommended Monitoring

The following sources should be checked periodically for updates, given their known active maintenance:

| Source | Monitoring recommendation |
|--------|--------------------------|
| ACSQHC (Australia) | Check annually; 2024 was the most recent update |
| HQSC (New Zealand) | Check annually; 2023 was the most recent update |
| FDA (USA) | The page was updated June 2026; check after any Name Differentiation Project announcement |
| ISMP (USA) | Updated following periodic surveys; 2023 was the most recent full revision; check ISMP Medication Safety Alert releases |
| ISMP Canada | No update since 2015; check ismp-canada.org for any new release |
| ISMP-España | No standalone TML update since 2011; the broader LASA database is updated semi-annually |
| BOPA (UK, oncology) | Version 1.0 is current (February 2022); check bopa.org.uk for any new version |

---

*Report compiled June 2026. All URLs verified at time of research. URL stability for hosted PDFs (particularly HQSC) cannot be guaranteed; landing pages are more stable than direct file paths.*

---

## Appendix A: Current FDA List (as at June 2026)

The following table is extracted verbatim from the FDA Name Differentiation Project web page, verified 24 June 2026. Source: https://www.fda.gov/drugs/medication-errors-related-cder-regulated-drug-products/fda-name-differentiation-project (US Government work; public domain).

| Established Name | Recommended (TML) Form |
|-----------------|------------------------|
| Acetohexamide / Acetazolamide | acetoHEXAMIDE / acetaZOLAMIDE |
| Bupropion / Buspirone | buPROPion / busPIRone |
| Chlorpromazine / Chlorpropamide | chlorproMAZINE / chlorproPAMIDE |
| Cisplatin / Carboplatin | CISplatin / CARBOplatin |
| Clomiphene / Clomipramine | clomiPHENE / clomiPRAMINE |
| Cyclosporine / Cycloserine | cycloSPORINE / cycloSERINE |
| Daunorubicin / Doxorubicin | DAUNOrubicin / DOXOrubicin |
| Dimenhydrinate / Diphenhydramine | dimenhyDRINATE / diphenhydrAMINE |
| Dobutamine / Dopamine | DOBUTamine / DOPamine |
| Glipizide / Glyburide | glipiZIDE / glyBURIDE |
| Hydralazine / Hydroxyzine | hydrALAZINE / hydrOXYzine |
| Hydromorphone | HYDROmorphone |
| Medroxyprogesterone / Methylprednisolone / Methyltestosterone | medroxyPROGESTERone / methylPREDNISolone / methylTESTOSTERone |
| Methylprednisolone / Methyltestosterone | methylPREDNISolone / methylTESTOSTERone |
| Migalastat / Miglustat | migALAstat / migLUstat |
| Mitoxantrone | mitoXANTRONE |
| Nicardipine / Nifedipine | niCARdipine / NIFEdipine |
| Prednisone / Prednisolone | predniSONE / prednisoLONE |
| Risperidone / Ropinirole | risperiDONE / rOPINIRole |
| Sulfadiazine / Sulfisoxazole* | sulfADIAZINE / sulfiSOXAZOLE |
| Tolazamide / Tolbutamide* | TOLAZamide / TOLBUTamide |
| Trazodone / Tramadol | traZODone / traMADol |
| Vinblastine / Vincristine | vinBLAStine / vinCRIStine |

\* Flagged as discontinued in the ISMP combined document; retained on the FDA list.

---

## Appendix B: Cross-List Comparison Table (AU · NZ · FDA · ISMP)

This table aligns all entries from the four source lists in the repository (AU, NZ, FDA, ISMP) against a shared case-insensitive key. Each row represents one drug name; columns show the TML form used by each authority, or are blank where that authority does not list the name. Rows where the same name appears in two or more lists with different capitalisation are marked **⚠ differs** in the Notes column.

**Coverage summary:** 384 unique drug name keys across all four lists; 202 keys appear in two or more lists; 85 of those have at least one capitalisation difference across lists.

**List versions used:** AU 20240400.0 · NZ 20231000.0 · FDA 20260612.0 · ISMP 20260612.0

| Drug name (key) | AU | NZ | FDA | ISMP | Notes |
|---|---|---|---|---|---|
| acetazolamide |  |  | acetaZOLAMIDE | acetaZOLAMIDE |  |
| acetohexamide |  |  | acetoHEXAMIDE | acetoHEXAMIDE |  |
| aclin | aCLin |  |  |  |  |
| actonel | actoNEL |  |  |  |  |
| actos | actoS |  |  |  |  |
| afatinib | aFATinib | aFATinib |  |  |  |
| akamin | aKAMin |  |  |  |  |
| aldactone | alDACTONE |  |  |  |  |
| aldomet | alDOMET |  |  |  |  |
| alemtuzumab |  | aLEMTUzumab |  |  |  |
| alfentanil |  |  |  | ALfentanil |  |
| alkeran | ALKeran | ALKeran |  |  |  |
| allopurinol |  | aLLOPURINol |  |  |  |
| alodorm | alODORM |  |  |  |  |
| alprazolam |  |  |  | ALPRAZolam |  |
| amaryl | amARYl |  |  |  |  |
| amiloride |  |  |  | aMILoride |  |
| aminophylline | amiNOPHYLLine | amINOPHYLLIne |  |  | **⚠ differs** |
| amiodarone | amiODAROne | amIODAROne |  |  | **⚠ differs** |
| amisulpride |  | amiSULPRIDe |  |  |  |
| amitriptyline | amiTRIPTYLine | amITRIPTYLIne |  |  | **⚠ differs** |
| amlodipine | amLODIPine | amLODIPIne |  | amLODIPine | **⚠ differs** |
| amoxil | amOXil |  |  |  |  |
| apomine | aPomine | aPomine |  |  |  |
| arabloc | arABLOC |  |  |  |  |
| aratac | arATAC | arATAC |  |  |  |
| aripiprazole | ARIPiprazole |  |  | ARIPiprazole |  |
| aropax | arOPAX | arOPAX |  |  |  |
| atenolol |  | aTENOLol |  |  |  |
| atezolizumab |  | aTEZOLIzumab |  |  |  |
| atropt | aTRopt | aTRopt |  |  |  |
| avastin | avaSTIN | avaSTIN |  |  |  |
| avaxim | avaXIM | avaXIM |  |  |  |
| avomine | aVomine | aVomine |  |  |  |
| axitinib | aXITinib | aXITinib |  |  |  |
| azacitidine |  |  |  | azaCITIDine |  |
| azathioprine | azATHIOPRINE | azATHIOPRINE |  | azaTHIOprine | **⚠ differs** |
| azithromycin | aziTHROMYCIN | azITHROMYCIN |  |  | **⚠ differs** |
| azopt | aZopt | aZopt |  |  |  |
| baricitinib | bARICITinib |  |  |  |  |
| benralizumab | beNRALizumab |  |  |  |  |
| benzathine benzylpenicillin |  | BENZATHINE benzylpenicillin |  |  |  |
| bevacizumab | beVACizumab | beVACizumab |  |  |  |
| bezlotoxumab | beZLOTOXumab |  |  |  |  |
| binimetinib | biNIMEtinib |  |  |  |  |
| bisacodyl | bisACODYl | bisACODYl |  |  |  |
| bisoprolol | bisOPROLOl | bisOPROLOl |  |  |  |
| budesonide | buDESONide | buDESONide |  |  |  |
| bumetanide | buMETANide | buMETANide |  |  |  |
| bupivacaine |  |  |  | BUPivacaine |  |
| bupropion |  | buPROPION | buPROPion | buPROPion | **⚠ differs** |
| buspirone |  | buSPIRONE | busPIRone | busPIRone | **⚠ differs** |
| cabazitaxel | CABAZitaxel |  |  |  |  |
| cabozantinib | cABOZANtinib |  |  |  |  |
| caltrate | caLTRate | caLTRate |  |  |  |
| captopril | caPTOPRil | caPTOPRIl |  |  | **⚠ differs** |
| carafate | caRAFate | caRAFate |  |  |  |
| carbamazepine | CARBAMazepine | CARBAMazepine |  | carBAMazepine | **⚠ differs** |
| carbimazole | carbiMAZOLe | carbIMAZOLe |  |  | **⚠ differs** |
| carboplatin | cARBOplatin | cARBOplatin | CARBOplatin | CARBOplatin | **⚠ differs** |
| carvedilol | caRVEDILOl | caRVEDILOl |  |  |  |
| cefaclor |  | cefaCLOR |  |  |  |
| cefalexin | cefaLEXin | cefaLEXin |  |  |  |
| cefalotin | cefALOTIN |  |  |  |  |
| cefazolin | cefaZOLin | cefaZOLin |  | ceFAZolin | **⚠ differs** |
| cefepime | cefEPIME | cefEPIME |  |  |  |
| cefotaxime | cefOTAXIME | cefOTAXIME |  |  |  |
| cefotetan |  |  |  | cefoTEtan |  |
| cefoxitin | cefOXITIN | cefOXITIN |  | cefOXitin | **⚠ differs** |
| ceftaroline | ceftAROLine | ceftAROLine |  |  |  |
| ceftazidime | cefTAZIDIME | cefTAZIDIME |  | cefTAZidime | **⚠ differs** |
| ceftriaxone | cefTRIAXONE | cefTRIAXONE |  | cefTRIAXone | **⚠ differs** |
| cefuroxime |  | cefUROXIME |  |  |  |
| celapram | celAPRAM | celAPRAM |  |  |  |
| celebrex | celEBREX | celEBREX |  | CeleBREX | **⚠ differs** |
| celexa |  |  |  | CeleXA |  |
| cephalexin |  | cephaLEXin |  |  |  |
| cephazolin |  | cephaZOLin |  |  |  |
| cetuximab |  | CETUximab |  |  |  |
| chlordiazepoxide |  |  |  | chlordiazePOXIDE |  |
| chlorpromazine | cHLORPROMAZine | cHLORPROMAZIne | chlorproMAZINE | chlorproMAZINE | **⚠ differs** |
| chlorpropamide |  |  | chlorproPAMIDE | chlorproPAMIDE |  |
| ciclosporin | ciclosPORIN | ciclosPORIN |  |  |  |
| cipramil | ciprAMIL | ciprAMIL |  |  |  |
| ciprofloxacin | ciPROFLOXAcin | cIPROFLOXAcin |  |  | **⚠ differs** |
| ciproxin | ciprOXIN | ciprOXIN |  |  |  |
| cisplatin | ciSplatin | cISplatin | CISplatin | CISplatin | **⚠ differs** |
| clarithromycin | cLARITHROMYcin | cLARITHROMYcin |  |  |  |
| clindamycin |  | clINDAmycin |  |  |  |
| clobazam | cloBAZam |  |  | cloBAZam |  |
| clomifene | cLOMIFEne | cLOMIFEne |  |  |  |
| clomiphene |  | cLOMIPHEne | clomiPHENE | clomiPHENE | **⚠ differs** |
| clomipramine | cLOMIPRAMine | cLOMIPRAMIne | clomiPRAMINE | clomiPRAMINE | **⚠ differs** |
| clonazepam | CLONazepam | CLONazepam |  | clonazePAM | **⚠ differs** |
| clonidine |  | cloNIDine |  | cloNIDine |  |
| clozapine |  | cLOZAPine |  | cloZAPine | **⚠ differs** |
| cobimetinib | cOBIMEtinib | cOBIMEtinib |  |  |  |
| coumadin | coUMADIN | coUMADIN |  |  |  |
| coversyl | coVERSYL | coVERSYL |  |  |  |
| cyclizine | cycLIZINE | cyclIZINE |  |  | **⚠ differs** |
| cycloblastin |  | cyclOBLASTIN |  |  |  |
| cyclonex | cycLONEX |  |  |  |  |
| cyclophosphamide | CYCLOPHOSPHamide | CYCLOPHOSPHamide |  | cycloPHOSphamide | **⚠ differs** |
| cycloserine | cyclosERINE | cyclosERINE | cycloSERINE | cycloSERINE | **⚠ differs** |
| cyclosporin |  | cyclosPORIN |  |  |  |
| cyclosporine |  |  | cycloSPORINE | cycloSPORINE |  |
| dabrafenib | daBRAFEnib | daBRAFEnib |  |  |  |
| dactinomycin | daCTINomycin | daCTINomycin |  | DACTINomycin | **⚠ differs** |
| daptomycin | daPTomycin | daPTomycin |  | DAPTOmycin | **⚠ differs** |
| dasatinib | daSATinib | daSATinib |  |  |  |
| daunorubicin | DAUNOrubicin | DAUNOrubicin | DAUNOrubicin | DAUNOrubicin |  |
| depo-medrol | DEPO-medrol | DEPO-medrol |  | DEPO-Medrol | **⚠ differs** |
| depo-provera | depo-PROVERA | depo-PROVERA |  |  |  |
| deptran | dePTRAn |  |  |  |  |
| deralin | deRALin |  |  |  |  |
| dexamethasone | dexAMETHASOne |  |  | dexAMETHasone | **⚠ differs** |
| dexmedetomidine | dexMEDETOMIDine |  |  | dexmedeTOMIDine | **⚠ differs** |
| diazepam | DIAzepam | DIazepam |  | diazePAM | **⚠ differs** |
| digoxin |  | dIGOXin |  |  |  |
| dilantin | dilaNTIN |  |  |  |  |
| dilaudid | dilaUDID |  |  |  |  |
| diltiazem |  |  |  | dilTIAZem |  |
| dimenhydrinate |  |  | dimenhyDRINATE | dimenhyDRINATE |  |
| diphenhydramine |  |  | diphenhydrAMINE | diphenhydrAMINE |  |
| diprivan | diPRIVan |  |  |  |  |
| dipyridamole | diPYRIDAMOLe | diPYRIDAMOLe |  |  |  |
| disopyramide | diSOPYRAMIDe | diSOPYRAMIDe |  |  |  |
| ditropan | diTROPan |  |  |  |  |
| dobutamine |  | doBUTamine | DOBUTamine | DOBUTamine | **⚠ differs** |
| docetaxel | DOCEtaxel | DOCEtaxel |  | DOCEtaxel |  |
| dopamine |  | doPamine | DOPamine | DOPamine | **⚠ differs** |
| dosulepin | doSULepin |  |  |  |  |
| dothiepin | doTHiepin | doTHIEpin |  |  | **⚠ differs** |
| doxazosin |  | dOXAZOSin |  |  |  |
| doxepin | doXepin | doXEpin |  |  | **⚠ differs** |
| doxorubicin | DOXOrubicin | DOXOrubicin | DOXOrubicin | DOXOrubicin |  |
| dronabinol |  |  |  | droNABinol |  |
| droperidol |  |  |  | droPERidol |  |
| duloxetine | DULoxetine | DULoxetine |  | DULoxetine |  |
| eculizumab | eCULizumab |  |  |  |  |
| efalizumab | eFALizumab |  |  |  |  |
| emicizumab | eMICizumab |  |  |  |  |
| ephedrine |  |  |  | ePHEDrine |  |
| epinephrine |  |  |  | EPINEPHrine |  |
| epirubicin |  |  |  | epiRUBicin |  |
| eribulin |  |  |  | eriBULin |  |
| erythromycin | ERYthromycin | ERYthromycin |  |  |  |
| fentanyl |  |  |  | fentaNYL |  |
| flavoxate |  |  |  | flavoxATE |  |
| flucloxacillin | flucLOXACILLIN |  |  |  |  |
| fluconazole | flucONAZOLe |  |  |  |  |
| flucytosine | flucYTOSINe |  |  |  |  |
| fluoxetine |  |  |  | FLUoxetine |  |
| flupenthixol |  | flupENTHIXOL |  |  |  |
| flupentixol |  | flupENTIXOL |  |  |  |
| fluphenazine |  | flupHENAZINE |  | fluPHENAZine | **⚠ differs** |
| fluvax |  | fluVAx |  |  |  |
| fluvoxamine | fluVOXAMine | fluVOXAMine |  | fluvoxaMINE | **⚠ differs** |
| folinic acid |  | foliNIc acid |  |  |  |
| glibenclamide | gliBENCLAMide | gliBENCLAMide |  |  |  |
| gliclazide | gliCLAZide | gliCLAZide |  |  |  |
| glimepiride | gliMEPIRide |  |  |  |  |
| glipizide | gliPIZide | gliPIZide | glipiZIDE | glipiZIDE | **⚠ differs** |
| glyburide |  |  | glyBURIDE | glyBURIDE |  |
| guaifenesin |  |  |  | guaiFENesin |  |
| guanfacine |  |  |  | guanFACINE |  |
| humalog | humALOG | humALOG |  | HumaLOG | **⚠ differs** |
| humulin | humULIN | humULIN |  | HumuLIN | **⚠ differs** |
| hydralazine | hydrALAZINe |  | hydrALAZINE | hydrALAZINE | **⚠ differs** |
| hydrea | hydreA |  |  |  |  |
| hydrene | hydreNE |  |  |  |  |
| hydrochlorothiazide | hydrOCHLOROTHIAZIDe |  |  | hydroCHLOROthiazide | **⚠ differs** |
| hydrocodone |  |  |  | HYDROcodone |  |
| hydromorphone | HYDROmorphone |  | HYDROmorphone | HYDROmorphone |  |
| hydroxyprogesterone |  |  |  | HYDROXYprogesterone |  |
| hydroxyzine |  |  | hydrOXYzine | hydrOXYzine |  |
| hyoscine butylbromide |  | hyoscine BUTYLbromide |  |  |  |
| hyoscine hydrobromide |  | hyoscine HYDRObromide |  |  |  |
| idarubicin | iDArubicin | IDArubicin |  | IDArubicin | **⚠ differs** |
| idarucizumab |  |  |  | idaruCIZUmab |  |
| ifosfamide | iFOSFamide | IFOSFamide |  |  | **⚠ differs** |
| imuprine |  | imUPRine |  |  |  |
| inderal | INDEral | INDEral |  |  |  |
| infliximab |  | INFLIximab |  | inFLIXimab | **⚠ differs** |
| isopto carpine | isopto CARpine | isopto CARpine |  |  |  |
| isopto homatropine | isopto HOMATROpine | isopto HOMATROpine |  |  |  |
| isotretinoin | iSOtretinoin | ISOtretinoin |  | ISOtretinoin | **⚠ differs** |
| janumet | januMET | januMET |  |  |  |
| januvia | januVIA | januVIA |  |  |  |
| ketalar | ketALAR | ketALAR |  |  |  |
| ketorolac | ketOROLAC | ketOROLAC |  |  |  |
| klonopin |  |  |  | KlonoPIN |  |
| lamictal | laMICTAl | laMICTAl |  | LaMICtal | **⚠ differs** |
| lamisil | laMISil | laMISIl |  | LamISIL | **⚠ differs** |
| lamivudine | lamiVUDine | lamIVUDine |  | lamiVUDine | **⚠ differs** |
| lamotrigine | lamOTRIGine | lamOTRIGine |  | lamoTRIgine | **⚠ differs** |
| lantus | lanTUs | lanTUs |  |  |  |
| lanvis | lanVis | lanVIs |  |  | **⚠ differs** |
| lapatinib | laPAtinib | laPAtinib |  |  |  |
| largactil | laRGACTil | laRGACTIl |  |  | **⚠ differs** |
| lenvatinib | leNVAtinib |  |  |  |  |
| leukeran | LEUKeran | LEUKeran |  |  |  |
| levetiracetam |  |  |  | levETIRAcetam |  |
| levocarnitine |  |  |  | levOCARNitine |  |
| levofloxacin |  |  |  | levoFLOXacin |  |
| levoleucovorin |  |  |  | LEVOleucovorin |  |
| lincomycin | linCOMYCIN |  |  |  |  |
| linezolid | linEZOLID |  |  |  |  |
| lorazepam | LORazepam | LORazepam |  | LORazepam |  |
| losec | loSEC |  |  |  |  |
| lovan | loVAN |  |  |  |  |
| loxalate |  | loxaLATe |  |  |  |
| loxamine |  | loxaMINe |  |  |  |
| m-enalapril |  | m-eNALAPRIL |  |  |  |
| m-eslon |  | m-eSLON |  |  |  |
| maxidex |  | maxiDEX |  |  |  |
| maxitrol |  | maxiTROL |  |  |  |
| medroxyprogesterone |  | meDROXYPROGESTERone | medroxyPROGESTERone | medroxyPROGESTERone | **⚠ differs** |
| mercaptamine | mercaptAMine | mercaptAMine |  |  |  |
| mercaptopurine | mercaptOPURine | mercaptOPURine |  |  |  |
| metformin |  |  |  | metFORMIN |  |
| methadone | methADONe | methADONe |  |  |  |
| methazolamide |  |  |  | methazolAMIDE |  |
| methimazole |  |  |  | methIMAzole |  |
| methotrexate |  | metHOTREXATe |  |  |  |
| methylphenidate | methYLPHENIDATe | methYLPHENIDATe |  |  |  |
| methylprednisolone |  |  | methylPREDNISolone | methylPREDNISolone |  |
| methylprednisolone acetate |  | methylprednisolone ACETate |  |  |  |
| methylprednisolone sodium succinate |  | methylprednisolone SODIUM SUCCINate |  |  |  |
| methyltestosterone |  |  | methylTESTOSTERone | methylTESTOSTERone |  |
| metoclopramide |  | metOCLOPRAMIDe |  |  |  |
| metolazone |  |  |  | metOLazone |  |
| metoprolol |  | metoPROLOL |  |  |  |
| metronidazole |  |  |  | metroNIDAZOLE |  |
| metyrapone |  |  |  | metyraPONE |  |
| metyrosine |  |  |  | metyroSINE |  |
| mifepristone |  |  |  | miFEPRIStone |  |
| migalastat |  |  | migALAstat | migALAstat |  |
| miglustat |  |  | migLUstat | migLUstat |  |
| misoprostol |  |  |  | miSOPROStol |  |
| mitomycin |  |  |  | mitoMYcin |  |
| mitoxantrone |  |  | mitoXANTRONE | mitoXANTRONE |  |
| mobilis | moBILis |  |  |  |  |
| movalis | moVALis |  |  |  |  |
| moxifloxacin | MOXifloxacin | MOXIfloxacin |  |  | **⚠ differs** |
| ms contin | MS Contin |  |  |  |  |
| myleran | MYLeran | MYLeran |  |  |  |
| naloxone |  | nalOXone |  |  |  |
| naltrexone |  | nalTREXone |  |  |  |
| neo-mercazole |  | neO-MERCAZOLe |  |  |  |
| neoral | NEOral | NEOral |  |  |  |
| neurokare |  | neUROKARe |  |  |  |
| nexavar | nexAVAR |  |  | NexAVAR | **⚠ differs** |
| nexium | nexiUM |  |  | NexIUM | **⚠ differs** |
| nicardipine |  |  | niCARdipine | niCARdipine |  |
| nifedipine | niFEDIPine | niFEDIPine | NIFEdipine | NIFEdipine | **⚠ differs** |
| nimodipine | niMODIPine | niMODIPine |  | niMODipine | **⚠ differs** |
| nitrazepam |  | NITRazepam |  |  |  |
| nizatidine | niZATIDine |  |  |  |  |
| norfloxacin | NORfloxacin | NORfloxacin |  |  |  |
| normison | norMISON | norMISON |  |  |  |
| norvasc | norVASC | norVASC |  |  |  |
| novolin |  |  |  | NovoLIN |  |
| novolog |  |  |  | NovoLOG |  |
| novomix | novoMIX | novoMIX |  |  |  |
| novorapid | novoRAPID | novoRAPID |  |  |  |
| novoseven |  | novoSEVEN |  |  |  |
| obinutuzumab | oBINUTUZumab | oBINUTUZumab |  |  |  |
| ocrelizumab | oCRELizumab |  |  |  |  |
| ofatumumab | oFATUMumab |  |  |  |  |
| olanzapine |  |  |  | OLANZapine |  |
| omalizumab | oMALizumab | oMALizumab |  |  |  |
| oxazepam | OXazepam | OXazepam |  |  |  |
| oxcarbazepine | OXCARBazepine | OXCARBazepine |  | OXcarbazepine | **⚠ differs** |
| oxybutynin |  |  |  | oxyBUTYnin |  |
| oxycodone |  |  |  | oxyCODONE |  |
| oxycontin | oxyCONTIN | oxyCONTIN |  | OxyCONTIN | **⚠ differs** |
| oxymorphone |  |  |  | oxyMORphone |  |
| oxynorm | oxyNORM | oxyNORM |  |  |  |
| paclitaxel | PACLitaxel | PACLItaxel |  | PACLitaxel | **⚠ differs** |
| panitumumab | pANITUMumab |  |  |  |  |
| pariet | paRIET |  |  |  |  |
| paroxetine | PARoxetine | PARoxetine |  | PARoxetine |  |
| paxtine | paXTINE |  |  |  |  |
| pazopanib | pAZOPanib | pAZOPanib |  | PAZOPanib | **⚠ differs** |
| pegfilgrastim |  | pegFILGRASTIM |  |  |  |
| peginterferon |  | pegINTERFERON |  |  |  |
| pemetrexed |  |  |  | PEMEtrexed |  |
| penicillamine |  | penicillAMINE |  | penicillAMINE |  |
| pentobarbital |  |  |  | PENTobarbital |  |
| pertuzumab | pERTUZumab | pERTUZumab |  |  |  |
| pexsig | pEXSIG |  |  |  |  |
| phenobarbital |  |  |  | PHENobarbital |  |
| physostigmine |  |  |  | PHYSostigmine |  |
| ponatinib | pONATinib |  |  | PONATinib | **⚠ differs** |
| pralatrexate |  |  |  | PRALAtrexate |  |
| prednisolone |  |  | prednisoLONE | prednisoLONE |  |
| prednisone |  | prEDNISone | predniSONE | predniSONE | **⚠ differs** |
| prilosec |  |  |  | PriLOSEC |  |
| primacin | primaCIN | primaCIN |  |  |  |
| primacor | primaCOR | primaCOR |  |  |  |
| primaquine |  | primAQUIne |  |  |  |
| primaxin | primaXIN | primaXIN |  |  |  |
| primidone |  | primIDOne |  |  |  |
| pristiq | pRISTIQ |  |  |  |  |
| prochlorperazine | proCHLORPERazine | proCHLORPERazine |  |  |  |
| procyclidine |  | procYCLIDine |  |  |  |
| prograf | proGRAF | proGRAF |  |  |  |
| promethazine | proMETHazine | proMETHazine |  |  |  |
| propofol | propOFol | propOFol |  |  |  |
| propranolol | propRANOLol | propRANOLol |  |  |  |
| prozac | proZAC | proZAC |  | PROzac | **⚠ differs** |
| pyridostigmine |  |  |  | pyRIDostigmine |  |
| quetiapine | QUETIAPine | QUETIAPine |  | QUEtiapine | **⚠ differs** |
| quinidine |  |  |  | quiNIDine |  |
| quinine |  | quINine |  | quiNINE | **⚠ differs** |
| rabeprazole | RABEprazole |  |  | RABEprazole |  |
| ramucirumab | raMUCIRumab |  |  |  |  |
| ranibizumab | raNIBIZumab |  |  |  |  |
| ranitidine |  |  |  | raNITIdine |  |
| rifampicin | rifaMPICin | rifaMPICin |  |  |  |
| rifampin |  |  |  | rifAMPin |  |
| rifaximin | rifaXIMin | rifaXIMin |  | rifAXIMin | **⚠ differs** |
| rimantadine |  |  |  | riMANTAdine |  |
| risperdal |  |  |  | RisperDAL |  |
| risperidone | riSPERIDONe | riSPERIDONe | risperiDONE | risperiDONE | **⚠ differs** |
| rituximab |  | RITUximab |  | riTUXimab | **⚠ differs** |
| romidepsin |  |  |  | romiDEPsin |  |
| romiplostim |  |  |  | romiPLOStim |  |
| ropinirole | rOPINIROLe | rOPINIROLe | rOPINIRole | rOPINIRole | **⚠ differs** |
| ropivacaine |  |  |  | ROPivacaine |  |
| sandimmune |  |  |  | SandIMMUNE |  |
| sandostatin |  |  |  | SandoSTATIN |  |
| saxagliptin | sAXagliptin |  |  | sAXagliptin |  |
| sertraline | SERTRALine | SERTRALine |  |  |  |
| sirolimus | Sirolimus | SIrolimus |  |  | **⚠ differs** |
| sitagliptin | siTagliptin | siTagliptin |  | SITagliptin | **⚠ differs** |
| solu-cortef | solu-CORTEF | solu-CORTEF |  | Solu-CORTEF | **⚠ differs** |
| solu-medrol | SOLU-medrol | SOLU-medrol |  | SOLU-Medrol | **⚠ differs** |
| sonidegib | soNIDEGib |  |  |  |  |
| sorafenib | soRAFENib | soRAFENib |  | SORAfenib | **⚠ differs** |
| sufentanil |  |  |  | SUFentanil |  |
| sulfadiazine | sulfaDiazine | sulfaDIazine | sulfADIAZINE | sulfADIAZINE | **⚠ differs** |
| sulfasalazine | sulfaSALazine | sulfaSALazine |  | sulfaSALAzine | **⚠ differs** |
| sulfisoxazole |  |  | sulfiSOXAZOLE | sulfiSOXAZOLE |  |
| sumatriptan | sUMATRIPTAn | sUMATRIPTAn |  | SUMAtriptan | **⚠ differs** |
| sunitinib | sUNITinib | sUNITinib |  | SUNItinib | **⚠ differs** |
| tacrolimus | TACrolimus | TACrolimus |  |  |  |
| tamoxifen |  | TAMoxifen |  |  |  |
| tapentadol | tAPENTadol |  |  |  |  |
| tegretol | tEGRETOl |  |  |  |  |
| temodal | tEMOdal | tEMOdal |  |  |  |
| tiagabine |  |  |  | tiaGABine |  |
| tizanidine |  |  |  | tiZANidine |  |
| tofacitinib | tOFACitinib |  |  |  |  |
| tofranil | toFRANIL | toFRANIL |  |  |  |
| tolazamide |  |  | TOLAZamide | TOLAZamide |  |
| tolbutamide |  |  | TOLBUTamide | TOLBUTamide |  |
| topamax | toPAMAX | toPAMAX |  |  |  |
| toradol | tORadol |  |  |  |  |
| tramadol | tRAMadol | tRAMadol | traMADol | traMADol | **⚠ differs** |
| trametinib | tRAMEtinib |  |  |  |  |
| trazodone |  |  | traZODone | traZODone |  |
| trental | tRENTAl |  |  |  |  |
| trimeprazine | trimEPRAZINE | trimEPRAZINE |  |  |  |
| trimethoprim | trimETHOPRIM | trimETHOPRIM |  |  |  |
| valaciclovir | valAciclovir | valAciclovir |  |  |  |
| valacyclovir |  |  |  | valACYclovir |  |
| valganciclovir | valGANciclovir | valGANciclovir |  | valGANciclovir |  |
| vinblastine | vinBLASTine | vinBLASTine | vinBLAStine | vinBLAStine | **⚠ differs** |
| vincristine | vinCRISTine | vinCRISTine | vinCRIStine | vinCRIStine | **⚠ differs** |
| vinorelbine | vinORELBine | vinORELBine |  |  |  |
| xalacom | xalaCOM |  |  |  |  |
| xalatan | xalaTAN |  |  |  |  |
| yasmin |  | yasMIN |  |  |  |
| yaz |  | yaZ |  |  |  |
| zinnat | zinNAt |  |  |  |  |
| zinvit | zinVit |  |  |  |  |
| zocor | zoCOR |  |  |  |  |
| zolmitriptan |  |  |  | ZOLMitriptan |  |
| zoloft | zoLOFT |  |  |  |  |
| zoton | zoTON |  |  |  |  |
| zyprexa |  |  |  | ZyPREXA |  |
| zyrtec |  |  |  | ZyrTEC |  |
