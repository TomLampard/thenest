import type { NextApiRequest, NextApiResponse } from "next";
import { S3 } from "aws-sdk";
import { randomUUID } from "crypto";

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: "v4",
});

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const ex = (req.query.fileType as string).split("/")[1];

  const Key = `${randomUUID()}.${ex}`;

  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    Key,
    Expires: 60,
    ContentType: `file/${ex}`,
  };

  const uploadUrl = s3.getSignedUrl("putObject", s3Params);

  console.log("UploadUrl", uploadUrl);

  res.status(200).json({
    uploadUrl,
    key: Key,
  });
};
