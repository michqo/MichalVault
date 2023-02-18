import { type Writable, writable } from "svelte/store";

const buttonClass =
  "text-lg px-3 py-2 rounded-md text-slate-100 bg-white/[.06] border border-slate-300 focus:ring";
// TODO: Split config variables into separate file
// Set transition duration in ms
const duration = 250;
// Limit file upload
const maxSizeInMB = 1;
const maxVaultSizeinMB = 3;
const maxSize = 1048576 * maxSizeInMB;
const maxVaultSize = 1048576 * maxVaultSizeinMB;
const maxVaultFilesCount = 5;

const inputFiles: Writable<FileList> = writable();
const loading = writable(false);
const token = writable("");

export {
  buttonClass,
  duration,
  maxSizeInMB,
  maxSize,
  maxVaultSizeinMB,
  maxVaultSize,
  maxVaultFilesCount,
  inputFiles,
  loading,
  token
};
