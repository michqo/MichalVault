/**
 * Style
 */
const buttonClass =
  "text-lg px-3 py-2 rounded-md text-slate-100 bg-gray-800 border border-slate-300 focus:ring focus:ring-blue-500/[.8] disabled:opacity-50";

/**
 * Transition duration in milliseconds
 */
const duration = 250;

/**
 * Configuration
 */
const MB = 1048576;
const maxSizeInMB = 30;
const maxSize = MB * maxSizeInMB;
const maxVaultSizeinMB = 30;
const maxVaultSize = MB * maxVaultSizeinMB;
const maxVaultFilesCount = 20;
const maxBucketSizeInGB = 10;
const maxBucketSize = MB * 1000 * maxBucketSizeInGB;
const maxPreviewSize = MB * 4;
const MAX_REQUESTS = 100;
const TIME_PERIOD = 30 * 60 * 1000; // 30 minutes

interface IPRequest {
  count: number; // Requests count
  time: number; // Request time
}

/**
 * Regex for files which can be previewed in the PreviewModal
 */
const imageExtensionsRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
const textExtensionsRegex =
  /\.(txt|rs|js|ts|gd|md|html|java|py|c|php|cs|cake|cshtml|csx|cpp|cp|cc|cobol|cob|ccp|css|flux|fx|go|jsp|kt|ktm|kts|numpy|numpyw|numsc|pls|pck|pkb|pks|plbplsql|sql|perl|r|rd|rs|rsx|sh|bash|st|cs|swift|vb|class)$/i;

const tokenRegex = /^[\p{L}\p{N}!\-_.*'"()]{3,20}$/gu;
const fileRegex = /^[\p{L}\p{N}!\-_.*'"()]{1,100}$/gu;

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
  maxPreviewSize,
  tokenRegex,
  fileRegex,
  imageExtensionsRegex,
  textExtensionsRegex,
  MAX_REQUESTS,
  TIME_PERIOD,
  type IPRequest
};
