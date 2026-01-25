import { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  onBlur?: () => void;
  error?: boolean;
  variant?: "default" | "filled" | "accent";
  ref?: React.Ref<HTMLButtonElement>;
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
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onBlur]);

  // Base classes for the select button
  const baseSelectClasses =
    "flex h-10 w-full items-center justify-between rounded-sm border px-3 py-2 text-sm font-display transition-all focus:outline-none focus:ring-1";

  // Variant classes for the select button
  const variantSelectClasses = {
    default: "bg-ui-bg text-ui-primary border-ui-border focus:ring-ui-accent",
    filled: "bg-ui-primary text-ui-bg border-ui-primary focus:ring-ui-accent",
    accent: "bg-ui-accent text-ui-bg border-ui-accent focus:ring-ui-primary",
  };

  // Base classes for dropdown container
  const baseOptionContainerClasses =
    "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-sm border p-1 shadow-lg animate-in fade-in zoom-in-95 duration-100";

  // Variant classes for dropdown container
  const variantOptionContainerClasses = {
    default: "bg-ui-bg text-ui-primary border-ui-border",
    filled: "bg-ui-primary text-ui-bg border-ui-primary",
    accent: "bg-ui-bg text-ui-primary border-ui-border",
  };

  // Base classes for options
  const baseOptionClasses =
    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none transition-colors";

  // Variant classes for options (hover state)
  const variantOptionClasses = {
    default: "hover:bg-ui-primary hover:text-ui-bg",
    filled: "hover:bg-ui-bg hover:text-ui-primary",
    accent: "hover:bg-ui-accent hover:text-ui-bg",
  };

  // Selected option highlight per variant
  const variantSelectedClasses = {
    default: "font-bold text-ui-accent",
    filled: "font-bold text-ui-accent",
    accent: "font-bold text-ui-accent",
  };

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={twMerge("relative w-full", className)} ref={containerRef}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        ref={ref}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={twMerge(
          baseSelectClasses,
          variantSelectClasses[variant],
          error && "border-ui-danger ring-ui-danger",
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
            baseOptionContainerClasses,
            variantOptionContainerClasses[variant],
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
                  baseOptionClasses,
                  variantOptionClasses[variant],
                  isSelected && variantSelectedClasses[variant],
                )}
                onClick={() => handleSelect(option.value)}
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
    </div>
  );
};

export default Select;
