import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface TableRowProps {
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

const TableRow = ({ children, icon, action, className }: TableRowProps) => {
  return (
    <tr
      className={twMerge(
        "group border-b border-ui-border hover:bg-ui-primary/5 transition-colors",
        className,
      )}
    >
      <td>
        {icon && (
          <div className="w-10 pl-4 py-3 text-ui-secondary" aria-hidden="true">
            {icon}
          </div>
        )}
      </td>
      {children}
      <td>
        <div className="w-10 px-2 py-3 text-center">
          <div className="flex items-center justify-end">{action}</div>
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
