<script lang="ts">
  import { page } from "$app/stores";
</script>

<div class="fixed w-full h-full flex items-center justify-center gap-x-2">
  <h1 class="text-red-500 text-5xl">{$page.status}:</h1>
  <p class="text-2xl">{$page.error?.message}</p>
</div>
