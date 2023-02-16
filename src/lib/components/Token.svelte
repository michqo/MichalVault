<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { loading, token } from "../stores";

  onMount(async () => {
    $loading = true;
    const t = localStorage.getItem("token");
    if (t == null) {
      $token = await trpc($page).fetchToken.query();
      localStorage.setItem("token", $token);
    } else {
      $token = t;
    }
    $loading = false;
  });
</script>

<div class="w-full center px-4 py-3 fixed top-0">
  <p class="text-xl font-bold">Your vault code is</p>
  <code class="text-lg underline">{$token}</code>
  <p class="text-sm text-slate-300">With this code you can access your files</p>
</div>
