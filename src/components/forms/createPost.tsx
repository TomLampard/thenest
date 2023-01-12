import { useEffect } from "react";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useLeaveConfirm } from "../../utils/useLeaveConfirm";
import { Button } from "../buttons/button";
import { ButtonLink } from "../buttons/buttonLink";
import { TextField } from "./textField";
import { Textarea } from "./textarea";

type FormData = {
  title: string;
  content: string;
};

type PostFormProps = {
  defaultValues?: FormData;
  isSubmitting?: boolean;
  backTo: string;
  onSubmit: SubmitHandler<FormData>;
};


export function uploadImageCommandHandler(
  textareaEl: HTMLTextAreaElement,
  files: File[]
) {
  const cursor = new Cursor(textareaEl)
  const currentLineNumber = cursor.position.line

  files.forEach(async (file, idx) => {
    const placeholder = `![Uploading ${file.name}...]()`

    cursor.replaceLine(currentLineNumber.lineNumber, placeholder)

    try {
      const uploadedImage = await uploadImage(file)

      replacePlaceholder(
        cursor,
        placeholder,
        `<img width="${
          uploadedImage.dpi >= 144
            ? Math.round(uploadedImage.width / 2)
            : uploadedImage.width
        }" alt="${uploadedImage.originalFilename}" src="${uploadedImage.url}">`
      )
    } catch (error: any) {
      console.log(error)
      replacePlaceholder(cursor, placeholder, '')
      toast.error(`Error uploading image: ${error.message}`)
    }
  })
}

const PostForm = ({
  defaultValues,
  isSubmitting,
  backTo,
  onSubmit,
}: PostFormProps) => {
  const { control, register, formState, getValues, reset, handleSubmit } =
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
      <TextField
        {...register("title", { required: true })}
        label="Title"
        autoFocus
        required
        className="!py-1.5 text-lg font-semibold"
      />
      <div className="mt-6">
        <Controller
          name="content"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Textarea
              label="Content"
              value={field.value}
              onChange={field.onChange}
              required
            />
          )}
        />
      </div>

    </form>
  );
};

export default PostForm;
