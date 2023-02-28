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
const filesInput: Writable<HTMLInputElement> = writable();
const loading = writable(false);
const token = writable("");
const success = writable(false);
const error = writable([false, ""]);

// Confirm modal stores
const confirmVisible = writable(false);
type confirmType = "delete" | "deleteAll";
const confirmData: Writable<[confirmType, string, any]> = writable();
const confirmResult = writable(false);

export {
  buttonClass,
  duration,
  maxSizeInMB,
  maxSize,
  maxVaultSizeinMB,
  maxVaultSize,
  maxVaultFilesCount,
  inputFiles,
  filesInput,
  loading,
  token,
  success,
  error,
  confirmVisible,
  confirmData,
  confirmResult,
  type confirmType
};
