<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { duration, buttonClass, imageTypes, imageExtensions } from "$lib/constants";
  import { inputFiles, filesInput } from "$lib/stores";
  import Close from "$lib/svgs/Close.svelte";
  import Done from "$lib/svgs/Done.svelte";

  const btnClass = "p-1 rounded-md hover:bg-white/[.1]";
  const svgClass = "w-12 h-12";
  const titleClass = "text-center text-2xl font-medium tracking-wider";
  const inputClass =
    "w-full px-3 py-2 bg-transparent border border-slate-500 rounded-md focus:outline-none focus:ring focus:ring-blue-500/[.8]";

  let createVisible = false;
  let pasteVisible = false;

  let imageFile: File;
  let imageName = "";
  let imageExt = "";
  let name = "";
  let content = "";

  function close() {
    createVisible = false;
    pasteVisible = false;
  }

  function removeSpaces(name: string): string {
    return name.replaceAll(" ", "_");
  }

  function addFile() {
    if (name.length == 0 || content.length == 0) return;
    const blob = new Blob([content], { type: "text/plain" });
    const newFile = new File([blob], removeSpaces(name));
    const dt = new DataTransfer();
    if ($inputFiles) {
      for (const f of $inputFiles) {
        dt.items.add(f);
      }
    }
    dt.items.add(newFile);
    $filesInput.files = dt.files;
    $inputFiles = dt.files;
    content = "";
    createVisible = false;
  }

  function addImage() {
    pasteVisible = false;
    let dt = new DataTransfer();
    if ($inputFiles) {
      for (const f of $inputFiles) {
        dt.items.add(f);
      }
    }
    const renamedFile = new File([imageFile], `${removeSpaces(imageName)}.${imageExt}`);
    dt.items.add(renamedFile);

    $filesInput.files = dt.files;
    $inputFiles = dt.files;
  }

  onMount(() => {
    const keydownRef = (e: KeyboardEvent) => {
      if (e.key == "Escape") {
        close();
      } else if (e.key == "Enter" && pasteVisible) {
        addImage();
      }
    };
    document.addEventListener("keydown", keydownRef);

    document.onpaste = (e) => {
      if (createVisible) return;
      const cd = e.clipboardData;
      if (!cd) return;
      for (const item of cd.items) {
        const idx = imageTypes.indexOf(item.type);
        if (idx > -1) {
          const itemFile = item.getAsFile();
          if (!itemFile) return;
          imageName = "image";
          imageFile = itemFile;
          imageExt = imageExtensions[idx];
          pasteVisible = true;
          return;
        }
      }
    };

    return () => {
      document.removeEventListener("keydown", keydownRef);
    };
  });
</script>

<button class="{buttonClass} mt-5" on:click={() => (createVisible = true)}>Create file</button>

{#if createVisible || pasteVisible}
  <div
    class="fixed inset-0 w-full min-h-full flex items-center justify-center"
    transition:fade={{ duration }}
  >
    <button
      class="cursor-default fixed inset-0 md:w-full md:h-full bg-black/[.2]"
      on:click={close}
    />
    {#if createVisible}
      <div
        class="fixed center justify-between z-10 w-full h-full md:max-w-4xl max-h-screen md:max-h-[95%] gap-y-3 md:gap-y-10 px-10 py-5 bg-gray-900/[.4] backdrop-blur-xl md:border md:border-slate-600 rounded-md drop-shadow-xl"
      >
        <h1 class={titleClass}>Create file</h1>
        <div class="flex flex-col w-full h-full gap-y-2">
          <input type="text" class={inputClass} placeholder="name.txt" bind:value={name} />
          <textarea
            class="{inputClass} overflow-auto h-full resize-none"
            placeholder="content"
            name="textfile"
            id="textarea"
            bind:value={content}
          />
        </div>
        <div class="flex gap-x-2">
          <button class={btnClass} on:click={addFile}
            ><Done class="{svgClass} text-green-500" /></button
          >
          <button class={btnClass} on:click={close}
            ><Close class="{svgClass} text-red-500" /></button
          >
        </div>
      </div>
    {:else if pasteVisible}
      <div
        class="fixed center z-10 w-full h-fit max-w-xl gap-y-10 px-10 py-5 bg-gray-900/[.6] backdrop-blur-xl border border-slate-600 rounded-md drop-shadow-xl"
      >
        <h1 class={titleClass}>Paste image</h1>
        <input type="text" class={inputClass} placeholder="Image name" bind:value={imageName} />
        <div class="flex gap-x-2">
          <button class={btnClass} on:click={addImage}
            ><Done class="{svgClass} text-green-500" /></button
          >
          <button class={btnClass} on:click={close}
            ><Close class="{svgClass} text-red-500" /></button
          >
        </div>
      </div>
    {/if}
  </div>
{/if}
