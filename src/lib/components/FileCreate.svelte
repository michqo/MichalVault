<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { duration, buttonClass, imageTypes, imageExtensions } from "$lib/constants";
  import { inputFiles, filesInput } from "$lib/stores";
  import Close from "$lib/svgs/Close.svelte";
  import Done from "$lib/svgs/Done.svelte";

  const btnClass = "p-1 rounded-md hover:bg-white/[.1]";
  const svgClass = "w-12 h-12";
  let visible = false;
  let name = "";
  let content = "";
  let pastCount = 0;

  function close() {
    visible = false;
  }

  function addFile() {
    if (name.length == 0 || content.length == 0) return;
    const blob = new Blob([content], { type: "text/plain" });
    const newFile = new File([blob], name);
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
    visible = false;
  }

  onMount(() => {
    const keydownRef = (e: KeyboardEvent) => {
      if (e.key == "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", keydownRef);

    document.onpaste = (e) => {
      const cd = e.clipboardData;
      if (!cd) return;
      let dt = new DataTransfer();
      if ($inputFiles) {
        for (const f of $inputFiles) {
          dt.items.add(f);
        }
      }
      for (const item of cd.items) {
        const idx = imageTypes.indexOf(item.type);
        if (idx > -1) {
          const itemFile = item.getAsFile();
          if (!itemFile) return;
          pastCount += 1;
          const renamedFile = new File([itemFile], `image${pastCount}.${imageExtensions[idx]}`);
          dt.items.add(renamedFile);
        }
      }
      $filesInput.files = dt.files;
      $inputFiles = dt.files;
    };

    return () => {
      document.removeEventListener("keydown", keydownRef);
    };
  });
</script>

<button class="{buttonClass} mt-5" on:click={() => (visible = true)}>Create file</button>

{#if visible}
  <div
    class="fixed inset-0 w-full min-h-full grid place-items-center"
    transition:fade={{ duration }}
  >
    <button
      class="cursor-default fixed inset-0 md:w-full md:h-full bg-black/[.2]"
      on:click={close}
    />
    <div
      class="fixed center justify-between z-10 w-full h-full md:max-w-4xl max-h-screen md:max-h-[95%] gap-y-3 md:gap-y-10 px-10 py-5 bg-gray-900/[.4] backdrop-blur-xl md:border md:border-slate-600 rounded-md drop-shadow-xl"
    >
      <h1 class="text-center text-2xl font-medium tracking-wider">Create file</h1>
      <div class="flex flex-col w-full h-full gap-y-2">
        <input
          type="text"
          class="p-3 bg-gray-800 rounded-md"
          placeholder="name.txt"
          bind:value={name}
        />
        <textarea
          class="p-3 bg-gray-800 rounded-md overflow-auto w-full h-full resize-none"
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
        <button class={btnClass} on:click={close}><Close class="{svgClass} text-red-500" /></button>
      </div>
    </div>
  </div>
{/if}