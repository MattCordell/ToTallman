> [!WARNING]
> **Major Refactor in Progress (v2.0.0)**
> This repository is undergoing a complete rewrite for multi-language support and to address outstanding test cases. Work is tracked in [GitHub issues](https://github.com/MattCordell/ToTallman/issues). The content below the divider describes the current (v1) API and will be updated when v2 ships.

## v2.0.0 Progress

| Phase | Status |
|-------|--------|
| 1. Foundation (data format + validation) | ✅ Complete |
| 2. Canonical test suite | ✅ Complete |
| 3. C# implementation | ✅ Complete — 84/84 canonical, 102/102 native |
| 4. Multi-language (Python → JS → Java) | ⏳ Next — [#13](https://github.com/MattCordell/ToTallman/issues/13) |
| 5. CI/CD | ⏳ Planned — [#14](https://github.com/MattCordell/ToTallman/issues/14) |
| 6. Documentation & release | ⏳ Planned — [#15](https://github.com/MattCordell/ToTallman/issues/15) |

Detailed, up-to-date work lives in [GitHub issues](https://github.com/MattCordell/ToTallman/issues).

### v2 Goals
- **Byte-identical output** across C#, Python, JavaScript/TypeScript, and Java from a shared canonical dataset
- **100% canonical test pass** in every language
- Whole-word, Unicode-safe, punctuation-aware matching, with multi-word and hyphenated drug support
- Build-time embedding (zero runtime I/O)
- Example apps and documentation for each language

------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------

# ToTallman
An extension method that will apply specified [Tallman lettering](https://en.wikipedia.org/wiki/Tall_Man_lettering) to any string.
The default parameterless method, is intended to use all "known" Tallman lists.
A single overload exists that allows a specific "known" list to be specified.

ToTallman can be applied anywhere a string is being output.

```C#
  var d = "This drug is norfloxacin";
  Console.WriteLine("{0} => {1}", d, d.ToTallman();  // To use the default list
  Console.WriteLine("{0} => {1}", d, d.ToTallman(Tallman.List.AU)); //To specifiy a particular list
  
  //Outputs:
  //    This drug is norfloxacin => This drug is NORfloxacin
```

Built with [.Net Standard 1.0](http://immo.landwerth.net/netstandard-versions/#), so it'll run on wherever .Net runs!

There is effectively zero impact on UI performance.[link to performance metrics - coming soon]

The algorithm is essentially a case insensitive Regex replacement for target words. Only words that match will be replaced.[link for ports - coming soon]


Planned lists for inclusion are
* [Australia](https://www.safetyandquality.gov.au/wp-content/uploads/2018/01/National-Tall-Man-Lettering-List-Nov-2017.pdf)
* [US](https://www.ismp.org/sites/default/files/attachments/2017-11/tallmanletters.pdf) FDA/ISMP distinction to be determined.
* [New Zealand](https://www.hqsc.govt.nz/our-programmes/medication-safety/projects/tall-man-lettering/)
* [Canada](https://www.ismp-canada.org/download/TALLman/Principles_for_the_Application_of_TALLman_Lettering_in_Canada.pdf)

If you want to see additional lists supported, please [raise an issue](https://github.com/MattCordell/ToTallman/issues/new) and at least provide some authoritative reference

Additional References:

http://www.waltersmedical.co.uk/uploads/u29108/File/tall_man_~_ku_~_v3_i3.pdf
https://www.ismp.org/resources/special-edition-tall-man-lettering-ismp-updates-its-list-drug-names-tall-man-letters
http://www.ismp.org/recommendations/tall-man-letters-list

Comparison of known lists to also be described on the wiki (eventually).





