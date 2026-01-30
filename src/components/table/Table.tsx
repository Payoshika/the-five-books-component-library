//table component will dictate the grid structure of the table
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface TableProps {
  children: ReactNode;
  className?: string;
  caption?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const Table = ({
  children,
  className,
  caption,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: TableProps) => {
  return (
    <div
      role="region"
      aria-label="Scrollable table"
      tabIndex={0}
      className="w-full overflow-x-auto border border-ui-border rounded-md bg-ui-bg"
    >
      <table
        className={twMerge(
          "w-full table-fixed text-sm text-left border-collapse font-display",
          className,
        )}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
      >
        {caption && (
          <caption className="px-4 py-3 text-left text-ui-secondary font-semibold">
            {caption}
          </caption>
        )}
        {children}
      </table>
    </div>
  );
};
export default Table;
