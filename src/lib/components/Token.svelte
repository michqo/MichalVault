<script lang="ts">
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { token, filesCache, filesPreviewCache } from "../stores";
  import { buttonClass, duration, tokenRegex } from "$lib/constants";
  import { TOKEN_ERROR } from "$lib/errors";
  import { showError } from "./StatusModal.svelte";
  import Input from "./controls/Input.svelte";
  import Accordion from "./controls/Accordion.svelte";

  let newToken = "";
  let redirectToken = "";
  let showChangeToken = false;
  let showRedirectToken = false;

  onMount(async () => {
    const t = localStorage.getItem("token");
    if (t == undefined) {
      $token = await trpc($page).fetchToken.query();
      localStorage.setItem("token", $token);
    } else {
      $token = t;
    }
    newToken = $token;
  });

  function resetCache() {
    $filesCache = undefined;
    $filesPreviewCache = [];
  }

  async function resetToken() {
    $token = await trpc($page).fetchToken.query();
    newToken = $token;
    localStorage.setItem("token", $token);
    resetCache();
  }

  function changeToken() {
    if (!tokenRegex.test(newToken)) {
      showError(TOKEN_ERROR);
      return;
    }
    localStorage.setItem("token", newToken);
    $token = newToken;
    resetCache();
  }
</script>

<div class="w-full center gap-y-2 mt-10">
  <Accordion bind:visible={showChangeToken} label="Change token">
    <div class="w-full pt-4 pb-3" transition:slide={{ duration }}>
      <Input bind:text={newToken}>
        <button on:click={changeToken} class="{buttonClass} py-1">Change</button>
        {#if $token.length < 11}
          <button on:click={resetToken} class="{buttonClass} py-1">Reset</button>
        {/if}
      </Input>
    </div>
  </Accordion>

  <Accordion bind:visible={showRedirectToken} label="Go to vault">
    <div class="w-full pt-4 pb-3" transition:slide={{ duration }}>
      <Input bind:text={redirectToken}>
        <a href="/files/{redirectToken}" class="{buttonClass} py-1">Go</a>
      </Input>
    </div>
  </Accordion>
</div>
