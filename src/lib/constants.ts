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
  tokenRegex
};
