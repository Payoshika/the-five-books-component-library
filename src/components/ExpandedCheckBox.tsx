import { useState, useRef, useEffect, useId } from "react";
import CheckBox, { type CheckBoxProps } from "./CheckBox";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import ErrorMessage from "./ErrorMessage";
const ExpandedCheckBox = ({
  options,
  onValueChange,
  error,
  ref,
  ...props
}: CheckBoxProps) => {
  const [isCheckboxOpen, setIsCheckBoxOpen] = useState(false);
  const handleToggleCheckBox = () => {
    setIsCheckBoxOpen(!isCheckboxOpen);
  };
  const checkedOptions = options.filter((option) => option.checked);
  const markedCount = checkedOptions.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const errorId = useId();

  //detection of clicking outside
  useEffect(() => {
    if (!isCheckboxOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsCheckBoxOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsCheckBoxOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCheckboxOpen]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        className={twMerge(
          "w-full border border-ui-border p-2 flex justify-between items-center rounded-md",
          isCheckboxOpen && "border-ui-accent",
        )}
        onClick={handleToggleCheckBox}
        aria-haspopup={true}
        aria-expanded={isCheckboxOpen}
        aria-controls={menuId}
        aria-describedby={error?.message ? errorId : undefined}
      >
        {markedCount > 0 ? (
          <div className="flex items-center gap-1 text-sm">
            {checkedOptions.slice(0, 3).map((option) => {
              return (
                <span className="py-0.5 px-1.5 border rounded-full bg-ui-accent text-ui-bg">
                  {option.label}
                </span>
              );
            })}
            <span className="text-ui-secondary">
              {markedCount > 3 && `+${markedCount - 3} more`}
            </span>
          </div>
        ) : (
          <span className="text-ui-secondary">click to open the option</span>
        )}
        <ChevronDown
          className={twMerge(
            "h-4 w-4 opacity-50 transition-transform",
            isCheckboxOpen && "rotate-180",
          )}
        />
      </button>
      {isCheckboxOpen && (
        <CheckBox
          options={options}
          onValueChange={onValueChange}
          ref={ref}
          {...props}
          className="absolute z-50 w-full p-1 border border-ui-border bg-ui-bg rounded-md mt-0.5"
        />
      )}
      <ErrorMessage
        message={error?.message}
        id={errorId}
        className="mt-2 px-2" // component-specific spacing
      />
    </div>
  );
};

export default ExpandedCheckBox;
