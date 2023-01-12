import { useRouter } from "next/router";
import { useEffect, useCallback } from "react";
import { useBeforeunload } from "react-beforeunload";
import type { FieldValues, FormState } from "react-hook-form";

type Props<T extends FieldValues> = {
  formState: FormState<T>;
  message?: string;
};

const defaultMessage = "Are you sure you want to leave without finishing?";

export const useLeaveConfirm = <T extends FieldValues>({
  formState,
  message = defaultMessage,
}: Props<T>) => {
  const router = useRouter();

  const { isDirty } = formState;

  const onRouteChangeStart = useCallback(() => {
    if (isDirty) {
      if (window.confirm(message)) {
        return true;
      }
      throw "Abort route change by user's confirmation.";
    }
  }, [isDirty, message]);

  useEffect(() => {
    router.events.on("routeChangeStart", onRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart);
    };
  }, [router.events, onRouteChangeStart]);

  useBeforeunload((event) => {
    if (isDirty) {
      event.preventDefault();
    }
  });
  return;
};
