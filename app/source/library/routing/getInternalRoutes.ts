/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import type SvelteRouting from "svelte-routing";

import AccountDeletedPage from "../accounts/AccountDeletedPage.svelte";
import ChangePasswordPage from "../ChangePasswordPage.svelte";
import DiagnosticsPage from "../DiagnosticsPage.svelte";
import GamePage from "../game/GamePage.svelte";
import LogInPage from "../accounts/LogInPage.svelte";
import PointOfInterestPage from "../PointOfInterestPage.svelte";
import PointsOfInterestSettingsPage from "../PointsOfInterestSettingsPage.svelte";
import UserPage from "../UserPage.svelte";
import UsersSettingsPage from "../UsersSettingsPage.svelte";
// import OrganizationSettingsPage from "../OrganizationSettingsPage.svelte";
import ForgotPassword from "../accounts/ForgotPassword.svelte";
import LoggedOutPage from "../accounts/LoggedOutPage.svelte";
import ReportsPage from "../ReportsPage.svelte";
import ResetPassword from "../accounts/ResetPassword.svelte";
import ProfileSettingsPage from "../ProfileSettingsPage.svelte";
import AcceptInvitePage from "../accounts/AcceptInvitePage.svelte";

export type InternalRoute = Pick<SvelteRouting.Route, "component" | "path"> & {
  alternativePath?: SvelteRouting.Route["path"];
  doesNotRequireAuth?: boolean;
  id: string;
  requirementsToExist?: (
    | "not-organization-plan"
    | "organization-plan"
    | "userorganization-is-admin"
  )[];
  title: string;
};

export default function getInternalRoutes(): Record<string, InternalRoute> {
  return {
    acceptInvite: {
      component: AcceptInvitePage,
      doesNotRequireAuth: true,
      id: "acceptInvite",
      path: "/accounts/accept-invite",
      requirementsToExist: ["organization-plan"],
      title: "Accept invite",
    },
    accountDeleted: {
      component: AccountDeletedPage,
      doesNotRequireAuth: false,
      id: "accountDeleted",
      path: "/accounts/deleted",
      requirementsToExist: ["organization-plan"],
      title: "Account deleted",
    },
    changePassword: {
      component: ChangePasswordPage,
      doesNotRequireAuth: false,
      id: "changePassword",
      path: "/settings/profile/change-password",
      requirementsToExist: ["organization-plan"],
      title: "Change password",
    },
    confirmPasswordReset: {
      component: ResetPassword,
      doesNotRequireAuth: true,
      id: "confirmPasswordReset",
      path: "/accounts/confirm-password-reset",
      requirementsToExist: ["organization-plan"],
      title: "Reset password",
    },
    diagnostics: {
      component: DiagnosticsPage,
      doesNotRequireAuth: true,
      id: "diagnostics",
      path: "/diagnostics",
      title: "Diagnostics",
    },
    game: {
      alternativePath: "/",
      component: GamePage,
      id: "game",
      path: "/game",
      title: "Game",
    },
    forgotPassword: {
      component: ForgotPassword,
      doesNotRequireAuth: true,
      id: "forgotPassword",
      path: "/accounts/reset-password",
      requirementsToExist: ["organization-plan"],
      title: "Forgot password",
    },
    loggedOut: {
      component: LoggedOutPage,
      doesNotRequireAuth: true,
      id: "loggedOut",
      path: "/accounts/logged-out",
      requirementsToExist: ["organization-plan"],
      title: "Logged out",
    },
    logIn: {
      component: LogInPage,
      doesNotRequireAuth: true,
      id: "logIn",
      path: "/accounts/log-in",
      requirementsToExist: ["organization-plan"],
      title: "Log in",
    },
    // organization: {
    //   component: OrganizationSettingsPage,
    //   id: "organization",
    //   path: "/settings/organization",
    //   requirementsToExist: ["organization-plan", "userorganization-is-admin"],
    //   title: "Organization",
    // },
    pointOfInterest: {
      component: PointOfInterestPage,
      id: "pointOfInterest",
      path: "/settings/points-of-interest/:mapFeatureId",
      requirementsToExist: ["organization-plan", "userorganization-is-admin"],
      title: "Point of interest",
    },
    pointsOfInterest: {
      component: PointsOfInterestSettingsPage,
      id: "pointsOfInterest",
      path: "/settings/points-of-interest",
      requirementsToExist: ["organization-plan", "userorganization-is-admin"],
      title: "Points of interest",
    },
    profile: {
      component: ProfileSettingsPage,
      id: "profile",
      path: "/settings/profile",
      requirementsToExist: ["organization-plan"],
      title: "Profile",
    },
    statistics: {
      component: ReportsPage,
      id: "reports",
      path: "/reports",
      requirementsToExist: ["organization-plan", "userorganization-is-admin"],
      title: "Reports",
    },
    users: {
      component: UsersSettingsPage,
      id: "users",
      path: "/settings/users",
      requirementsToExist: ["organization-plan", "userorganization-is-admin"],
      title: "Users",
    },
    user: {
      component: UserPage,
      id: "user",
      path: "/settings/users/:userOrganizationId",
      requirementsToExist: ["organization-plan", "userorganization-is-admin"],
      title: "User",
    },
  };
}
