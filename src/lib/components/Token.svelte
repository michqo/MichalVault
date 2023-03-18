<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { token, filesCache, imageCache } from "../stores";
  import { buttonClass, tokenRegex, TOKEN_ERROR } from "../constants";
  import { showError } from "./StatusModal.svelte";

  const inputDivClass = "center md:flex-row md:items-stretch gap-2";
  const labelClass = "text-slate-200 block mb-1";
  const inputClass =
    "w-full px-2 py-2 bg-transparent border border-solid border-gray-200 rounded-md focus:outline-none focus:ring";
  let newToken = "";
  let redirectToken = "";

  onMount(async () => {
    const t = localStorage.getItem("token");
    if (t == undefined) {
      $token = await trpc($page).fetchToken.query();
      localStorage.setItem("token", $token);
    } else {
      $token = t;
    }
  });

  function resetCache() {
    $filesCache = undefined;
    $imageCache = [];
  }

  async function resetToken() {
    newToken = "";
    $token = await trpc($page).fetchToken.query();
    localStorage.setItem("token", $token);
    resetCache();
  }

  function changeToken() {
    console.log(newToken);
    if (!tokenRegex.test(newToken)) {
      showError(TOKEN_ERROR);
      return;
    }
    localStorage.setItem("token", newToken);
    $token = newToken;
    newToken = "";
    resetCache();
  }
</script>

<!-- TODO: Input text with label and optional buttons component -->

<div class="mt-8 md:w-full max-w-xs">
  <div class="w-full">
    <label for="tokenInput" class={labelClass}>Change token</label>
    <div class={inputDivClass}>
      <input
        type="text"
        id="tokenInput"
        placeholder="Token"
        bind:value={newToken}
        class={inputClass}
      />
      <div class="flex gap-2 flex-row">
        <button on:click={changeToken} class="{buttonClass} py-1">Change</button>
        {#if $token.length < 11}
          <button on:click={resetToken} class="{buttonClass} py-1">Reset</button>
        {/if}
      </div>
    </div>
  </div>
  <div class="w-full mt-2">
    <label for="tokenInput2" class={labelClass}>Go to vault</label>
    <div class={inputDivClass}>
      <input
        type="text"
        id="tokenInput2"
        placeholder="Token"
        bind:value={redirectToken}
        class={inputClass}
      />
      <a href="/files/{redirectToken}" class="{buttonClass} py-1">Go</a>
    </div>
  </div>

  <div class="text-center">
    <p class="text-xl font-bold mt-4">Your vault token is</p>
    <code class="text-lg {$token.length != 0 ? 'underline select-all' : ''}"
      >{$token.length != 0 ? $token : "loading..."}</code
    >
    <p class="text-sm text-slate-300 text-center">With this token you can access your files</p>
  </div>
</div>
