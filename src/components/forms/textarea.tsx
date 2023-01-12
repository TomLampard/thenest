import { classNames } from "../../utils/classStringify";
import { forwardRef } from "react";

export type TextareaOwnProps = {
  label?: string;
};

type TextareaProps = TextareaOwnProps &
  React.ComponentPropsWithoutRef<"textarea">;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, name, className, ...rest }, forwardedRef) => {
    return (
      <div>
        {label && (
          <label htmlFor={id || name} className="mb-2 block font-semibold">
            {label}
          </label>
        )}
        <textarea
          {...rest}
          ref={forwardedRef}
          id={id || name}
          name={name}
          className={classNames(
            "bg-secondary border-secondary focus-ring block w-full rounded shadow-sm",
            className
          )}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
