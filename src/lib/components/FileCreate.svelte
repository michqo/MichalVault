<script lang="ts">
  import { fade } from "svelte/transition";
  import { duration, buttonClass } from "$lib/constants";
  import { inputFiles, filesInput } from "$lib/stores";
  import Close from "$lib/svgs/Close.svelte";
  import Done from "$lib/svgs/Done.svelte";

  const btnClass = "p-1 rounded-md hover:bg-white/[.1]";
  const svgClass = "w-12 h-12";
  let visible = false;
  let name: string;
  let content: string;

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
</script>

<p class="my-2">or</p>
<button class={buttonClass} on:click={() => (visible = true)}>Create file</button>

{#if visible}
  <div
    class="fixed z-20 inset-0 w-full min-h-full grid place-items-center"
    transition:fade={{ duration }}
  >
    <button
      class="cursor-default fixed z-20 inset-0 md:w-full md:h-full bg-black/[.2]"
      on:click={close}
    />
    <div
      class="fixed center justify-between z-20 w-full h-full md:max-w-4xl max-h-screen md:max-h-[95%] gap-y-3 md:gap-y-10 px-10 py-5 bg-gray-900/[.4] backdrop-blur-xl md:border md:border-slate-600 rounded-xl drop-shadow-xl"
    >
      <h1 class="text-center text-2xl font-medium tracking-wider">Create file</h1>
      <div class="flex flex-col w-full h-full gap-y-2">
        <input
          type="text"
          class="p-3 bg-gray-800 rounded-md"
          placeholder="File name"
          bind:value={name}
        />
        <textarea
          class="p-3 bg-gray-800 rounded-md overflow-auto w-full h-full resize-none"
          placeholder="File content"
          name="textfile"
          id="textarea"
          bind:value={content}
        />
      </div>
      <div class="flex gap-x-2">
        <button class={btnClass} on:click={addFile}><Done class={svgClass} /></button>
        <button class={btnClass} on:click={close}><Close class={svgClass} /></button>
      </div>
    </div>
  </div>
{/if}
