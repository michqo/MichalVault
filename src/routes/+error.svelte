<script lang="ts">
  import { page } from "$app/stores";
</script>

<div class="flex items-center gap-x-2">
  <h1 class="text-red-500 text-5xl">{$page.status}:</h1>
  <p class="text-2xl">{$page.error?.message}</p>
</div>
