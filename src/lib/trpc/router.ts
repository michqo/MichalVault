import { z } from "zod";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost, type PresignedPostOptions } from "@aws-sdk/s3-presigned-post";
import randomWords from "random-words";
import s3 from "$lib/server/connection";
import { S3_BUCKET_NAME } from "$env/static/private";
import type { Context } from "$lib/trpc/context";
import { initTRPC, TRPCError } from "@trpc/server";
import {
  FULL_DB_ERROR,
  maxBucketSize,
  maxSize,
  maxVaultFilesCount,
  maxVaultSize,
  MAX_VAULT_FILES_ERROR,
  MAX_VAULT_SIZE_ERROR,
  tokenRegex
} from "$lib/constants";

// Returns vault files size and vault files count
function countVaultFiles(token: string): Promise<[number, number]> {
  return new Promise((resolve, reject) => {
    s3.listObjectsV2(
      { Bucket: S3_BUCKET_NAME, Delimiter: "/", Prefix: token + "/" },
      (err, data) => {
        if (err) return reject(new TRPCError({ code: "INTERNAL_SERVER_ERROR" }));
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
function checkBucketSize(size: number): Promise<void> {
  return new Promise((resolve, reject) => {
    s3.listObjectsV2({ Bucket: S3_BUCKET_NAME }, (err, data) => {
      if (err) return reject(new TRPCError({ code: "INTERNAL_SERVER_ERROR" }));
      let totalSize = 0;
      data?.Contents?.forEach((object) => {
        totalSize += object.Size!;
      });
      if (totalSize + size > maxBucketSize) {
        return reject(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: FULL_DB_ERROR }));
      }
      resolve();
    });
  });
}

export const t = initTRPC.context<Context>().create();

const token = z.string().regex(tokenRegex);

export const router = t.router({
  deleteAll: t.procedure.input(z.object({ token })).query(async ({ input }) => {
    s3.listObjectsV2(
      {
        Bucket: S3_BUCKET_NAME,
        Prefix: input.token + "/"
      },
      (err, data) => {
        if (err) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        if (!data?.Contents) return;
        const objects = data.Contents.map((obj) => ({ Key: obj.Key }));
        const deleteParams = {
          Bucket: S3_BUCKET_NAME,
          Delete: { Objects: objects }
        };
        s3.deleteObjects(deleteParams);
      }
    );
  }),
  delete: t.procedure.input(z.object({ token, key: z.string() })).query(async ({ input }) => {
    await s3.deleteObject({
      Bucket: S3_BUCKET_NAME,
      Key: input.key
    });
  }),
  fetchToken: t.procedure.query(async ({}) => {
    const words = randomWords({
      exactly: 3,
      maxLength: 4
    });
    return words.join("-");
  }),
  getUploadUrl: t.procedure
    .input(z.object({ token, filesSize: z.number().min(0), filesCount: z.number().min(0) }))
    .query(async ({ input }) => {
      // Pre file upload checks
      const [vaultFilesCount, vaultFilesSize] = await countVaultFiles(input.token);
      if (vaultFilesCount >= maxVaultFilesCount)
        throw new TRPCError({ code: "FORBIDDEN", message: MAX_VAULT_FILES_ERROR });
      if (vaultFilesSize > maxVaultSize)
        throw new TRPCError({ code: "FORBIDDEN", message: MAX_VAULT_SIZE_ERROR });

      // Check size limits
      await checkBucketSize(input.filesSize);
      // Check if number of files in vault doesn't exceed max size
      if (vaultFilesCount + input.filesCount > maxVaultFilesCount)
        throw new TRPCError({ code: "FORBIDDEN", message: MAX_VAULT_FILES_ERROR });
      // Check vault files size
      if (input.filesSize + vaultFilesSize > maxVaultSize)
        throw new TRPCError({ code: "FORBIDDEN", message: MAX_VAULT_SIZE_ERROR });

      const token = input.token + "/";
      // #{filename} is just for validation purposes
      const Key = token + "${filename}";
      const Conditions = [
        ["starts-with", "$key", token],
        ["content-length-range", 1, maxSize]
      ];
      const options: PresignedPostOptions = {
        Bucket: S3_BUCKET_NAME,
        Key,
        // @ts-ignore
        Conditions, // Type error
        Expires: 60 * 3
      };
      return await createPresignedPost(s3, options);
    }),
  fetchOne: t.procedure.input(z.object({ key: z.string() })).query(async ({ input }) => {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: input.key
    });
    const url = await getSignedUrl(s3, command);
    return url;
  }),
  fetchAll: t.procedure.input(z.object({ token })).query(async ({ input }) => {
    if (input.token.length == 0) return [];
    const data = await s3.listObjectsV2({
      Bucket: S3_BUCKET_NAME,
      MaxKeys: maxVaultFilesCount,
      Delimiter: "/",
      Prefix: input.token + "/"
    });
    if (!data.Contents) return [];
    let files: Record<string, string>[] = [];
    for (let item of data.Contents) {
      files.push({
        // @ts-ignore
        key: item.Key,
        // @ts-ignore
        name: item.Key?.split("/")[1],
        // @ts-ignore
        size: item.Size,
        // @ts-ignore
        date: item.LastModified
      });
    }
    return files;
  })
});

export type Router = typeof router;
