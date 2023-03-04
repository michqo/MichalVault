import { z } from "zod";
import randomWords from "random-words";
import type { Context } from "$lib/trpc/context";
import { initTRPC } from "@trpc/server";
import s3 from "$lib/server/connection";
import { S3_BUCKET_NAME } from "$env/static/private";

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  deleteAll: t.procedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
    s3.listObjectsV2(
      {
        Bucket: S3_BUCKET_NAME,
        Prefix: input.token + "/"
      },
      (_err, data) => {
        const objects = data?.Contents?.map((obj) => ({ Key: obj.Key }));
        const deleteParams = {
          Bucket: S3_BUCKET_NAME,
          Delete: { Objects: objects }
        };
        s3.deleteObjects(deleteParams);
      }
    );
  }),
  delete: t.procedure
    .input(z.object({ token: z.string(), key: z.string() }))
    .query(async ({ input }) => {
      s3.deleteObject({
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
  fetchOne: t.procedure.input(z.object({ key: z.string() })).query(async ({ input }) => {
    const data = await s3.getObject({
      Bucket: S3_BUCKET_NAME,
      Key: input.key
    });
    // TODO: More performant way to return Uint8Array
    return Array.from(await data.Body?.transformToByteArray()!);
  }),
  fetchAll: t.procedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
    if (input.token.length == 0) return [];
    const data = await s3.listObjectsV2({
      Bucket: S3_BUCKET_NAME,
      Delimiter: "/",
      Prefix: input.token + "/"
    });
    if (!data.Contents) return [];
    let files: Record<string, string>[] = [];
    for (let i = 0; i < data.Contents?.length; i++) {
      const item = data.Contents[i];
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
