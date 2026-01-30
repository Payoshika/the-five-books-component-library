import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const TableHeader = ({ children }: { children: ReactNode }) => {
  return (
    <thead className="bg-ui-bg border-b border-ui-border uppercase text-xs text-ui-secondary">
      <tr>
        <th className="w-10 px-4 py-3" scope="col">
          <span className="sr-only">Row icon</span>
        </th>
        {children}
        <th className="w-10 px-4 py-3" scope="col">
          <span className="sr-only">Row action</span>
        </th>
      </tr>
    </thead>
  );
};

export const THC = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <th
      scope="col"
      className={twMerge("px-4 py-3 font-semibold text-ui-primary", className)}
    >
      {children}
    </th>
  );
};

export default TableHeader;
