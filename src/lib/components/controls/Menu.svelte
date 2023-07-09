<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { duration } from "$lib/constants";

  export let actions: string[];
  export let x: number;
  export let y: number;

  const dispatch = createEventDispatcher();

  const modalClass =
    "fixed flex flex-col z-10 bg-gray-900 border border-slate-400/[.5] rounded-md drop-shadow-xl";
  const btnClass =
    "text-base px-3 py-2 text-slate-100 hover:bg-gray-800 first:rounded-t-md last:rounded-b-md";

  onMount(() => {
    const funcRef = (e: KeyboardEvent) => {
      if (e.key == "Escape") dispatch("close");
    };
    document.addEventListener("keydown", funcRef);
    return () => {
      document.removeEventListener("keydown", funcRef);
    };
  });
</script>

<div style="left: {x}px; top: {y}px;" transition:fade={{ duration }} class={modalClass}>
  {#each actions as action}
    <button class={btnClass} on:click={() => dispatch("click", action)}>{action}</button>
  {/each}
</div>
<button class="cursor-default fixed inset-0 w-full h-full" on:click={() => dispatch("close")} />
