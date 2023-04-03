<script lang="ts">
  import Done from "$lib/svgs/Done.svelte";

  export let value: string;
  export let checked: boolean;
  export let onChange = () => {};
  let className: string | undefined = void 0;
  export { className as class };
</script>

<label class="relative select-none">
  <input
    class="appearance-none hidden peer"
    type="checkbox"
    on:change={onChange}
    bind:checked
    {value}
  />
  <Done
    class="{className} w-6 h-6 rounded-full border border-slate-500 text-transparent peer-checked:text-slate-100 peer-checked:border-0 peer-checked:bg-blue-500"
  />
</label>
