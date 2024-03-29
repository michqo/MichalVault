import { z } from "zod";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost, type PresignedPostOptions } from "@aws-sdk/s3-presigned-post";
import randomWords from "random-words";
import s3 from "$lib/server/connection";
import { S3_BUCKET_NAME } from "$env/static/private";
import { TRPCError } from "@trpc/server";
import { t } from "./t";
import { ratelimit } from "./middleware";
import {
  maxBucketSize,
  maxSize,
  maxVaultFilesCount,
  maxVaultSize,
  tokenRegex
} from "$lib/constants";
import { FULL_DB_ERROR, MAX_VAULT_FILES_ERROR, MAX_VAULT_SIZE_ERROR } from "$lib/errors";

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

const token = z.string().regex(tokenRegex);
const keys = z.object({ Key: z.string() }).array().min(1);

const procedure = t.procedure.use(ratelimit);

export const router = t.router({
  deleteSelected: procedure.input(z.object({ keys })).query(async ({ input }) => {
    const deleteParams = {
      Bucket: S3_BUCKET_NAME,
      Delete: { Objects: input.keys }
    };
    await s3.deleteObjects(deleteParams);
  }),
  delete: procedure.input(z.object({ key: z.string() })).query(async ({ input }) => {
    await s3.deleteObject({
      Bucket: S3_BUCKET_NAME,
      Key: input.key
    });
  }),
  fetchToken: procedure.query(async ({}) => {
    const words = randomWords({
      exactly: 3,
      maxLength: 4
    });
    return words.join("-");
  }),
  getUploadUrl: procedure
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
  fetchOne: procedure.input(z.object({ key: z.string() })).query(async ({ input }) => {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      ResponseContentDisposition: "attachment",
      Key: input.key
    });
    const url = await getSignedUrl(s3, command);
    return url;
  }),
  fetchAll: procedure.input(z.object({ token })).query(async ({ input }) => {
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
