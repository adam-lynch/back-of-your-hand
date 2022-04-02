import type Leaflet from "leaflet";

export type LatLng = {
  lat: number;
  lng: number;
};
export type Coordinates = number[];

export type Question = {
  street: {
    alternativeName?: string;
    name: string;
    points: LatLng[][];
    width?: number;
  };
  distance?: {
    amount: number;
    unit: string;
  };
  index: number;
  score?: number;
  status: "pending" | "ongoing" | "complete" | "skipped";
};

export type Round = {
  areaBounds: Leaflet.LatLngBounds;
  didSetNewDeviceBestScore?: boolean;
  // I couldn't think of a better name
  questions: Question[];
  seed: string;
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

export namespace Overpass {
  export type LatLng = {
    lat: number;
    lon: number;
  };

  export type Element = {
    geometry: LatLng[];
    id: number;
    tags: {
      name: string;
      "name:ga"?: string;
      width?: string;
    };
  };

  export type Response = {
    elements: Element[];
  };
}
