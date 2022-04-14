/*
  Language codes OpenStreetMap may use, ordered by popularity descending. This is
  used to decide which alternative name to show for a street from the OpenStreetMap
  data.

  Sources: 
    - https://en.wikipedia.org/wiki/List_of_languages_by_number_of_native_speakers
    - https://wiki.openstreetmap.org/wiki/Nominatim/Country_Codes
    - https://www.loc.gov/standards/iso639-2/php/code_list.php
  
  "People generally agree on using name:code=* where code is a lowercase language's
  ISO 639-1 alpha2 code (second column), or a lowercase ISO 639-2 code if an ISO 639-1
  code doesn't exist. In addition, some cases require to add a script name to the tag
  according to ISO 15924 name:code-Script=*.", from
  https://wiki.openstreetmap.org/wiki/Multilingual_names

  Note: some languages are missing like Irish, Welsh, Catalan, Serbian, and so on. If
  they are the main name of any street, it'll be fine. If it's the only alternative name,
  it'll use it because it's the only one. If it's not the only alternative name, the
  first one on this list will be used; otherwise it'll be used.
*/

const languages = [
  "zh",
  "es",
  "en",
  "hi",
  "bn",
  "pt",
  "ru",
  "ja",
  "pa",
  "mr",
  "te",
  "tr",
  "ko",
  "fr",
  "de",
  "ta",
  "ur",
  "jv",
  "it",
  "egy",
  "gu",
  "fa",
  "bho",
  "ha",
  "kn",
  "id",
  "pl",
  "yo",
  "ml",
  "mai",
  "my",
  "su",
  "uk",
  "igbo",
  "uz",
  "sd",
  "ar",
  "ro",
  "tl",
  "nl",
  "am",
  "ps",
  "th",
  "km",
  "ne",
  "as",
  "si",
  "ku",
  "az",
  "el",
  "kk",
  "hu",
  "rw",
  "zu",
  "rn",
  "cs",
  "ug",
];

export default languages;
