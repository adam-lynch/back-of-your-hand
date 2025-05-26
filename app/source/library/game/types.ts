/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

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

// TODO: maybe rename because now there is an API model (and associated TS type) called Round
export type Round = {
  didSetNewDeviceBestScore?: boolean;
  // I couldn't think of a better name
  questions: Question[];
  status: "error" | "ongoing" | "complete";
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

export enum PresetAreaShape {
  Circle = "circle",
  MultiPolygon = "multi-polygon",
  Square = "square",
}
