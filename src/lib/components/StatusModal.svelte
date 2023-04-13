<script lang="ts" context="module">
  import { get } from "svelte/store";
  import { status } from "$lib/stores";

  const defaultTimeout = 4000;
  let timeout = defaultTimeout;

  function setModalTimout() {
    setTimeout(() => {
      status.set(undefined);
    }, timeout);
  }

  export function showError(text: string, t = defaultTimeout) {
    if (get(status)) return;
    status.set(["error", text]);
    timeout = t;
    setModalTimout();
  }
  export function showSuccess(text = "Uploaded file to server", t = defaultTimeout) {
    if (get(status)) return;
    status.set(["success", text]);
    timeout = t;
    setModalTimout();
  }
</script>

<script lang="ts">
  import { fly } from "svelte/transition";
  import { duration } from "$lib/constants";
  import ProgressBar from "./controls/ProgressBar.svelte";

  const modalClass =
    "center fixed top-0 mt-16 z-20 bg-gray-900 border border-slate-700 rounded-md drop-shadow-xl";
  const textClass = "tracking-wider mx-2 mt-2 mb-3";
</script>

{#if $status}
  <div class={modalClass} transition:fly={{ y: -50, duration }}>
    <ProgressBar {timeout} />
    <p class="{$status[0] == 'success' ? 'text-green-400' : 'text-red-400'} {textClass}">
      {$status[1]}
    </p>
  </div>
{/if}
