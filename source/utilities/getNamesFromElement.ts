import countries from "./countries";
import type { Overpass } from "./types";

// Up to two names, ordered by preference in country
export default (element: Overpass.Element, countryCode?: string): string[] => {
  const results = [element.tags.name];

  if (countryCode) {
    const possibleLanguageCodes = countries[countryCode];
    if (possibleLanguageCodes?.length) {
      const alternativeNameLanguageCode = possibleLanguageCodes.find(
        (languageCode: string) =>
          element.tags[`name:${languageCode}`] &&
          element.tags[`name:${languageCode}`] !== element.tags.name
      );
      if (alternativeNameLanguageCode) {
        results.push(element.tags[`name:${alternativeNameLanguageCode}`]);
      }
    }
  }

  return results;
};
