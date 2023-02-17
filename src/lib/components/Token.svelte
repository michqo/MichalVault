<script lang="ts">
  import { onMount } from "svelte";
  import Cookies from 'js-cookie'
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { token } from "../stores";

  onMount(async () => {
    const t = Cookies.get("token");
    if (t == undefined) {
      $token = await trpc($page).fetchToken.query();
      Cookies.set("token", $token);
    } else {
      $token = t;
    }
  });
</script>

<div class="w-full center px-4 py-3 fixed top-0">
  <p class="text-xl font-bold">Your vault code is</p>
  <code class="text-lg underline">{$token}</code>
  <p class="text-sm text-slate-300">With this code you can access your files</p>
</div>
