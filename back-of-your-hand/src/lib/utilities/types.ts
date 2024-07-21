import type Leaflet from "leaflet";

export type LatLng = {
  lat: number;
  lng: number;
};
export type PotentiallyNestedLatLngs = (LatLng | (LatLng | LatLng[])[])[];
export type Coordinates = [number, number];
export type PotentiallyNestedCoordinates = (
  | Coordinates
  | (Coordinates | Coordinates[])[]
)[];

export type Question = {
  distance?: {
    amount: number;
    unit: string;
  };
  index: number;
  score?: number;
  status: "pending" | "ongoing" | "complete" | "skipped";
  target: {
    alternativeName?: string | void;
    alternativeNameLanguageCode?: string | void;
    isEnclosedArea: boolean;
    name: string;
    points: LatLng[][];
    width?: number;
  };
};

export type Round = {
  areaBounds: Leaflet.LatLngBounds;
  didSetNewDeviceBestScore?: boolean;
  // I couldn't think of a better name
  questions: Question[];
  status: "error" | "ongoing" | "complete";
};

export type State = {
  areaBounds?: Leaflet.LatLngBounds;
  isAreaConfirmed?: boolean;
  chosenPoint?: LatLng;
  isChosenPointConfirmed?: boolean;
  isLoading?: boolean;
  round?: Round;
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Overpass {
  export type LatLng = {
    lat: number;
    lon: number;
  };

  export type Element = {
    geometry: LatLng[];
    id: number;
    tags: {
      access?: string;
      area?: string;
      highway?: string;
      loc_name?: string;
      name: string;
      "name:ga"?: string;
      old_name?: string;
      width?: string;
    };
  };

  export type Response = {
    elements: Element[];
  };
}

export enum Difficulty {
  Tourist = "tourist",
  Resident = "resident",
  TaxiDriver = "taxi-driver",
}
