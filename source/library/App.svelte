<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { onMount } from "svelte";
  import * as svelteStore from "svelte/store";
  import { Router, Route } from "svelte-routing";

  import FatalErrorDisplay from "./FatalErrorDisplay.svelte";

  import { isLoggedIn, isOrganizationUrl } from "./../userData/store";
  import authController from "./../userData/authController";
  import { navigate } from "svelte-routing";
  import getInternalRoutes from "./routing/getInternalRoutes";
  import fetchUserOrganizationWithAllIncludes from "../userData/fetchUserOrganizationWithAllIncludes";
  import { setUserData } from "../userData/storeActions";
  import getCurrentInternalRoute from "./routing/getCurrentInternalRoute";
  import RouteWrapper from "./routing/RouteWrapper.svelte";
  import fetchAreas from "../userData/fetchAreas";
  import ComponentsPlayground from "./playground/Playground.svelte";
  import ButtonPlayground from "./playground/ButtonPlayground.svelte";
  import SelectInputPlayground from "./playground/SelectInputPlayground.svelte";
  import TextInputPlayground from "./playground/TextInputPlayground.svelte";
  import FormPlayground from "./playground/FormPlayground.svelte";
  import AutoSavingFieldsPlayground from "./playground/AutoSavingFieldsPlayground.svelte";
  import RouteGuard from "./routing/RouteGuard.svelte";
  import { ClientRequestError } from "../api/requestApi";

  export let unhandledError: Error | null = null;
  export let url = "";

  const internalRoutes = getInternalRoutes();

  async function retrieveUserData() {
    try {
      const apiResponse = await fetchUserOrganizationWithAllIncludes();
      setUserData(apiResponse);

      // Populates store and other stuff uses it
      fetchAreas({});
    } catch (error) {
      console.error(error);
      setUserData(null);
      if (
        error instanceof ClientRequestError &&
        error.response.status === 401
      ) {
        return;
      }
      // TODO: handle offline here?
      // TODO: remove?
      throw error;
    }
  }

  onMount(() => {
    const unsubscribers: (() => void)[] = [];

    if ($isOrganizationUrl) {
      authController.init();

      const currentInternalRoute = getCurrentInternalRoute();
      const doesCurrentInternalRouteRequireAuth =
        currentInternalRoute && !currentInternalRoute.doesNotRequireAuth;

      if (
        svelteStore.get(isLoggedIn) === false &&
        doesCurrentInternalRouteRequireAuth
      ) {
        navigate(internalRoutes.logIn.path, { replace: false });
      }

      unsubscribers.push(
        isLoggedIn.subscribe(async (value) => {
          if (!$isOrganizationUrl) {
            return;
          }

          if (value === true) {
            await retrieveUserData();
          }
        }),
      );
    }

    return () => {
      for (const unsubscriber of unsubscribers) {
        unsubscriber();
      }
    };
  });
</script>

<Router {url}>
  {#if unhandledError}
    <FatalErrorDisplay error={unhandledError} />
  {:else}
    <RouteWrapper>
      <Route
        path="/"
        component={internalRoutes.game.component}
      />
      <Route
        path="/geo-lookup-done"
        component={internalRoutes.game.component}
      />
      {#each Object.values(internalRoutes) as internalRoute}
        <Route
          path={internalRoute.path}
          let:params
        >
          <RouteGuard {internalRoute}>
            <svelte:component
              this={internalRoute.component}
              routePathParameters={params}
            />
          </RouteGuard>
        </Route>
      {/each}
      {#if import.meta.env.DEV}
        <Route
          path="/playground"
          component={ComponentsPlayground}
        />
        <Route
          path="/playground/auto-saving-fields"
          component={AutoSavingFieldsPlayground}
        />
        <Route
          path="/playground/button"
          component={ButtonPlayground}
        />
        <Route
          path="/playground/form"
          component={FormPlayground}
        />
        <Route
          path="/playground/select-input"
          component={SelectInputPlayground}
        />
        <Route
          path="/playground/text-input"
          component={TextInputPlayground}
        />
      {/if}
    </RouteWrapper>
  {/if}
</Router>

<style>
</style>
