import { useId, type ComponentProps } from "react";
import { type Option } from "../types/utils.types";
import ErrorMessage from "./ErrorMessage";
import { twMerge } from "tailwind-merge";

export interface RadioOptionProps
  extends Omit<ComponentProps<"input">, "error" | "value"> {
  options: Option[];
  error?: { message?: string };
  value?: string | number;
  groupLabel?: string;
  className?: string;
}

const Radio = ({
  options,
  error,
  className,
  name,
  value: selectedValue,
  groupLabel,
  onChange,
  onBlur,
  ref,
  ...props
}: RadioOptionProps) => {
  const generatedId = useId();

  return (
    <div className={twMerge("w-full flex flex-col gap-1.5", className)}>
      <fieldset className="w-full">
        {groupLabel && <legend className="sr-only">{groupLabel}</legend>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((option, index) => {
            const id = `${generatedId}-${option.value}-${index}`;
            const isChecked = selectedValue === option.value;

            return (
              <div key={option.value} className="relative">
                <input
                  type="radio"
                  name={name}
                  id={id}
                  value={option.value}
                  checked={isChecked}
                  onChange={onChange}
                  onBlur={onBlur}
                  ref={ref}
                  {...props}
                  className="peer sr-only"
                />
                <label
                  htmlFor={id}
                  className={twMerge(
                    "flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all select-none",
                    "bg-ui-bg border-ui-border text-ui-primary hover:border-ui-accent/50",
                    "peer-checked:border-ui-accent peer-checked:bg-ui-accent/5 peer-checked:shadow-sm",
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-ui-accent peer-focus-visible:ring-offset-2",
                    "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
                  )}
                >
                  <span className="text-sm font-bold">{option.label}</span>
                  <div className="absolute top-3 right-3 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                    <div className="w-4 h-4 rounded-full bg-ui-accent flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
      {error?.message && <ErrorMessage message={error.message} />}
    </div>
  );
};

export default Radio;
