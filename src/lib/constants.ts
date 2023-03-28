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
const tokenRegex = /^[\p{L}\p{N}!\-_.*'"()]{3,20}$/gu;
const fileRegex = /^[\p{L}\p{N}!\-_.*'"()]{1,100}$/gu;
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
  /\.(txt|md|rs|js|ts|gd|css|md|html|java|py|c|php|cs|cake|cshtml|csx|cpp|cp|cc|cobol|cob|ccp|css|flux|fx|go|jsp|kt|ktm|kts|numpy|numpyw|numsc|pls|pck|pkb|pks|plbplsql|sql|perl|r|rd|rs|rsx|sh|bash|st|cs|swift|vb|class)$/i;

/**
 * Errors
 */
const FILE_NOT_FOUND = "File not found";
const TOKEN_ERROR = "Invalid token";
const FILE_NAME_ERROR = "Invalid file, selected file(s) includes special characters or is too long";
const NETWORK_ERROR = "No network connection access";
const FILE_SELECTED_ERROR = "No file selected";
const FILE_SIZE_ERROR = `Files cannot be larger than ${maxSizeInMB}MB`;
const SERVER_ERROR = "Internal server error";
const CLIENT_ERROR = "Failed to upload file to server";
const CLIPBOARD_ERROR = "Failed to copy link to clipboard";
const MAX_VAULT_FILES_ERROR = `Vault has too many files, maximum amount of files is ${maxVaultFilesCount}`;
const MAX_VAULT_SIZE_ERROR = `Vault is full, maximum size is ${maxVaultSizeinMB}MB`;
const FULL_DB_ERROR = "Database is full";

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
  type IPRequest,
  FILE_NOT_FOUND,
  TOKEN_ERROR,
  FILE_NAME_ERROR,
  NETWORK_ERROR,
  FILE_SELECTED_ERROR,
  FILE_SIZE_ERROR,
  SERVER_ERROR,
  CLIENT_ERROR,
  CLIPBOARD_ERROR,
  MAX_VAULT_FILES_ERROR,
  MAX_VAULT_SIZE_ERROR,
  FULL_DB_ERROR
};
