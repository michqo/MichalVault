import { fail, error } from "@sveltejs/kit";
import type { Actions } from "./$types";
import s3 from "$lib/server/connection";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3_BUCKET_NAME } from "$env/static/private";
import {
  maxSize,
  maxVaultFilesCount,
  maxVaultSize,
  maxVaultSizeinMB,
  tokenMaxLength,
  tokenMinLength
} from "$lib/stores";

/*
async function fetchFiles(token: string): Promise<[any, Record<string, string>][]> {
  const keys = await redis.sscan(token, 0);
  if (keys[1].length == 0) return [];
  const pipeline = redis.pipeline();
  for (let i = 0; i < keys[1].length; i++) {
    const key = keys[1][i];
    if (key.substring(key.length - 1) == "F") continue;
    pipeline.hgetall(key);
  }
  // @ts-ignore
  return await pipeline.exec();
}*/

export const actions: Actions = {
  default: async ({ cookies, request }) => {
    throw error(400);
    const token = cookies.get("token");
    if (token == undefined || token.length < tokenMinLength || token.length > tokenMaxLength)
      throw error(400);
    // Pre file upload checks
    /*
    const vaultFilesCount = await redis.scard(token);
    if (vaultFilesCount / 2 >= maxVaultFilesCount)
      throw error(
        400,
        `Vault has too many files, maximum amount of files is ${maxVaultFilesCount}`
      );
    */
    const form = await request.formData();
    const files = form.getAll("file_upload") as File[];
    const filesSize = files.reduce((a, b) => a + b.size, 0);
    // Check if form files size doesn't exceed max size
    if (filesSize > maxSize) throw error(400);
    // Check if number of files in vault doesn't exceed max size
    /*
    if (vaultFilesCount / 2 + files.length > maxVaultFilesCount)
      throw error(
        400,
        `Vault has too many files, maximum amount of files is ${maxVaultFilesCount}`
      );
    const vaultFiles = await fetchFiles(token);
    const vaultSize = vaultFiles.reduce((a, b) => a + parseInt(b[1].size), 0);
    // Check if files size doesn't exceed max size
    if (filesSize + vaultSize > maxVaultSize)
      throw error(413, `Vault is full, maximum size is ${maxVaultSizeinMB}MB`);
    */
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size == 0) throw error(400);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const cmd = new PutObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: `${token}/${file.name}`,
          Body: buffer
        });
        try {
          await s3.send(cmd);
        } catch (err) {
          return fail(500);
        }
      } catch {
        return fail(500);
      }
    }
    return { success: true };
  }
};
