/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import type * as GeoJSON from "geojson";
import type * as JSONAPI from "./JSONAPI";
import type { Overpass } from "../library/game/types";

// These value types are more narrow than what JSON:API allows
type AttributeValue = boolean | number | object | string | AttributeValue[];
type OptionalAttributeValue<TValue extends AttributeValue> = TValue | null;

interface TimestampedResourceAttributes extends JSONAPI.AttributesObject {
  createdAt: string;
  deletedAt: OptionalAttributeValue<string>;
  lastUpdatedAt: string;
}

export type AnyResourceObject =
  | Area
  | AreaOverpassData
  | Organization
  | Round
  | User
  | UserOrganization;

export type Area = JSONAPI.ResourceObject<
  "area",
  TimestampedResourceAttributes & {
    name: string;
    shape: GeoJSON.MultiPolygon;
  },
  {
    parentArea: JSONAPI.ToOneRelationship<"optional">;
  }
>;

export type AreaOverpassData = JSONAPI.ResourceObject<
  "areaoverpassdata",
  TimestampedResourceAttributes & {
    responseBody: Overpass.Response;
  },
  {
    area: JSONAPI.ToOneRelationship;
  }
>;

export type OmitTimestampedResourceAttributes<T extends AnyResourceObject> =
  Omit<T, "attributes"> & {
    attributes: Omit<T["attributes"], keyof TimestampedResourceAttributes>;
  };

export type Organization = JSONAPI.ResourceObject<
  "organization",
  TimestampedResourceAttributes & {
    difficulties: {
      id: string;
    }[];
    location: OptionalAttributeValue<string>;
    logo: OptionalAttributeValue<string>;
    name: string;
    questionsPerRoundLimit: OptionalAttributeValue<number>;
  }
>;

export type Round = JSONAPI.ResourceObject<
  "round",
  TimestampedResourceAttributes & {
    extra: OptionalAttributeValue<AttributeValue>;
    questionAmount: number;
    score: number;
    status: "abandoned" | "completed" | "errored" | "ongoing";
  },
  {
    area: JSONAPI.ToOneRelationship<"optional">;
    userorganization: JSONAPI.ToOneRelationship;
  }
>;

export type User = JSONAPI.ResourceObject<
  "user",
  TimestampedResourceAttributes & {
    email: string;
    firstName: string;
    lastLogin: OptionalAttributeValue<string>;
    isActive: boolean;
    isStaff: boolean;
    isSuperuser: boolean;
    lastName: string;
  }
>;

export type UserOrganization = JSONAPI.ResourceObject<
  "userOrganization",
  TimestampedResourceAttributes & {
    inviteIssuedAt: string | null;
    inviteStatus: "accepted" | "invited" | "uninvited";
    inviteTokenMaxAge: number;
    inviteUserEmail: string;
    inviteUserFirstName: string;
    inviteUserLastName: string;
    jobTitle: OptionalAttributeValue<string>;
    role: "admin" | "standard";
  },
  {
    organization: JSONAPI.ToOneRelationship;
    user: JSONAPI.ToOneRelationship<"optional">;
  }
>;
