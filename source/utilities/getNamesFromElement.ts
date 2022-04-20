import type { Overpass } from "./types";

const isUsableAlternativeName = (
  alternativeName: string | void,
  mainName: string
): boolean => alternativeName && alternativeName !== mainName;

const getAlternativeName = (
  element: Overpass.Element,
  mainName: string
): { languageCode?: string; name: string } | void => {
  if (isUsableAlternativeName(element.tags["name:ga"], mainName)) {
    return {
      languageCode: "ga",
      name: element.tags["name:ga"],
    };
  }

  if (isUsableAlternativeName(element.tags.old_name, mainName)) {
    return { name: element.tags.old_name };
  }

  if (isUsableAlternativeName(element.tags.loc_name, mainName)) {
    return { name: element.tags.loc_name };
  }
};

// Up to two names
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
