<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { duration } from "$lib/constants";

  export let actions: string[];

  const dispatch = createEventDispatcher();

  const modalClass =
    "flex flex-col w-full z-10 bg-gray-900 border border-slate-400/[.5] rounded-md drop-shadow-xl";
  const btnClass = "text-base px-3 py-4 text-slate-100 first:rounded-t-md last:rounded-b-md";

  onMount(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
  });
</script>

<div
  transition:fade={{ duration }}
  class="fixed inset-0 w-full h-full flex items-center justify-center px-3"
>
  <div class={modalClass}>
    {#each actions as action}
      <button class={btnClass} on:click={() => dispatch("click", action)}>{action}</button>
    {/each}
  </div>
  <button
    class="cursor-default fixed inset-0 w-full h-full bg-black/[.4]"
    on:click={() => dispatch("close")}
  />
</div>
