<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { duration, loading, confirmData, confirmResult, filesCache } from "$lib/stores";
  import { formatBytes, formatDate } from "$lib/utils";
  import { showModal } from "./ConfirmModal.svelte";
  import Delete from "$lib/svgs/Delete.svelte";
  import Sync from "$lib/svgs/Sync.svelte";
  import Back from "$lib/svgs/Back.svelte";

  export let files: Record<string, string>[];

  const today = new Date();
  const thClass = "text-sm py-3 px-2 font-medium text-left";
  const tdClass = "text-sm py-2 px-2 whitespace-nowrap";
  const btnClass = "p-1 rounded hover:bg-white/[.1] focus:ring";
  const imgClass = "w-14 h-14";
  const svgClass = "w-7 h-7";

  onMount(() => {
    if (!$filesCache) $filesCache = [new Date(), files];
    if (files.length == 0) files = $filesCache[1];
  });

  // TODO: Faster download
  async function download(key: string, name: string) {
    $loading = true;
    const data = await trpc($page).fetchOne.query({ key });
    const bufferArray = new Uint8Array(data);
    const blob = new Blob([bufferArray]);
    // download file
    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = name;
    $loading = false;
    link.click();
  }

  function deleteFile(key: string) {
    showModal("delete", "delete file", key);
  }
  function deleteAll() {
    showModal("deleteAll", "delete all files");
  }

  async function refresh() {
    $loading = true;
    files = await trpc($page).fetchAll.query({ token: $page.params.token });
    $filesCache = [new Date(), files];
    $loading = false;
  }

  $: (async () => {
    if ($confirmResult) {
      switch ($confirmData[0]) {
        case "delete":
          const key = $confirmData[2];
          const values = files.filter((value) => value.key != key);
          files = values;
          $filesCache = [new Date(), files];
          await trpc($page).delete.query({ token: $page.params.token, key });
          break;
        case "deleteAll":
          files = [];
          $filesCache = [new Date(), files];
          await trpc($page).deleteAll.query({ token: $page.params.token });
          break;
      }
      $confirmResult = false;
    }
  })();
</script>

<div class="center fixed top-0 mt-4">
  {#if $filesCache}
    <p>
      Last refreshed on <span class="font-medium">{formatDate($filesCache[0], new Date())}</span>
    </p>
  {/if}
  <code class="text-lg underline select-all">{$page.params.token}</code>
  <div
    class="flex gap-x-3 mt-1 px-3 py-2 bg-white/[.04] border border-slate-700 rounded-md drop-shadow-xl"
    in:fly={{ y: -100, duration }}
  >
    <a class={btnClass} href="/" title="Go back"><Back class={imgClass} /></a>
    <button class={btnClass} title="Refresh" on:click={refresh}><Sync class={imgClass} /></button>
    <button class={btnClass} title="Delete all files" on:click={deleteAll}
      ><Delete class={imgClass} /></button
    >
  </div>
</div>

<h1 class="text-center font-medium text-3xl mb-2">Files</h1>
<div
  class="overflow-x-auto w-full p-3 bg-white/[.07] border border-slate-700 rounded-lg"
  in:fade={{ duration }}
>
  <table class="w-full divide-y divide-gray-500">
    <thead class="uppercase">
      <tr>
        <th scope="col" class={thClass} />
        <th scope="col" class={thClass}> Name </th>
        <th scope="col" class={thClass}> Uploaded </th>
        <th scope="col" class={thClass}> Size </th>
      </tr>
    </thead>
    <tbody>
      {#each files as file}
        <tr class="hover:bg-white/[.07]">
          <td class={tdClass}>
            <button type="button" on:click={() => deleteFile(file.key)}>
              <Delete class={svgClass} />
            </button>
          </td>
          <td class={tdClass}>
            <button
              type="button"
              class="hover:underline underline-offset-2"
              on:click={() => download(file.key, file.name)}
            >
              {file.name}
            </button>
          </td>
          <td class={tdClass}>{formatDate(new Date(file.date), today)}</td>
          <td class={tdClass}>{formatBytes(parseInt(file.size))}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
