import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLeaveConfirm } from "../../utils/useLeaveConfirm";

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

  return <form onSubmit={handleSubmit(onSubmit)}></form>;
};

export default PostForm;
