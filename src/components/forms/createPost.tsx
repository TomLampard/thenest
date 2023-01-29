import type { SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLeaveConfirm } from "../../utils/hooks/useLeaveConfirm";
import { Button } from "../buttons/button";
import { ButtonLink } from "../buttons/buttonLink";
import { TextField } from "./textField";
import { Textarea } from "./textarea";
import { FileInputField } from "./fileInput";

type FormData = {
  title: string;
  content: string;
  filename: string;
};

type PostFormProps = {
  defaultValues?: FormData;
  isSubmitting?: boolean;
  backTo: string;
  onSubmit: SubmitHandler<FormData>;
};

export const CreatePostForm = ({
  defaultValues,
  isSubmitting,
  backTo,
  onSubmit,
}: PostFormProps) => {
  const { register, formState, getValues, reset, handleSubmit } =
    useForm<FormData>({
      defaultValues,
    });

  useLeaveConfirm({ formState });

  const { isSubmitSuccessful } = formState;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(getValues());
    }
  }, [isSubmitSuccessful, reset, getValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>      
        <FileInputField 
          {...register("filename", { required: true })}
          label="File"
          name="file"
          autoFocus
          required
          className="!py-1.5 text-lg font-semibold"
        />
      </div>
      <div>
      <TextField
        {...register("title", { required: true })}
        label="Title"
        autoFocus
        required
        className="!py-1.5 text-lg font-semibold"
      />
      </div>
      <div className="mt-6">
        <Textarea
          {...register("content", { required: true })}
          label="Content"
          required
        />
      </div>
      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingChildren={`${
              defaultValues ? "Saving Post" : "Sending to Nest"
            }`}
          >
            {defaultValues?.title ? "Save" : "Post"}
          </Button>
          <ButtonLink href={backTo} variant="secondary">
            Cancel
          </ButtonLink>
        </div>
        {!isSubmitting && (
          <p className="text-primary hover:text-blue-500">
            Not submitting llllllllllll{" "}
          </p>
        )}
      </div>
    </form>
  );
};

