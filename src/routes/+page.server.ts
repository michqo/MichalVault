import { fail, error } from "@sveltejs/kit";
import type { Actions } from "./$types";
import s3 from "$lib/server/connection";
import { PutObjectCommand, type PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { S3_BUCKET_NAME } from "$env/static/private";
import {
  maxBucketSize,
  maxSize,
  maxVaultFilesCount,
  maxVaultSize,
  maxVaultSizeinMB,
  tokenMaxLength,
  tokenMinLength
} from "$lib/stores";

// Returns vault files size and vault files count
function countVaultFiles(token: string): Promise<[number, number]> {
  return new Promise((resolve, reject) => {
    s3.listObjectsV2(
      { Bucket: S3_BUCKET_NAME, Delimiter: "/", Prefix: token + "/" },
      (err, data) => {
        if (err) return reject(error(500));
        let totalSize = 0;
        data?.Contents?.forEach((object) => {
          totalSize += object.Size!;
        });
        if (!data?.Contents) return resolve([0, 0]);
        // @ts-ignore
        resolve([data.Contents.length, totalSize]);
      }
    );
  });
}

// Return error if bucket is full
function checkBucketSize(filesSize: number): Promise<void> {
  return new Promise((resolve, reject) => {
    s3.listObjectsV2({ Bucket: S3_BUCKET_NAME }, (err, data) => {
      if (err) return reject(error(500));
      let totalSize = 0;
      data?.Contents?.forEach((object) => {
        totalSize += object.Size!;
      });
      if (totalSize + filesSize > maxBucketSize) {
        return reject(error(507, "Database is full"));
      }
      resolve();
    });
  });
}

const MAX_VAULT_FILES_MSG = `Vault has too many files, maximum amount of files is ${maxVaultFilesCount}`;
const MAX_VAULT_SIZE_MSG = `Vault is full, maximum size is ${maxVaultSizeinMB}MB`;

// TODO: More advanced token validation
export const actions: Actions = {
  default: async ({ cookies, request }) => {
    const token = cookies.get("token");
    if (token == undefined || token.length < tokenMinLength || token.length > tokenMaxLength)
      throw error(400);
    // Pre file upload checks
    const [vaultFilesCount, vaultFilesSize] = await countVaultFiles(token);
    if (vaultFilesCount >= maxVaultFilesCount) throw error(400, MAX_VAULT_FILES_MSG);
    if (vaultFilesSize > maxVaultSize) throw error(413, MAX_VAULT_SIZE_MSG);

    const form = await request.formData();
    const files = form.getAll("file_upload") as File[];
    const filesSize = files.reduce((a, b) => a + b.size, 0);

    // Check size limits
    if (filesSize > maxSize) throw error(400);
    await checkBucketSize(filesSize);
    // Check if number of files in vault doesn't exceed max size
    if (vaultFilesCount + files.length > maxVaultFilesCount) throw error(400, MAX_VAULT_FILES_MSG);
    // Check vault files size
    if (filesSize + vaultFilesSize > maxVaultSize) throw error(413, MAX_VAULT_SIZE_MSG);

    let promises: Promise<PutObjectCommandOutput>[] = [];
    for (let file of files) {
      if (file.size == 0) throw error(400);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const cmd = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: `${token}/${file.name}`,
        Body: buffer
      });
      promises.push(s3.send(cmd));
    }
    Promise.all(promises).catch(() => fail(500));

    return { success: true };
  }
};
