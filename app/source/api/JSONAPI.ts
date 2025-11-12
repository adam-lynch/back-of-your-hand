/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import type * as JSONAPI from "jsonapi-typescript";

export type {
  AttributesObject,
  DocWithData,
  DocWithErrors,
  DocWithMeta,
  RelationshipsWithData,
  ResourceIdentifierObject,
} from "jsonapi-typescript";

export interface ToOneRelationship<
  TOptional extends "optional" | "required" = "required",
> extends JSONAPI.RelationshipsWithData {
  data: TOptional extends "optional"
    ? JSONAPI.ResourceIdentifierObject | null
    : JSONAPI.ResourceIdentifierObject;
}

export interface ToManyRelationship extends JSONAPI.RelationshipsWithData {
  data: JSONAPI.ResourceIdentifierObject[];
}

export type ResourceObject<
  TType extends string,
  TAttributes extends JSONAPI.AttributesObject,
  TRelationships extends
    | Record<string, JSONAPI.RelationshipsWithData>
    | undefined = Record<string, JSONAPI.RelationshipsWithData> | undefined,
> = Omit<
  JSONAPI.ResourceObject<TType, TAttributes>,
  "attributes" | "id" | "relationships"
> & {
  attributes: NonNullable<TAttributes>;
  id: string;
  relationships?: TRelationships;
};
