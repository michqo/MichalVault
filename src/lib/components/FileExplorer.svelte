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
  import { formatBytes, formatDate } from "$lib/utils";
  import { showError, showSuccess } from "./StatusModal.svelte";
  import ConfirmModal from "./ConfirmModal.svelte";
  import PreviewModal from "./PreviewModal.svelte";
  import Delete from "$lib/svgs/Delete.svelte";
  import Sync from "$lib/svgs/Sync.svelte";
  import Back from "$lib/svgs/Back.svelte";
  import Link from "$lib/svgs/Link.svelte";
  import Open from "$lib/svgs/Open.svelte";
  import ProgressBarTop from "./controls/ProgressBarTop.svelte";

  export let files: Record<string, string>[];
  let filesSize: number;

  let confirmData: ["delete" | "deleteAll", string, any] | undefined;
  let previewFile: ["txt" | "img", string, ArrayBuffer?] | undefined;
  let previewFileName: string;
  let previewFileProgress: number | undefined;

  const today = new Date();
  const thClass = "text-sm py-3 px-2 font-medium text-left";
  const tdClass = "text-sm py-2 px-2 whitespace-nowrap";
  const btnClass = "p-1 rounded-md hover:bg-white/[.1]";
  const imgClass = "w-14 h-14";
  const svgClass = "w-7 h-7";

  onMount(async () => {
    if (!$filesCache) $filesCache = [$page.params.token, new Date(), files];
    if ($filesCache[0] != $page.params.token) await refresh();
    if ($filesCache && files.length == 0) files = $filesCache[2];
  });

  function showRateLimitError(e: any) {
    if (e instanceof TRPCClientError) {
      showError(`Error: ${e.message}`);
    } else {
      showError(SERVER_ERROR);
    }
  }

  async function download(key: string) {
    $loading = true;
    let url: string;
    try {
      url = await trpc($page).fetchOne.query({ key });
    } catch (e) {
      showRateLimitError(e);
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
      showRateLimitError(e);
      previewFileProgress = undefined;
      return;
    }
    fetch(url)
      .then((res) => {
        const contentLength = res.headers.get("content-length");
        if (!contentLength) return;
        let loaded = 0;
        return new Response(
          new ReadableStream({
            start(controller) {
              const reader = res.body?.getReader();
              read();
              function read() {
                reader?.read().then(({ done, value }) => {
                  if (done) {
                    previewFileProgress = undefined;
                    controller.close();
                    return;
                  }
                  loaded += value.byteLength;
                  previewFileProgress = Math.round((loaded / parseInt(contentLength!)) * 100);
                  controller.enqueue(value);
                  read();
                });
              }
            }
          })
        );
      })
      .then((res) => {
        if (!res || res.status >= 400) {
          showError(FILE_NOT_FOUND);
          $loading = false;
          return;
        }
        return res.blob();
      })
      .then((blob) => {
        if (!blob) return;
        if (imageExtensionsRegex.test(name)) {
          const blobUrl = URL.createObjectURL(blob);
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
      });
    previewFileProgress = undefined;
  }

  async function copyLink(key: string) {
    const url = `${window.location.origin}/download/${key}`;
    try {
      await navigator.clipboard.writeText(url);
      showSuccess("Copied link to clipboard", 1000);
    } catch {
      showError(CLIPBOARD_ERROR, 3000);
    }
  }

  function deleteFile(key: string) {
    confirmData = ["delete", "delete file", key];
  }
  function deleteAll() {
    confirmData = ["deleteAll", "delete all files", undefined];
  }

  async function handleConfirm(e: CustomEvent<boolean>) {
    if (!confirmData) return;
    if (e.detail) {
      switch (confirmData[0]) {
        case "delete":
          const key = confirmData[2];
          confirmData = undefined;
          const values = files.filter((value) => value.key != key);
          files = values;
          $filesCache = [$page.params.token, new Date(), files];
          try {
            await trpc($page).delete.query({ token: $page.params.token, key });
          } catch (e) {
            showRateLimitError(e);
            files = [];
            $filesCache = undefined;
          }
          break;
        case "deleteAll":
          confirmData = undefined;
          files = [];
          $filesCache = [$page.params.token, new Date(), files];
          try {
            await trpc($page).deleteAll.query({ token: $page.params.token });
          } catch (e) {
            showRateLimitError(e);
          }
          break;
      }
    }
    confirmData = undefined;
  }

  async function refresh() {
    $loading = true;
    try {
      files = await trpc($page).fetchAll.query({ token: $page.params.token });
    } catch (e) {
      showRateLimitError(e);
    }
    $filesCache = [$page.params.token, new Date(), files];
    $loading = false;
  }

  $: filesSize = files.reduce((a, b) => a + parseInt(b.size), 0);
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
        >{$filesCache ? formatDate($filesCache[1], today) : formatDate(today, today)}</span
      >
    </p>
    <code class="text-lg underline select-all">{$page.params.token}</code>
    <div
      class="flex gap-x-3 mt-1 px-3 py-2 bg-white/[.04] border border-slate-700 rounded-xl drop-shadow-xl"
    >
      <a class={btnClass} href="/" title="Go back"><Back class={imgClass} /></a>
      <button class={btnClass} title="Refresh" on:click={refresh}><Sync class={imgClass} /></button>
      <button class={btnClass} title="Delete all files" on:click={deleteAll}
        ><Delete class={imgClass} /></button
      >
    </div>
  </div>

  <div class="center w-full flex-1">
    <h1 class="text-center font-medium text-3xl tracking-wider mt-10 md:mt-5">Files</h1>
    <p class="mb-2">{formatBytes(filesSize)} / {maxVaultSizeinMB} MB</p>
    <div class="w-full overflow-x-auto p-3 bg-white/[.07] border border-slate-700 rounded-lg">
      <table class="w-full divide-y divide-gray-500">
        <thead class="uppercase">
          <tr>
            <th scope="col" class={thClass} />
            <th scope="col" class={thClass}> Name </th>
            <th scope="col" class={thClass}> Uploaded </th>
            <th scope="col" class={thClass}> Size </th>
          </tr>
        </thead>
        <tbody>
          {#each files as file}
            <tr class="hover:bg-white/[.07]">
              <td class="{tdClass} flex gap-x-3">
                <button type="button" on:click={() => deleteFile(file.key)}>
                  <Delete class={svgClass} />
                </button>
                <button type="button" on:click={() => copyLink(file.key)}>
                  <Link class={svgClass} />
                </button>
                {#if parseInt(file.size) < maxPreviewSize && (imageExtensionsRegex.test(file.name) || textExtensionsRegex.test(file.name))}
                  <button type="button" on:click={() => openFile(file.name, file.key)}>
                    <Open class={svgClass} />
                  </button>
                {/if}
              </td>
              <td class={tdClass}>
                <button
                  type="button"
                  class="hover:underline underline-offset-2"
                  on:click={() => download(file.key)}
                >
                  {file.name}
                </button>
              </td>
              <td class={tdClass}>{formatDate(new Date(file.date), today)}</td>
              <td class={tdClass}>{formatBytes(parseInt(file.size))}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
