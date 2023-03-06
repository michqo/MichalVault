import { type Writable, writable } from "svelte/store";

/**
 * Constants
 */

// TODO: Split constants into separate file

const buttonClass =
  "text-lg px-3 py-2 rounded-md text-slate-100 bg-white/[.06] border border-slate-300 focus:ring";
// Set transition duration in ms
const duration = 250;

// Limit file upload
const maxSizeInMB = 30;
const maxSize = 1048576 * maxSizeInMB;
const maxVaultSizeinMB = 30;
const maxVaultSize = 1048576 * maxVaultSizeinMB;
const maxVaultFilesCount = 20;
const maxBucketSizeInGB = 10;
const maxBucketSize = 1048576 * 1000 * maxBucketSizeInGB;
const tokenRegex = /^[\p{L}\p{N}!\-_.*'"()]{3,20}$/gu;

/**
 * Svelte stores
 */

const filesCache: Writable<[Date, Record<string, string>[]]> = writable();
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
  maxBucketSizeInGB,
  maxVaultFilesCount,
  maxBucketSize,
  tokenRegex,
  filesCache,
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
