import { twMerge } from "tailwind-merge";

interface CardProps {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "accent";
  children: React.ReactNode;
  as?: "div" | "article" | "section";
  /** Heading level for title (h2-h6). Important for screen reader navigation. */
  titleAs?: "h2" | "h3" | "h4" | "h5" | "h6";
  /** Accessible label for section/article (required when as="section") */
  "aria-label"?: string;
  /** ID of element that labels this card */
  "aria-labelledby"?: string;
}

const Card = ({
  title,
  footer,
  className,
  variant = "outline",
  children,
  as: Component = "div",
  titleAs: TitleComponent = "h3",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: CardProps) => {
  const baseCardClass =
    "rounded-sm border font-display transition-colors overflow-hidden";

  const semanticClasses = {
    div: "",
    article: "max-w-prose",
    section: "",
  };

  const variantClasses = {
    default: "bg-ui-primary text-ui-bg border-transparent",
    outline: "bg-ui-bg text-ui-primary border-ui-border",
    accent: "bg-ui-accent text-ui-bg border-transparent",
  };

  const innerBorderClass = {
    default: "border-ui-bg/20",
    outline: "border-ui-border/30",
    accent: "border-ui-bg/20",
  };

  return (
    <Component
      className={twMerge(
        baseCardClass,
        semanticClasses[Component],
        variantClasses[variant],
        className,
      )}
      // A11y: Provide accessible name for landmarks
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
    >
      {title && (
        <TitleComponent
          className={twMerge(
            "px-5 py-3 border-b font-bold text-lg leading-tight",
            innerBorderClass[variant],
          )}
        >
          {title}
        </TitleComponent>
      )}

      <div className="px-5 py-4 text-base leading-relaxed">{children}</div>

      {footer && (
        <footer className="px-5 py-2.5 border-t border-ui-border/20 text-sm italic">
          {/* Removed opacity-80 for better contrast, use a dedicated muted color instead */}
          {footer}
        </footer>
      )}
    </Component>
  );
};

export default Card;
