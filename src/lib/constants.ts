const buttonClass =
  "text-lg px-3 py-2 rounded-md text-slate-100 bg-white/[.06] border border-slate-300 focus:ring disabled:opacity-50";
// Set transition duration in ms
const duration = 250;

const MB = 1048576;
const maxSizeInMB = 30;
const maxSize = MB * maxSizeInMB;
const maxVaultSizeinMB = 30;
const maxVaultSize = MB * maxVaultSizeinMB;
const maxVaultFilesCount = 20;
const maxBucketSizeInGB = 10;
const maxBucketSize = MB * 1000 * maxBucketSizeInGB;
const tokenRegex = /^[\p{L}\p{N}!\-_.*'"()]{3,20}$/gu;
const fileRegex = /^[\p{L}\p{N}!\-_.*'"()]{1,100}$/gu;

/**
 * Regex for files which can be previewed in the PreviewModal
 */
const imageExtensionsRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
const textExtensionsRegex = /\.(txt|py|rs|js|ts|cs|c|cpp|java|kt|gd|html)$/i;

// Errors
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
  tokenRegex,
  fileRegex,
  imageExtensionsRegex,
  textExtensionsRegex,
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
