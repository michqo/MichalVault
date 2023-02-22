<script lang="ts">
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { fly } from "svelte/transition";
  import { duration, loading, confirmVisible, confirmData, confirmResult } from "$lib/stores";
  import { formatBytes, formatDate } from "$lib/utils";

  export let files: [string, Record<string, string>][];

  const today = new Date();
  const thClass = "text-sm py-3 px-2 font-medium text-left";
  const tdClass = "text-sm py-2 px-2 whitespace-nowrap";
  const btnClass = "p-1 rounded hover:bg-white/[.1] focus:ring";
  const imgClass = "w-14 h-14";
  const svgClass = "w-7 h-7";

  // TODO: Faster download
  async function download(key: string, name: string) {
    $loading = true;
    const data = await trpc($page).fetchOne.query({ key });
    const bufferArray = new Uint8Array(data!.data);
    const blob = new Blob([bufferArray]);
    // download file
    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = name;
    $loading = false;
    link.click();
  }

  function deleteFile(key: string) {
    $confirmData = ["delete", key, "delete file"];
    $confirmVisible = true;
  }
  function deleteAll() {
    $confirmData = ["deleteAll", undefined, "delete all files"];
    $confirmVisible = true;
  }

  async function refresh() {
    $loading = true;
    files = await trpc($page).fetchAll.query({ token: $page.params.token });
    $loading = false;
  }

  $: (async () => {
    if ($confirmResult) {
      switch ($confirmData[0]) {
        case "delete":
          const key = $confirmData[1];
          const values = files.filter((value) => value[0] != key);
          files = values;
          await trpc($page).delete.query({ token: $page.params.token, key });
          break;
        case "deleteAll":
          files = [];
          await trpc($page).deleteAll.query({ token: $page.params.token });
          break;
      }
      $confirmResult = false;
    }
  })();
</script>

<div class="center fixed top-0 mt-3">
  <code class="text-lg underline select-all">{$page.params.token}</code>
  <div
    class="flex gap-x-3 mt-1 px-3 py-2 bg-white/[.04] border border-slate-700 rounded-md drop-shadow-xl"
    in:fly={{ y: -100, duration }}
  >
    <a class={btnClass} href="/" title="Go back"
      ><img src="/back.svg" alt="Back" class={imgClass} /></a
    >
    <button class={btnClass} title="Refresh" on:click={refresh}
      ><img src="/sync.svg" alt="Sync" class={imgClass} /></button
    >
    <button class={btnClass} title="Delete all files" on:click={deleteAll}
      ><img src="/delete.svg" alt="Delete" class={imgClass} /></button
    >
  </div>
</div>

<div class="overflow-x-auto w-full p-3 bg-white/[.07] rounded-lg">
  <table class="w-full divide-y divide-gray-500">
    <thead class="uppercase">
      <tr>
        <th scope="col" style="min-width:50px" class={thClass} />
        <th scope="col" class={thClass}> Name </th>
        <th scope="col" class={thClass}> Uploaded </th>
        <th scope="col" class={thClass}> Size </th>
      </tr>
    </thead>
    <tbody>
      {#each files as file}
        <tr class="hover:bg-white/[.07]">
          <td style="min-width:50px" class={tdClass}>
            <button type="button" on:click={() => deleteFile(file[0])}>
              <img src="/delete.svg" alt="Remove" class={svgClass} />
            </button>
          </td>
          <td class={tdClass}>
            <button
              type="button"
              class="hover:underline underline-offset-2"
              on:click={() => download(file[0], file[1].name)}
            >
              {file[1].name}
            </button>
          </td>
          <td class={tdClass}>{formatDate(new Date(parseInt(file[1].date)), today)}</td>
          <td class={tdClass}>{formatBytes(parseInt(file[1].size))}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
