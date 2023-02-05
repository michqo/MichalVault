<script lang="ts">
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { fly } from "svelte/transition";
  import { files, filesVisible, loading } from "$lib/stores";
  import { formatBytes, formatDate } from "$lib/utils";

  const today = new Date();
  const thClass = "text-sm font-medium px-4 py-2 text-left";
  const tdClass = "text-sm font-light px-4 py-2 whitespace-nowrap";
  const imgClass = "w-14 h-14";
  const svgClass = "w-7 h-7 mr-2 cursor-pointer";

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

  async function deleteFile(key: string) {
    await trpc($page).delete.query({ key });
  }

  async function deleteAll() {
    await trpc($page).deleteAll.query();
  }
</script>

<div
  class="flex gap-x-3 fixed top-0 mt-10 px-3 py-2 border border-slate-500 bg-gray-800 rounded-xl drop-shadow-xl"
  in:fly={{ y: -100, duration: 220 }}
>
  <button title="Go back" on:click={() => ($filesVisible = false)}
    ><img src="/back.svg" alt="Back" class={imgClass} /></button
  >
  <button title="Delete all files" on:click={deleteAll}
    ><img src="/delete.svg" alt="Delete" class={imgClass} /></button
  >
</div>

<table class="overflow-x-auto divide-y divide-gray-700 w-full">
  <thead class="uppercase">
    <tr>
      <th scope="col" class={thClass}> Name </th>
      <th scope="col" class={thClass}> Uploaded </th>
      <th scope="col" class={thClass}> Size </th>
    </tr>
  </thead>
  <tbody>
    {#each $files as file}
      <tr class="border-b border-gray-700 hover:bg-gray-700">
        <td class="flex items-center {tdClass}">
          <button type="button" on:click={() => download(file[0], file[1].name)}>
            <img src="/download.svg" alt="Download" class={svgClass} />
          </button>
          <button type="button" on:click={() => deleteFile(file[0])}>
            <img src="/delete.svg" alt="Remove" class={svgClass} />
          </button>
          {file[1].name}
        </td>
        <td class={tdClass}>{formatDate(new Date(parseInt(file[1].date)), today)}</td>
        <td class={tdClass}>{formatBytes(parseInt(file[1].size))}</td>
      </tr>
    {/each}
  </tbody>
</table>
