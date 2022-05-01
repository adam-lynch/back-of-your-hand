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

type Result = {
  alternativeName?: string;
  alternativeNameLanguageCode?: string;
  name: string;
};

// Up to two names
export default (element: Overpass.Element): Result => {
  const result: Result = { name: element.tags.name };

  const alternativeNameDetails = getAlternativeName(element, element.tags.name);
  if (alternativeNameDetails) {
    result.alternativeName = alternativeNameDetails.name;
    result.alternativeNameLanguageCode = alternativeNameDetails.languageCode;
  }

  return result;
};
