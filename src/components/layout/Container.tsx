//mobile responsive and large screen adaptable container
import { twMerge } from "tailwind-merge";

interface ContainerProps {
  children: React.ReactNode;
  size?: "default" | "narrow" | "full";
  className: string;
}

export const Container = ({
  children,
  size = "default",
  className,
}: ContainerProps) => {
  const maxProps = {
    default: "max-w-10xl",
    narrow: "max-w-3xl",
    full: "max-w-full",
  };

  return (
    <div
      className={twMerge(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        maxProps[size],
        className,
      )}
    >
      {children}
    </div>
  );
};
