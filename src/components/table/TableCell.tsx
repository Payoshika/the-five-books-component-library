import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const TC = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <td className={twMerge("px-4 py-3 align-middle text-ui-primary", className)}>
    <div
      className="truncate w-full"
      title={typeof children === "string" ? children : undefined}
    >
      {children}
    </div>
  </td>
);

export default TC;
