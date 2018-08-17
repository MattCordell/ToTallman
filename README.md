[![Build status](https://build.appcenter.ms/v0.1/apps/a6be2a99-b1cf-4c56-9d5e-9ab6687020e0/branches/master/badge)](https://appcenter.ms)

# ToTallman
An extension method that will apply specified [Tallman lettering](https://en.wikipedia.org/wiki/Tall_Man_lettering) to any string.
The default parameterless method, is intended to use all "known" Tallman lists.
A single overload exists that allows a specific "known" list to be specified.

ToTallman can be applied anywhere a string is being output.

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





