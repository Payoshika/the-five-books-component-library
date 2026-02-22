import { twMerge } from "tailwind-merge";
import { type ComponentProps } from "react";

interface DividerProps extends ComponentProps<"hr"> {
  variant?:
    | "border"
    | "primary"
    | "secondary"
    | "accent"
    | "danger"
    | "success";
  styleVariant?: "solid" | "dashed" | "dotted";
  thickness?: "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
}

export const Divider = ({
  variant = "border",
  styleVariant = "solid",
  thickness = "sm",
  orientation = "horizontal",
  className,
  ...props
}: DividerProps) => {
  const isVertical = orientation === "vertical";

  const baseDividerClass = isVertical
    ? "h-auto self-stretch border-0 min-h-[1em] inline-block"
    : "w-full border-0";

  const variantClass = {
    border: "border-ui-border",
    primary: "border-ui-primary",
    secondary: "border-ui-secondary",
    accent: "border-ui-accent",
    danger: "border-ui-danger",
    success: "border-ui-success",
  };

  const styleVariantClass = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
  };

  const thicknessClass = {
    horizontal: {
      sm: "border-t",
      md: "border-t-2",
      lg: "border-t-4",
    },
    vertical: {
      sm: "border-l",
      md: "border-l-2",
      lg: "border-l-4",
    },
  };

  return (
    <hr
      aria-orientation={orientation}
      className={twMerge(
        baseDividerClass,
        variantClass[variant],
        styleVariantClass[styleVariant],
        thicknessClass[orientation][thickness],
        className,
      )}
      {...props}
    />
  );
};
