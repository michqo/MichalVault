import { type Writable, writable } from "svelte/store";

const filesCache: Writable<[string, Date, Record<string, string>[]] | undefined> = writable();
const inputFiles: Writable<FileList> = writable();
const filesInput: Writable<HTMLInputElement> = writable();
const loading = writable(false);
const token = writable("");
const success = writable([false, ""]);
const error = writable([false, ""]);

// Confirm modal stores
const confirmVisible = writable(false);
type confirmType = "delete" | "deleteAll";
const confirmData: Writable<[confirmType, string, any]> = writable();
const confirmResult = writable(false);

export {
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
