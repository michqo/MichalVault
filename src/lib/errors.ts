import { maxSizeInMB, maxVaultFilesCount, maxVaultSizeinMB } from "./constants";

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
