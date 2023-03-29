<script lang="ts">
  export let text: string;

  const inputDivClass = "center md:flex-row md:items-stretch gap-2";
  const inputClass =
    "w-full px-3 py-2 bg-transparent border border-slate-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500/[.8]";
</script>

<div class={inputDivClass}>
  <input type="text" placeholder="Token" bind:value={text} class={inputClass} />
  <div class="flex gap-2 flex-row">
    <slot />
  </div>
</div>
