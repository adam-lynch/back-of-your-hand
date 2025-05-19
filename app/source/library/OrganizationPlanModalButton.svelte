<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2025 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import Button from "./forms/Button.svelte";
  import OrganizationPlanModal from "./OrganizationPlanModal.svelte";
</script>

<OrganizationPlanModal>
  <Button
    builders={[builder]}
    let:builder
    size="small"
    slot="trigger"
  >
    Train on your real response area
  </Button>
</OrganizationPlanModal>
