import type { ButtonVariant } from "../buttons/button";
import type { ComponentPropsWithoutRef } from "react";
import { classNames } from "../../utils/classStringify";
import { forwardRef } from "react";

export type IconButtonOwnProps = {
  variant?: ButtonVariant;
};

type IconButtonProps = IconButtonOwnProps & ComponentPropsWithoutRef<"button">;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, variant = "primary", type = "button", ...rest },
    forwardedRef
  ) => {
    return (
      <button
        {...rest}
        ref={forwardedRef}
        type={type}
        className={classNames(
          "h-button w-icon-button focus-ring inline-flex flex-shrink-0 items-center justify-center rounded-full transition-colors",
          variant === "primary" &&
            "text-secondary-inverse bg-secondary-inverse hover:text-primary-inverse hover:bg-primary-inverse",
          variant === "secondary" &&
            "text-primary border-secondary bg-primary hover:bg-secondary border",
          className
        )}
      />
    );
  }
);

IconButton.displayName = "IconButton";
