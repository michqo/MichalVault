<script lang="ts">
  import { onMount } from "svelte";
  import { dev } from "$app/environment";
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { token, filesCache } from "../stores";
  import { buttonClass, tokenRegex, TOKEN_ERROR } from "../constants";
  import { showError } from "./StatusModal.svelte";

  let newToken = "";

  onMount(async () => {
    const t = localStorage.getItem("token");
    if (t == undefined) {
      $token = await trpc($page).fetchToken.query();
      localStorage.setItem("token", $token);
    } else {
      $token = t;
    }
  });

  async function resetToken() {
    newToken = "";
    $token = await trpc($page).fetchToken.query();
    localStorage.setItem("token", $token);
    $filesCache = undefined;
  }

  function changeToken() {
    if (!tokenRegex.test(newToken)) {
      showError(TOKEN_ERROR);
      return;
    }
    localStorage.setItem("token", newToken);
    $token = newToken;
    $filesCache = undefined;
  }
</script>

<div class="center mt-8">
  {#if dev}
    <div>
      <label for="tokenInput" class="text-slate-200 block mb-1 ">Change token</label>
      <div class="center md:flex-row gap-2 mb-2">
        <input
          type="text"
          id="tokenInput"
          placeholder="Token"
          bind:value={newToken}
          class="px-2 py-2 bg-transparent border border-solid border-gray-200 rounded-md focus:outline-none focus:ring"
        />
        <div>
          <button on:click={changeToken} class="{buttonClass} py-1">Change</button>
          {#if $token.length < 11}
            <button on:click={resetToken} class="{buttonClass} py-1">Reset</button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
  <p class="text-xl font-bold">Your vault token is</p>
  <code class="text-lg {$token.length != 0 ? 'underline select-all' : ''}"
    >{$token.length != 0 ? $token : "loading..."}</code
  >
  <p class="text-sm text-slate-300">With this token you can access your files</p>
</div>
