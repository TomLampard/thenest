import type { NextPageWithAuthLayout } from "src/utils/types";
import { Layout } from "../components/layout";
import { CreatePostForm } from "../components/forms/createPost";
import { api } from "../utils/api";
import { useSession } from "next-auth/react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { useState } from "react";
import Head from "next/head";
import toast from "react-hot-toast";

const NewPostPage: NextPageWithAuthLayout = () => {
  const userId = useSession().data?.user?.id;
  const [url, setUrl] = useState<string>("");
  const key = `${Date.now()}-${randomUUID}`;

  const s3 = new S3Client({
    apiVersion: "2006-03-01",
    region: "ap-southeast-2", // Sydney
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s3Url = async (data: any) => {
    const file = data.file;
    const putObjectParams = {
      Bucket: "thenestfiles",
      Body: file,
      Region: "ap-southeast-2", // Sydney
      Key: key,
      Expire: 60,
      ContentType: "image/jpeg, image/png, video/mp4, video/quicktime",
    };
    const command = new PutObjectCommand(putObjectParams);

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    setUrl(signedUrl);
    console.log(url, "current url");

    if (!s3Url) {
      toast.error("Failed to get url");
      console.log("Failed to get url");
      return;
    }

    if (!userId) {
      toast.error("Failed to get user id");
      console.log("Failed to get user id");
      return;
    }
    return signedUrl;
  };

  const createPost = api.post.createPost.useMutation({
    onError: (error) => toast.error(`Failed to add post: ${error.message}`),
    onSuccess: () => {
      toast.success("Post added successfully");
      console.log("Success");
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const OnSubmitHandler = async (data: any) => {
    try { 
      await s3Url(data);
      console.log("Successful S3 Url", s3Url);
    } catch (error) {
      console.log(error, "Failed to get S3 Url");
    }
    
    try {
      await createPost.mutateAsync(data);
      data.title = "";
      data.content = "";
      
      console.log("Successful Post Mutation");
    } catch (error) {
      console.log(error, "Failed to add post details to database");
    }
  };

  return (
    <>
      <Head>
        <title>New Post - The Nest</title>
      </Head>
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Create a New Post
      </h2>
      <div className="mt-6">
        <CreatePostForm
          isSubmitting={createPost.isLoading}
          backTo="/new"
          onSubmit={OnSubmitHandler}
        />
      </div>
    </>
  );
};

NewPostPage.auth = true;

NewPostPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default NewPostPage;
