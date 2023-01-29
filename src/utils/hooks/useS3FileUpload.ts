import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";


const client = new S3Client({
  region: "ap-southeast-2", // Sydney
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

const key = `${Date.now()}-${randomUUID}`;
const file = new File([""], key);

const putObjectParams = {
  Bucket: "thenestfiles",
  Body: file,
  Region: "ap-southeast-2", // Sydney
  Key: key,
  Expire: 60,
  ContentType: "image/jpeg, image/png, video/mp4, video/quicktime",
};

export const useS3FileUpload = async () => {
  const command = new PutObjectCommand(putObjectParams);

  const url = await getSignedUrl(client, command, { expiresIn: 60 });
  console.log("Presigned URL: ", url);
  return url;
};




