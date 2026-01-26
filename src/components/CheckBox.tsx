import { type Option } from "../types/utils.types";
import { type ComponentProps } from "react";

export interface CheckBoxOption extends Option {
  checked: boolean;
}

export interface CheckBoxProps
  extends Omit<ComponentProps<"input">, "onClick"> {
  options: CheckBoxOption[];
  error: { message?: string };
  onValueChange: (value: string) => void;
}

const CheckBox = ({
  options,
  onValueChange,
  error,
  ref,
  ...props
}: CheckBoxProps) => {
  const errorId = `error-${options[0]?.value || "checkbox"}`;
  return (
    <fieldset className="">
      <legend className="sr-only">choose your options</legend>{" "}
      {options.map((option) => {
        return (
          <label
            key={option.value}
            className="flex items-start gap-3 px-2 py-3 cursor-pointer select-none
                                 transition-colors duration-200
                                 hover:bg-ui-secondary/5
                                 active:bg-ui-secondary/10
                                 rounded-md"
          >
            <input
              {...props}
              ref={ref}
              id={option.value}
              type="checkbox"
              value={option.value}
              checked={option.checked}
              name={option.value}
              onChange={() => onValueChange(option.value)}
              className="accent-ui-accent h-4 w-4 mt-1 shrink-0 cursor-pointer focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-ui-accent"
              aria-invalid={!!error?.message}
              aria-describedby={error?.message ? errorId : undefined}
            />
            <div className="flex flex-col">
              <span className="text-ui-primary select-none cursor-pointer">
                {option.label}
              </span>
              {option.description && (
                <span className="text-ui-secondary select-none cursor-pointer">
                  {option.description}
                </span>
              )}
            </div>
          </label>
        );
      })}
      {error?.message && (
        <p
          id={errorId}
          role="alert"
          className="text-ui-danger text-sm mt-2 px-2"
        >
          {" "}
          {error.message}
        </p>
      )}
    </fieldset>
  );
};

export default CheckBox;
