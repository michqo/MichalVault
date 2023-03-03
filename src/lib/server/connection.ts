import { S3 } from "@aws-sdk/client-s3";
import { S3_ENDPOINT_URL, S3_ACCESS_KEY, S3_SECRET_KEY } from "$env/static/private";

const s3 = new S3({
  region: "pl-waw",
  endpoint: S3_ENDPOINT_URL,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY
  }
});

export default s3;
