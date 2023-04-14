<script lang="ts">
  import { onMount } from "svelte";
  import { TRPCClientError } from "@trpc/client";
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { loading, filesCache, filesPreviewCache } from "$lib/stores";
  import {
    maxVaultSizeinMB,
    imageExtensionsRegex,
    textExtensionsRegex,
    maxPreviewSize
  } from "$lib/constants";
  import { CLIPBOARD_ERROR, FILE_NOT_FOUND, SERVER_ERROR } from "$lib/errors";
  import { formatBytes, formatDate, formatRelativeDate } from "$lib/utils";
  import { showError, showSuccess } from "./StatusModal.svelte";
  import ConfirmModal from "./ConfirmModal.svelte";
  import PreviewModal from "./PreviewModal.svelte";
  import ProgressBarTop from "./controls/ProgressBarTop.svelte";
  import Checkbox from "./controls/Checkbox.svelte";
  import Menu from "./controls/Menu.svelte";
  import FileActions from "./FileActions.svelte";
  import More from "$lib/svgs/More.svelte";

  export let files: Record<string, any>[];

  let filesSize: number;
  let selected: boolean[] = files.map(() => false);
  let selectedAll = false;

  let confirmData: ["delete" | "deleteSelected", string, any] | undefined;
  let previewFile: ["txt" | "img", string, ArrayBuffer?] | undefined;
  let previewFileName: string;
  let previewFileProgress: number | undefined;
  let selectedFileIndex = -2;

  const today = new Date();
  const rtf = new Intl.RelativeTimeFormat("en", { style: "long" });

  const thClass = "text-sm py-3 px-2 font-medium text-left";
  const tdClass = "text-sm py-2 px-2 whitespace-nowrap";
  const svgClass = "w-7 h-7";

  onMount(async () => {
    if (!$filesCache) $filesCache = [$page.params.token, today, files];
    if ($filesCache[0] != $page.params.token) await refresh();
    if ($filesCache && files.length == 0) files = $filesCache[2];
  });

  function showAppError(e: any) {
    if (e instanceof TRPCClientError) {
      showError(`Error: ${e.message}`);
    } else {
      showError(SERVER_ERROR);
    }
  }

  function updateFiles(newFiles: Record<string, string>[]) {
    files = newFiles;
    $filesCache = [$page.params.token, new Date(), files];
    selected = files.map(() => false);
  }

  async function download(key: string) {
    $loading = true;
    let url: string;
    try {
      url = await trpc($page).fetchOne.query({ key });
    } catch (e) {
      showAppError(e);
      $loading = false;
      return;
    }
    $loading = false;
    window.location.replace(url);
  }

  function findPreviewFileInCache(key: string): ["txt" | "img", string, ArrayBuffer?] | undefined {
    for (const file of $filesPreviewCache) {
      if (file[1] == key) return [file[0], file[2], file[3]];
    }
    return undefined;
  }

  async function openFile(name: string, key: string) {
    previewFileName = name;
    const cacheFile = findPreviewFileInCache(key);
    if (cacheFile) {
      previewFile = cacheFile;
      return;
    }
    previewFileProgress = 0;
    let url: string;
    try {
      url = await trpc($page).fetchOne.query({ key });
    } catch (e) {
      showAppError(e);
      previewFileProgress = undefined;
      return;
    }
    fetch(url)
      .then((res) => {
        const contentLength = res.headers.get("content-length");
        const contentType = res.headers.get("content-type");
        if (!contentLength) return;
        const contentLengthNumber = parseInt(contentLength);
        let loaded = 0;
        return {
          res: new Response(
            new ReadableStream({
              start(controller) {
                const reader = res.body?.getReader();
                read();
                function read() {
                  reader?.read().then(({ done, value }) => {
                    if (done) {
                      controller.close();
                      return;
                    }
                    loaded += value.byteLength;
                    previewFileProgress = Math.round((loaded / contentLengthNumber) * 100);
                    controller.enqueue(value);
                    read();
                  });
                }
              }
            })
          ),
          contentType
        };
      })
      .then((res) => {
        if (!res || !res.res || !res.contentType || res.res.status >= 400) {
          showError(FILE_NOT_FOUND);
          previewFileProgress = undefined;
          return;
        }
        return {
          blob: res.res.blob(),
          contentType: res.contentType
        };
      })
      .then((res) => {
        if (!res) return;
        res.blob.then((blob) => {
          if (imageExtensionsRegex.test(name)) {
            const imageBlob = new Blob([blob], { type: res.contentType });
            const blobUrl = URL.createObjectURL(imageBlob);
            previewFile = ["img", blobUrl];
            $filesPreviewCache.push(["img", key, blobUrl]);
          } else {
            const textBlob = new Blob([blob], { type: "text/plain;charset=utf8" });
            textBlob.arrayBuffer().then((buffer) => {
              const blobUrl = URL.createObjectURL(textBlob);
              previewFile = ["txt", blobUrl, buffer];
              $filesPreviewCache.push(["txt", key, blobUrl, buffer]);
            });
          }
          previewFileProgress = undefined;
        });
      });
  }

  async function copyLink(key: string) {
    const url = `${window.location.origin}/download/${key}`;
    try {
      await navigator.clipboard.writeText(url);
      showSuccess("Copied link to clipboard", 2000);
    } catch {
      showError(CLIPBOARD_ERROR, 3000);
    }
  }

  function deleteFile(key: string) {
    confirmData = ["delete", "delete file", key];
  }
  function deleteSelected() {
    confirmData = ["deleteSelected", "delete selected files", undefined];
  }

  async function handleConfirm(e: CustomEvent<boolean>) {
    if (!confirmData) return;
    if (e.detail == false) {
      confirmData = undefined;
      return;
    }
    switch (confirmData[0]) {
      case "delete":
        const key = confirmData[2];
        updateFiles(files.filter((value) => value.key != key));
        confirmData = undefined;
        try {
          await trpc($page).delete.query({ key });
        } catch (e) {
          showAppError(e);
          files = [];
          $filesCache = undefined;
        }
        break;
      case "deleteSelected":
        let keys: { Key: string }[] = [];
        let newFiles: Record<string, string>[] = [];
        for (let i = 0; i < selected.length; i++) {
          if (selected[i] == true) {
            keys.push({ Key: files[i].key });
          } else {
            newFiles.push(files[i]);
          }
        }
        if (keys.length == 0) break;
        updateFiles(newFiles);
        confirmData = undefined;
        try {
          await trpc($page).deleteSelected.query({ keys });
        } catch (e) {
          showAppError(e);
        }
        break;
    }
    confirmData = undefined;
  }

  async function refresh() {
    $loading = true;
    try {
      updateFiles(await trpc($page).fetchAll.query({ token: $page.params.token }));
    } catch (e) {
      showAppError(e);
    }
    $loading = false;
  }

  function findSelectedIndex(): number {
    let count = 0;
    let idx = -1;
    for (let i = 0; i < selected.length; i++) {
      if (selected[i] === true) {
        count++;
        idx = i;
        if (count > 1) {
          return -1;
        }
      }
    }
    if (count === 1) {
      return idx;
    } else if (count > 1) {
      return -1;
    } else {
      return -2;
    }
  }

  function handleSelect() {
    if (selected.length != files.length) selected = files.map(() => false);
    selectedAll = false;
  }
  function handleSelectAll() {
    selected = files.map(() => !selectedAll);
  }

  function handleMenuChange(state: boolean, index: number) {
    files[index].showMenu = state;
    handleSelect();
    selected[index] = state;
  }

  async function handleMenuClick(e: CustomEvent<string>, file: any, index: number) {
    switch (e.detail) {
      case "Download":
        await download(file.key);
        break;
      case "Delete":
        deleteFile(file.key);
        break;
      case "Copy link":
        await copyLink(file.key);
        break;
      case "Open preview":
        await openFile(file.name, file.key);
        break;
      default:
        break;
    }
    files[index].showMenu = false;
    selected[index] = false;
  }

  $: selected, (selectedFileIndex = findSelectedIndex());
  $: filesSize = files.reduce((a, b) => a + parseInt(b.size), 0);
  $: if (selected.length > 0 && selected.every((i) => i === true)) selectedAll = true;
</script>

{#if confirmData}
  <ConfirmModal title={confirmData[1]} on:done={handleConfirm} />
{/if}

{#if previewFileProgress}
  <ProgressBarTop progress={previewFileProgress} />
{/if}

{#if previewFile}
  <PreviewModal
    file={previewFile}
    name={previewFileName}
    on:close={() => (previewFile = undefined)}
  />
{/if}

<div class="center md:absolute w-full h-[60%] max-w-2xl mt-8">
  <div class="center flex-1">
    <p>
      Last refreshed on <span class="font-medium"
        >{$filesCache ? formatDate($filesCache[1], new Date()) : formatDate(today, today)}</span
      >
    </p>
    <code class="text-lg underline select-all">{$page.params.token}</code>
    <FileActions
      {selectedFileIndex}
      {files}
      on:refresh={refresh}
      on:deleteSelected={deleteSelected}
      on:download={(e) => download(e.detail)}
      on:copyLink={(e) => copyLink(e.detail)}
      on:preview={(e) => openFile(e.detail.name, e.detail.key)}
    />
  </div>

  <div class="center w-full flex-1">
    {#if files.length > 0}
      <h1 class="text-center font-medium text-3xl tracking-wider mt-10 md:mt-5">Files</h1>
      <p class="mb-2">{formatBytes(filesSize)} / {maxVaultSizeinMB} MB</p>
      <div class="w-full overflow-x-auto p-3 bg-white/[.07] border border-slate-700 rounded-lg">
        <table class="w-full divide-y divide-gray-500">
          <thead class="uppercase group">
            <tr>
              <th scope="col" class={thClass}>
                <Checkbox onChange={handleSelectAll} bind:checked={selectedAll} value="all" />
              </th>
              <th scope="col" class={thClass}> Name </th>
              <th scope="col" class={thClass} />
              <th scope="col" class={thClass}> Uploaded </th>
              <th scope="col" class={thClass}> Size </th>
            </tr>
          </thead>
          <tbody>
            {#each files as file, index}
              {@const canPreview =
                parseInt(file.size) < maxPreviewSize &&
                (imageExtensionsRegex.test(file.name) || textExtensionsRegex.test(file.name))}
              <tr class="group {selected[index] ? 'bg-gray-700' : 'bg-transparent'}">
                <td class={tdClass}>
                  <Checkbox
                    onChange={handleSelect}
                    bind:checked={selected[index]}
                    value={file.key}
                  />
                </td>
                <td class={tdClass}>{file.name}</td>
                <td class={tdClass}>
                  <button
                    type="button"
                    class="rounded-md md:hover:bg-white/[.1]"
                    on:click={() => handleMenuChange(true, index)}
                  >
                    <More class={svgClass} />
                  </button>
                  {#if file.showMenu == true}
                    <Menu
                      actions={["Download", "Delete", "Copy link"].concat(
                        canPreview ? "Open preview" : []
                      )}
                      on:close={() => handleMenuChange(false, index)}
                      on:click={(e) => handleMenuClick(e, file, index)}
                    />
                  {/if}
                </td>
                <td class={tdClass}>{formatRelativeDate(rtf, new Date(file.date), new Date())}</td>
                <td class={tdClass}>{formatBytes(parseInt(file.size))}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <p class="tracking-wide text-lg">No files to show</p>
    {/if}
  </div>
</div>
