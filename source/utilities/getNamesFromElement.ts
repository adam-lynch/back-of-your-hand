import languages from "./languages";
import type { Overpass } from "./types";

const isUsableAlternativeName = (
  alternativeName: string | void,
  mainName: string
): boolean => alternativeName && alternativeName !== mainName;

const getAlternativeName = (
  element: Overpass.Element,
  mainName: string
): { languageCode: string; name: string } | void => {
  const tagEntries = Object.entries(element.tags);

  for (const languageCode of languages) {
    const nameTagProperty = `name:${languageCode}`;
    const nameTagValue = element.tags[nameTagProperty];
    if (isUsableAlternativeName(nameTagValue, mainName)) {
      return {
        languageCode,
        name: nameTagValue,
      };
    }

    for (const [tagName, value] of tagEntries) {
      if (
        tagName.startsWith(`${nameTagProperty}-`) &&
        isUsableAlternativeName(value, mainName)
      ) {
        return {
          languageCode,
          name: value,
        };
      }
    }
  }

  for (const [tagName, value] of tagEntries) {
    if (
      tagName.startsWith("name:") &&
      isUsableAlternativeName(value, mainName)
    ) {
      return {
        languageCode: tagName.match(/^name:([a-z]+)/)[1].toLowerCase(),
        name: value,
      };
    }
  }
};

// Up to two names
// TODO: street-sign--alternative-name-on-top
export default (
  element: Overpass.Element
): {
  alternativeName: string | void;
  alternativeNameLanguageCode: string | void;
  name: string;
} => {
  const alternativeNameDetails = getAlternativeName(element, element.tags.name);
  return {
    alternativeName: alternativeNameDetails?.name,
    alternativeNameLanguageCode: alternativeNameDetails?.languageCode,
    name: element.tags.name,
  };
};
