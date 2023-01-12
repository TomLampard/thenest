import { SpinnerIcon } from "../icons";
import { classNames } from "../../utils/classStringify";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  variant?: ButtonVariant;
  responsive?: boolean;
  isLoading?: boolean;
  loadingChildren?: ReactNode;
} & ComponentPropsWithoutRef<"button">;

export const buttonClasses = ({
  className,
  variant = "primary",
  responsive,
  isLoading,
  disabled,
}: ButtonProps) => {
  return classNames(
    "inline-flex items-center justify-center font-semibold transition-colors rounded-full focus-ring",
    responsive
      ? "px-3 h-8 text-xs sm:px-4 sm:text-sm sm:h-button"
      : "px-4 text-sm h-button",
    variant === "primary" &&
      "text-secondary-inverse bg-secondary-inverse hover:text-primary-inverse hover:bg-primary-inverse",
    variant === "secondary" &&
      "border text-primary border-secondary bg-primary hover:bg-secondary",
    (disabled || isLoading) && "opacity-50 cursor-default",
    className
  );
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      responsive,
      type = "button",
      isLoading = false,
      loadingChildren,
      disabled,
      children,
      ...rest
    },
    forwardedRef
  ) => {
    return (
      <button
        {...rest}
        ref={forwardedRef}
        type={type}
        disabled={disabled || isLoading}
        className={buttonClasses({
          className,
          disabled,
          variant,
          responsive,
          isLoading,
        })}
      >
        {isLoading && (
          <SpinnerIcon className="mr-2 -ml-1 h-4 w-4 animate-spin" />
        )}
        {isLoading && loadingChildren ? loadingChildren : children}
      </button>
    );
  }
);

Button.displayName = "button";
