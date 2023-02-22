import { type Writable, writable } from "svelte/store";

const modalClass =
  "center top z-20 px-3 py-2 bg-gray-900 border border-slate-700 rounded-md drop-shadow-xl";
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

const success = writable(false);
const error = writable([false, ""]);
const inputFiles: Writable<FileList> = writable();
const loading = writable(false);
const token = writable("");

export {
  modalClass,
  buttonClass,
  duration,
  maxSizeInMB,
  maxSize,
  maxVaultSizeinMB,
  maxVaultSize,
  maxVaultFilesCount,
  success,
  error,
  inputFiles,
  loading,
  token
};
