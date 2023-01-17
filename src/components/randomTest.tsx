import { useState } from "react";
import type { ChangeEvent } from "react";
import { CreatePostSchema } from "../schema/postSchema";
import { api } from "../utils/api";
import { useSession } from "next-auth/react";
import axios from "axios";

export const CreatePost = ( ) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [error, setError] = useState("");

  const utils = api.useContext();

  const { data: session } = useSession();

  const { mutateAsync } = api.post.createPost.useMutation({
    onSuccess: () => {
      setContent("");
      setFile(" ");
      setTitle("");
      utils.post.list.invalidate();
    },
  });

  const handleFileUpload = async (e: ChangeEvent<HTMLFormElement>) => {
    const UploadToS3 = async () => {
      const formData = new FormData(e.target);

      const file = formData.get("file") as File;
      if (!file) {
        return null;
      }

      const fileType = encodeURIComponent(file.type);
      const { data } = await axios.get(`/api/s3/sign?fileType=${fileType}`);
      const { uploadUrl, key } = data;

      await axios.put(uploadUrl, file);

      setFile(uploadUrl);
      key;
      return;
    };
    return UploadToS3();
  };

  async function SubmitHandler(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
   
    try {
      handleFileUpload(e);
    } catch {
      setError("file upload failed");
      return;
    }
    try {
      CreatePostSchema.parse({ title, content, file, });
    } catch (e) {
      setError("Invalid post");
      return;
    }
    mutateAsync({ title, content, file });
  }

  return (
    <>
      {error && JSON.stringify(error)}
      <form
        onSubmit={SubmitHandler}
        className="mb-4 flex w-full flex-col rounded-md border-2 p-4"
      >
        <label className="w-full p-4 shadow">
          <input
            type="file"
            title="Post a File"
            className="w-full p-4 shadow"
            onChange={(e) => setFile(e.target.value)}
          />
        </label>
        <label
          className="w-full p-4 shadow"
          title="Post Title"
          placeholder="Post Title"
        >
          <input className="w-full p-4 shadow" onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label
          className="w-full p-4 shadow"
          title="Post Description"
          placeholder="Post Description"
          >
        <textarea
          className="w-full p-4 shadow"
          onChange={(e) => setContent(e.target.value)}
        />
        </label>

        <div className="mt-4 flex justify-end">
          <button
            className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark hover:text-black"
            type="submit"
          >
           Create Post
          </button>
        </div>
      </form>
    </>
  );
};

export default CreatePost;
