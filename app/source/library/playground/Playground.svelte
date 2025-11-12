<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import { Link } from "svelte-routing";
  import PlaygroundPage from "./PlaygroundPage.svelte";
</script>

<PlaygroundPage title="Playground">
  <ul>
    <li><Link to="/playground/auto-saving-fields">Auto-saving fields</Link></li>
    <li><Link to="/playground/button">Button</Link></li>
    <li><Link to="/playground/checkbox">Checkbox</Link></li>
    <li><Link to="/playground/text-input">TextInput</Link></li>
    <li><Link to="/playground/select-input">SelectInput</Link></li>
    <li><Link to="/playground/form">Form</Link></li>
  </ul>
</PlaygroundPage>

<style>
</style>
