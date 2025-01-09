<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import getInternalRoutes from "./routing/getInternalRoutes";
  import Page from "./Page.svelte";
  import ResourceListInfiniteScrollTable from "./ResourceListInfiniteScrollTable.svelte";
  import prettifyDate from "./utilities/prettifyDate";
  import makePercentage from "./utilities/makePercentage";
  import prettifyUserName from "../utilities/prettifyUserName";
  import api, { type FetchResourceListOptions } from "../api";
  import type { Area, Round, User } from "../api/resourceObjects";
  import SelectInput from "./forms/SelectInput.svelte";
  import { areas } from "../userData/store";
  import { derived, writable } from "svelte/store";
  import { onMount } from "svelte";
  import usersSort from "./utilities/usersSort";
  import makeDateRange from "../utilities/makeDateRange";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const castRowData = (input: any) =>
    input as unknown as Round & {
      relationships: {
        area: {
          data: Area;
        };
        user: {
          data: User;
        };
      };
    };

  const internalRoute = getInternalRoutes().statistics;

  const areaFilterOptions = derived([areas], ([$areas]) => {
    const results = [
      {
        label: "All",
        value: "all",
      },
    ];
    if ($areas) {
      results.push(
        ...$areas.map((area) => ({
          label: area.attributes.name,
          value: area.id,
        })),
      );
    }
    return results;
  });
  const areaFilterSelectedOption = writable($areaFilterOptions[0].value);

  const users = writable<User[]>([]);
  onMount(async () => {
    const result = await api.fetchResourceList<User>("user", {
      page: {
        size: 500,
      },
      sort: usersSort,
    });
    users.set(result.data);
  });

  const userFilterOptions = derived([users], ([$users]) => {
    const results = [
      {
        label: "All",
        value: "all",
      },
    ];
    results.push(
      ...$users.map((user) => ({
        label: prettifyUserName(user),
        value: user.id,
      })),
    );
    return results;
  });
  const userFilterSelectedOption = writable($userFilterOptions[0].value);

  const dateFilterOptions = [
    {
      label: "Any",
      value: "any",
    },
    {
      label: "Today",
      value: "today",
    },
    {
      label: "Yesterday",
      value: "yesterday",
    },
    {
      label: "This week",
      value: "this-week",
    },
    {
      label: "Last week",
      value: "last-week",
    },
    {
      label: "This month",
      value: "this-month",
    },
    {
      label: "Last month",
      value: "last-month",
    },
  ];
  const dateFilterSelectedOption = writable<
    (typeof dateFilterOptions)[0]["value"]
  >(dateFilterOptions[0].value);

  const fetchResourceList = derived(
    [userFilterSelectedOption],
    ([$userFilterSelectedOption]) =>
      (options: FetchResourceListOptions) => {
        const filterOptions: Record<string, string> = {};

        if ($areaFilterSelectedOption !== "all") {
          filterOptions["area.id"] = $areaFilterSelectedOption;
        }
        if ($userFilterSelectedOption !== "all") {
          filterOptions["user.id"] = $userFilterSelectedOption;
        }
        const dateRange = makeDateRange($dateFilterSelectedOption);
        if (dateRange?.start) {
          filterOptions["createdAt.gte"] = dateRange.start;
        }
        if (dateRange?.end) {
          filterOptions["createdAt.lte"] = dateRange.end;
        }

        return api.fetchResourceList<Round>("round", {
          ...options,
          filter: filterOptions,
          include: ["area", "user"],
          sort: [
            {
              name: "createdAt",
              direction: "descending",
            },
          ],
        });
      },
  );
</script>

<Page {internalRoute}>
  <div class="reports page__main-scrollable">
    <div class="reports__header page__title-wrapper">
      <h1>{internalRoute.title}</h1>

      <aside class="reports__filters">
        <div class="reports__filter">
          <label
            class="reports__filter-label"
            for="user-filter">User</label
          >
          <SelectInput
            bind:value={$userFilterSelectedOption}
            class="reports__filter-control"
            id="user-filter"
            name="user-filter"
            options={$userFilterOptions}
          />
        </div>

        <div class="reports__filter">
          <label
            class="reports__filter-label"
            for="area-filter">Area</label
          >
          <SelectInput
            bind:value={$areaFilterSelectedOption}
            class="reports__filter-control"
            id="area-filter"
            name="area-filter"
            options={$areaFilterOptions}
          />
        </div>

        <div class="reports__filter">
          <label
            class="reports__filter-label"
            for="area-filter">Date</label
          >
          <SelectInput
            bind:value={$dateFilterSelectedOption}
            class="reports__filter-control"
            id="date-filter"
            name="date-filter"
            options={dateFilterOptions}
          />
        </div>
      </aside>
    </div>

    {#key $areaFilterSelectedOption + $dateFilterSelectedOption + $userFilterSelectedOption}
      <ResourceListInfiniteScrollTable
        class="reports__content"
        columns={[
          {
            formatValue: prettifyDate,
            maxWidth: "0.5fr",
            name: "Date",
            propertyPath: "attributes.createdAt",
          },
          { name: "User" },
          {
            name: "Area",
            propertyPath: "relationships.area.data.attributes.name",
            formatValue: (input) => input || "Custom",
          },
          {
            formatValue: (input) => makePercentage(parseFloat(input)),
            maxWidth: "0.33fr",
            name: "Score",
            propertyPath: "attributes.score",
          },
          {
            maxWidth: "0.8fr",
            name: "Question amount",
            propertyPath: "attributes.questionAmount",
          },
        ]}
        fetchResourceList={$fetchResourceList}
      >
        <td
          let:column
          let:defaultValue
          let:rowData
          slot="body-cell"
        >
          {#if column.name === "User"}
            {prettifyUserName(castRowData(rowData).relationships.user.data)}
          {:else}
            {defaultValue}
          {/if}
        </td>
      </ResourceListInfiniteScrollTable>
    {/key}
  </div>
</Page>

<style>
  :global(.reports) {
    padding-bottom: 2rem;
  }

  :global(.reports__header) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding-top: 1rem;
    padding-inline: var(--page-content-padding-horizontal);

    @media (min-height: 900px) {
      padding-top: 2rem;
      margin-bottom: 3rem;
    }
  }

  :global(.reports__filters) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem 0.5rem;
    font-size: 0.9rem;

    @media (min-height: 900px) {
      gap: 2rem;
    }
  }

  :global(.reports__filter) {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }

  :global(.reports__filter-control) {
    min-width: 200px;
    max-width: 200px;
  }

  :global(.reports__content) {
    padding-inline: var(--page-content-padding-horizontal);
  }
</style>
