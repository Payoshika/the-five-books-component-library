import { useState, useRef, useEffect, useId } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronDown, Check } from "lucide-react";
import { type Option } from "../types/utils.types";
import ErrorMessage from "./ErrorMessage";

interface SelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  onBlur?: () => void;
  error?: { message?: string };
  variant?: "default" | "filled" | "accent";
  ref?: React.Ref<HTMLButtonElement>;
  label?: string;
}

const Select = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  name,
  onBlur,
  error,
  variant = "default",
  ref,
  label,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const generatedId = useId();
  const errorId = `error-${generatedId}`;

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onBlur?.();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onBlur]);

  const baseSelectClasses =
    "flex h-10 w-full items-center justify-between rounded-sm border px-3 py-2 text-sm font-display transition-all focus:outline-none focus:ring-1";
  const variantSelectClasses = {
    default: "bg-ui-bg text-ui-primary border-ui-border focus:ring-ui-accent",
    filled: "bg-ui-primary text-ui-bg border-ui-primary focus:ring-ui-accent",
    accent: "bg-ui-accent text-ui-bg border-ui-accent focus:ring-ui-primary",
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div
      className={twMerge("relative w-full flex flex-col gap-1", className)}
      ref={containerRef}
    >
      {label && (
        <span className="text-sm font-medium text-ui-primary px-1">
          {label}
        </span>
      )}

      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        ref={ref}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-invalid={!!error?.message}
        aria-describedby={error?.message ? errorId : undefined}
        className={twMerge(
          baseSelectClasses,
          variantSelectClasses[variant],
          error?.message && "border-ui-danger ring-ui-danger",
          isOpen && "ring-1",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!selectedOption ? "opacity-50" : ""}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={twMerge(
            "h-4 w-4 opacity-50 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <ul
          className={twMerge(
            "absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-sm border p-1 shadow-lg animate-in fade-in zoom-in-95 duration-100",
            variant === "filled"
              ? "bg-ui-primary text-ui-bg border-ui-primary"
              : "bg-ui-bg text-ui-primary border-ui-border",
          )}
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                className={twMerge(
                  "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-ui-accent hover:text-ui-bg",
                  isSelected && "font-bold text-ui-accent",
                )}
                onClick={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
              >
                {isSelected && (
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
      <ErrorMessage
        message={error?.message}
        id={errorId}
        className="mt-2 px-2" // component-specific spacing
      />
    </div>
  );
};

export default Select;
