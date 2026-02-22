import { useState, useMemo, useId, type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "./Button";
import ErrorMessage from "./ErrorMessage";

export interface TextAreaProps extends ComponentProps<"textarea"> {
  label?: string;
  error?: { message?: string };
  maxChar?: number;
  componentAction?: () => void;
  actionLabel?: string;
}
const TextArea = ({
  label,
  error,
  maxChar = 500,
  componentAction,
  actionLabel,
  className,
  onChange,
  ref,
  id: manualId,
  ...props
}: TextAreaProps) => {
  const [count, setCount] = useState(0);
  const generatedId = useId();
  const textareaId = manualId || generatedId;
  const errorId = `error-${textareaId}`;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCount(e.target.value.length);
    if (onChange) onChange(e);
  };

  const dynamicHeight = useMemo(() => {
    const calculated = Math.floor(maxChar / 4);
    return Math.min(400, Math.max(100, calculated));
  }, [maxChar]);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-ui-primary" // 変数により自動切り替え
        >
          {label}
        </label>
      )}

      <div
        className={twMerge(
          "flex flex-col w-full rounded-md border transition-all bg-ui-bg overflow-hidden",
          error
            ? "border-ui-danger shadow-[0_0_0_1px_rgba(var(--color-ui-danger),0.1)]"
            : "border-ui-border focus-within:ring-2 focus-within:ring-ui-accent/20 focus-within:border-ui-accent",
        )}
      >
        <textarea
          id={textareaId}
          ref={ref}
          onChange={handleChange}
          maxLength={maxChar}
          style={{ height: `${dynamicHeight}px` }}
          className={twMerge(
            "w-full p-3 text-sm outline-none resize-none bg-transparent text-ui-primary placeholder:text-ui-secondary/50",
            className,
          )}
          {...props}
        />

        {componentAction && actionLabel && (
          <div className="flex items-center justify-end px-3 py-2 bg-transparent">
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={componentAction}
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start min-h-5">
        <ErrorMessage
          message={error?.message}
          id={errorId}
          className="mt-2 text-ui-danger" // 自動切り替え
          aria-live="polite"
        />

        {maxChar !== undefined && (
          <div
            role="status"
            aria-live="polite"
            className={twMerge(
              "text-xs leading-5",
              count >= maxChar
                ? "text-ui-danger font-bold"
                : "text-ui-secondary",
            )}
          >
            {count} / {maxChar}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextArea;
