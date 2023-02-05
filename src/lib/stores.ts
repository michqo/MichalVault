import { type Writable, writable } from "svelte/store";

const buttonClass =
  "text-lg px-3 py-2 rounded-md text-slate-100 bg-white/[.06] border border-slate-300 focus:ring";
// Set transition duration in ms
const duration = 250;
// Limit file upload to roughly 20MB
const maxSize = 1048576 * 20;

const files: Writable<[string, Record<string, string>][]> = writable([]);
const inputFiles: Writable<FileList> = writable();
const loading = writable(false);

export { buttonClass, duration, maxSize, files, inputFiles, loading };
