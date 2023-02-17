<script lang="ts">
  import { onMount } from "svelte";
  import Cookies from "js-cookie";
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { buttonClass, token } from "../stores";

  let newToken = "";

  onMount(async () => {
    const t = Cookies.get("token");
    if (t == undefined) {
      $token = await trpc($page).fetchToken.query();
      Cookies.set("token", $token, { sameSite: "strict" });
    } else {
      $token = t;
    }
  });

  function changeToken() {
    Cookies.set("token", newToken, { sameSite: "strict" });
    $token = newToken;
  }
</script>

<div class="center mt-8 fixed top-0">
  <div>
    <label for="tokenInput" class="text-slate-200 block mb-1 ">Change token</label>
    <div class="flex gap-x-2 mb-3">
      <input
        type="text"
        id="tokenInput"
        placeholder="Token"
        bind:value={newToken}
        class="px-2 py-1 bg-transparent border border-solid border-gray-200 rounded-md focus:outline-none focus:ring"
      />
      <button on:click={changeToken} class="{buttonClass} py-1">Change</button>
    </div>
  </div>
  <p class="text-xl font-bold">Your vault token is</p>
  <code class="text-lg underline select-all">{$token}</code>
  <p class="text-sm text-slate-300">With this token you can access your files</p>
</div>
