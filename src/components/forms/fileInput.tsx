import { classNames } from "../../utils/classStringify";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";



export type FileInputFieldOwnProps = {
  label?: string
}

type FileInputFieldProps = FileInputFieldOwnProps & 
 ComponentPropsWithoutRef<"input">


export const FileInputField = forwardRef<HTMLInputElement, FileInputFieldProps>(
  ({ label, id, name, type = 'file', className, ...rest }, forwardedRef) => {
    return (
      <div>
        {label && (
          <label htmlFor={id || name} className="block mb-2 font-semibold">
            {label}
          </label>
        )}
        <input
          {...rest}
          ref={forwardedRef}
          id={id}
          name={name}
          type={type}
          className={classNames(
            "block w-full py-1 rounded shadow-sm bg-secondary border-secondary focus-ring",
            className
          )}
        />
      </div>
    )
  }
)

FileInputField.displayName = "FileInputField"