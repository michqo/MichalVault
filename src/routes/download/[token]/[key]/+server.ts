import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3_BUCKET_NAME } from "$env/static/private";
import { fileRegex, tokenRegex, FILE_NOT_FOUND, TOKEN_ERROR } from "$lib/constants";
import s3 from "$lib/server/connection";
import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
  const token = params.token;
  const key = params.key;
  if (structuredClone(tokenRegex).test(token) == false) throw error(400, TOKEN_ERROR);
  if (structuredClone(fileRegex).test(key) == false) throw error(400, TOKEN_ERROR);

  let url: string;
  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: `${token}/${key}`
    });
    url = await getSignedUrl(s3, command);
  } catch {
    throw error(404, FILE_NOT_FOUND);
  }
  if (!url) throw error(500);
  throw redirect(307, url);
}) satisfies RequestHandler;
