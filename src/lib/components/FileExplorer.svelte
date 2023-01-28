<script lang="ts">
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { fly } from "svelte/transition";
  import { files, filesVisible } from "$lib/stores";

  const today = new Date();
  const thClass = "text-sm font-medium px-4 py-2 text-left";
  const tdClass = "text-sm font-light px-4 py-2 whitespace-nowrap";
  const imgClass = "w-14 h-14";

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  // TODO: Faster download
  const download = async (key: string, name: string) => {
    const data = await trpc($page).fetchOne.query({ key });
    const bufferArray = new Uint8Array(data!.data);
    const blob = new Blob([bufferArray]);
    // download file
    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = name;
    link.click();
  };

  const deleteAll = async () => {
    await trpc($page).deleteAll.query();
  };

  const formatDate = (d: Date) => {
    if (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    ) {
      return d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
    }
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  };
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
      <tr
        class="border-b border-gray-700 cursor-pointer hover:bg-gray-700"
        on:click={() => download(file[0], file[1].name)}
      >
        <td class={tdClass}>{file[1].name}</td>
        <td class={tdClass}>{formatDate(new Date(parseInt(file[1].date)))}</td>
        <td class={tdClass}>{formatBytes(parseInt(file[1].size))}</td>
      </tr>
    {/each}
  </tbody>
</table>
