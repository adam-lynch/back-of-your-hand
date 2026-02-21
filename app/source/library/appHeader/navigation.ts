/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import { derived } from "svelte/store";
import {
  isOrganizationUrl,
  userOrganizationIsAdmin,
} from "../../userData/store";
import type { InternalRoute } from "../routing/getInternalRoutes";
import getInternalRoutes from "../routing/getInternalRoutes";
import validateInternalRouteRequirementsToExist from "../routing/validateInternalRouteRequirementsToExist";
import type { ComponentType } from "svelte";
import ComplianceIcon from "~icons/mdi/file-document-check-outline";
import GameIcon from "~icons/mdi/map-marker";
import HelpIcon from "~icons/mdi/help";
import PointsOfInterestIcon from "~icons/mdi/map-marker-plus";
import PrivacyIcon from "~icons/iconoir/privacy-policy";
import ProfileIcon from "~icons/mdi/user";
import ReportsIcon from "~icons/mdi/report-timeline-variant";
import SettingsIcon from "~icons/mdi/settings";
import UsersIcon from "~icons/mdi/users";
import ContactButton from "../ContactButton.svelte";

export type NavigationItem = {
  childItems?: NavigationItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component?: any; // Svelte component
  componentProps?: Record<string, unknown>;
  externalPath?: string;
  Icon?: ComponentType;
  id?: string;
  internalRoute?: InternalRoute;
  shouldHaveContinueQueryParameter?: boolean;
  title?: string;
  titleHiddenButAccessibleSuffix?: string;
} & Pick<InternalRoute, "requirementsToExist">;

export default derived(
  [isOrganizationUrl, userOrganizationIsAdmin],
  ([$isOrganizationUrl, $userOrganizationIsAdmin]): NavigationItem[] => {
    function filterNavigationItemsByRequirementsToExist(
      items: NavigationItem[],
    ): NavigationItem[] {
      const context = {
        isOrganizationUrl: $isOrganizationUrl,
        userOrganizationIsAdmin: $userOrganizationIsAdmin,
      };

      return items.filter((item) => {
        return (
          validateInternalRouteRequirementsToExist(item, context) &&
          (!item.internalRoute ||
            validateInternalRouteRequirementsToExist(
              item.internalRoute,
              context,
            ))
        );
      });
    }

    const internalRoutes = getInternalRoutes();

    return filterNavigationItemsByRequirementsToExist([
      {
        Icon: GameIcon,
        internalRoute: internalRoutes.game,
      },
      {
        Icon: ReportsIcon,
        internalRoute: internalRoutes.statistics,
      },
      {
        childItems: filterNavigationItemsByRequirementsToExist([
          {
            childItems: filterNavigationItemsByRequirementsToExist([
              {
                Icon: ProfileIcon,
                internalRoute: internalRoutes.profile,
              },
              // {
              //   internalRoute: internalRoutes.organization,
              // },
              {
                Icon: PointsOfInterestIcon,
                internalRoute: internalRoutes.pointsOfInterest,
              },
              {
                Icon: UsersIcon,
                internalRoute: internalRoutes.users,
              },
            ]),
            Icon: SettingsIcon,
            id: "settings",
            internalRoute: internalRoutes.profile,
            title: "Settings",
          },
          {
            Icon: HelpIcon,
            id: "learn-more",
            externalPath: "/learn-more",
            shouldHaveContinueQueryParameter: true,
            title: "Learn more",
            titleHiddenButAccessibleSuffix: "(how to play, etc)",
          },
          {
            Icon: ComplianceIcon,
            id: "terms-of-service",
            externalPath: "/terms-of-service",
            title: "Terms of service",
          },
          {
            Icon: PrivacyIcon,
            id: "privacy-policy",
            externalPath: "/privacy",
            title: "Privacy policy",
          },
          {
            Component: ContactButton,
            componentProps: {
              title: "Send feedback",
              username: "&#x68;&#x65;&#x6C;&#x6C;&#x6F;",
            },
            id: "contact-support--not-organization-plan",
            requirementsToExist: ["not-organization-plan"],
            title: "Send feedback",
          },
          {
            Component: ContactButton,
            id: "contact-support--organization-plan",
            requirementsToExist: ["organization-plan"],
            title: "Contact support",
          },
          {
            id: "log-out",
            title: "Log out",
          },
        ]),
        id: "profile",
        requirementsToExist: ["organization-plan"],
        title: "Settings",
      },
      {
        Icon: HelpIcon,
        id: "learn-more-not-organization-plan",
        externalPath: "/learn-more",
        requirementsToExist: ["not-organization-plan"],
        shouldHaveContinueQueryParameter: true,
        title: "Learn more",
        titleHiddenButAccessibleSuffix: "(how to play, etc)",
      },
      {
        Icon: ComplianceIcon,
        id: "terms-of-service-not-organization-plan",
        externalPath: "/terms-of-service",
        requirementsToExist: ["not-organization-plan"],
        title: "Terms of service",
      },
      {
        Icon: PrivacyIcon,
        id: "privacy-poicy-not-organization-plan",
        externalPath: "/privacy",
        requirementsToExist: ["not-organization-plan"],
        title: "Privacy policy",
      },
    ]);
  },
);
