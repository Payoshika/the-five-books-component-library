import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";

export interface ButtonProps extends ComponentProps<"button"> {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "outline" | "primary" | "accent" | "danger";
  isLoading?: boolean;
  ariaLabel?: string;
}
export const Button = ({
  size = "md",
  variant = "default",
  isLoading = false,
  ariaLabel,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) => {
  const { t } = useTranslation();
  const baseButtonClass =
    "relative border rounded-sm cursor-pointer disabled:cursor-not-allowed transition-all enabled:active:scale-98 font-medium font-display inline-flex items-center justify-center overflow-hidden " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ui-accent outline-none";

  const sizeClasses = {
    // 最小クリックエリアを意識したpx/pyの調整
    xs: "px-2 py-1 text-xs min-w-8 min-h-6",
    sm: "px-3 py-1.5 text-sm min-w-12 min-h-8",
    md: "px-5 py-2.5 text-base min-w-16 min-h-10",
    lg: "px-8 py-3.5 text-lg min-w-20 min-h-12",
  };

  const variantClasses = {
    default: "bg-ui-primary text-ui-bg border-ui-primary hover:opacity-90",
    outline:
      "bg-ui-bg text-ui-primary border-ui-border hover:border-ui-primary",
    primary: "bg-ui-secondary text-ui-bg border-ui-secondary hover:opacity-90",
    accent: "bg-ui-accent text-ui-bg border-ui-accent hover:opacity-90",
    danger: "bg-ui-danger text-ui-bg border-ui-danger hover:opacity-90",
  };

  return (
    <button
      className={twMerge(
        baseButtonClass,
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      disabled={isLoading || disabled}
      // A11y: 処理中であることを伝える
      aria-busy={isLoading}
      // A11y: ライブリージョンで状態変化を通知（必要に応じて）
      aria-live="polite"
      aria-label={isLoading ? t("common.loading") : ariaLabel}
      {...props}
    >
      {isLoading && (
        <>
          {/* 視覚的なドット */}
          <span
            className="absolute inset-0 flex items-center justify-center gap-1 bg-inherit z-10"
            aria-hidden="true"
          >
            <span className="h-1 w-1 animate-bounce rounded-full bg-current" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:0.2s]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:0.4s]" />
          </span>
          {/* スクリーンリーダー専用のテキスト */}
          <span className="sr-only">{t("common.loading")}</span>
        </>
      )}

      <span
        className={twMerge(
          "flex items-center gap-2 transition-opacity",
          isLoading ? "invisible" : "visible",
        )}
      >
        {children}
      </span>
    </button>
  );
};
