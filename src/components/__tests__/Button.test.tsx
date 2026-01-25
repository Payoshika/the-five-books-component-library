import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import Button from "../Button";

// Helper to render with i18n provider
const renderWithI18n = (ui: React.ReactElement, locale = "en") => {
  i18n.changeLanguage(locale);
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
};

describe("Button", () => {
  beforeEach(() => {
    i18n.changeLanguage("en");
  });

  // ============================================
  // 1. Basic Rendering
  // ============================================
  describe("Basic Rendering", () => {
    it("renders children content correctly", () => {
      renderWithI18n(<Button>Click me</Button>);
      expect(screen.getByRole("button")).toHaveTextContent("Click me");
    });

    it("renders with default props", () => {
      renderWithI18n(<Button>Default</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "false");
    });

    it("applies custom className alongside default classes", () => {
      renderWithI18n(<Button className="custom-class">Styled</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
      // Should still have base classes
      expect(button).toHaveClass("relative", "border", "rounded-sm");
    });
  });

  // ============================================
  // 2. Size Variants
  // ============================================
  describe("Size Variants", () => {
    it("renders with size='xs' and applies correct classes", () => {
      renderWithI18n(<Button size="xs">XS Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-2", "py-1", "text-xs");
    });

    it("renders with size='sm' and applies correct classes", () => {
      renderWithI18n(<Button size="sm">SM Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-3", "text-sm");
    });

    it("renders with size='md' (default) and applies correct classes", () => {
      renderWithI18n(<Button size="md">MD Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-5", "text-base");
    });

    it("renders with size='lg' and applies correct classes", () => {
      renderWithI18n(<Button size="lg">LG Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-8", "text-lg");
    });
  });

  // ============================================
  // 3. Style Variants
  // ============================================
  describe("Style Variants", () => {
    it("renders with variant='default' and applies correct classes", () => {
      renderWithI18n(<Button variant="default">Default</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-ui-primary", "text-ui-bg");
    });

    it("renders with variant='outline' and applies correct classes", () => {
      renderWithI18n(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "bg-ui-bg",
        "text-ui-primary",
        "border-ui-border",
      );
    });

    it("renders with variant='primary' and applies correct classes", () => {
      renderWithI18n(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-ui-secondary", "text-ui-bg");
    });

    it("renders with variant='accent' and applies correct classes", () => {
      renderWithI18n(<Button variant="accent">Accent</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-ui-accent", "text-ui-bg");
    });

    it("renders with variant='danger' and applies correct classes", () => {
      renderWithI18n(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-ui-danger", "text-ui-bg");
    });
  });

  // ============================================
  // 4. Loading State
  // ============================================
  describe("Loading State", () => {
    it("shows loading indicator when isLoading=true", () => {
      renderWithI18n(<Button isLoading>Submit</Button>);
      // Check for the loading dots container
      const loadingContainer = screen
        .getByRole("button")
        .querySelector('[aria-hidden="true"]');
      expect(loadingContainer).toBeInTheDocument();
    });

    it("hides children content visually when loading", () => {
      renderWithI18n(<Button isLoading>Submit</Button>);
      const childrenContainer = screen.getByText("Submit").parentElement;
      expect(childrenContainer).toHaveClass("invisible");
    });

    it("disables button when loading", () => {
      renderWithI18n(<Button isLoading>Submit</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("sets aria-busy='true' when loading", () => {
      renderWithI18n(<Button isLoading>Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    });

    it("sets aria-label to translated loading text when loading", () => {
      renderWithI18n(<Button isLoading>Submit</Button>, "en");
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Loading...",
      );
    });

    it("shows screen-reader-only loading text", () => {
      renderWithI18n(<Button isLoading>Submit</Button>);
      const srOnlyText = screen.getByText("Loading...");
      expect(srOnlyText).toHaveClass("sr-only");
    });

    it("does not show loading indicator when isLoading=false", () => {
      renderWithI18n(<Button isLoading={false}>Submit</Button>);
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // 5. Disabled State
  // ============================================
  describe("Disabled State", () => {
    it("disables button when disabled=true", () => {
      renderWithI18n(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("disables button when both disabled and isLoading are true", () => {
      renderWithI18n(
        <Button disabled isLoading>
          Both
        </Button>,
      );
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("button is enabled when disabled=false and isLoading=false", () => {
      renderWithI18n(<Button>Enabled</Button>);
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  // ============================================
  // 6. Accessibility (A11y)
  // ============================================
  describe("Accessibility", () => {
    it("has aria-live='polite' attribute", () => {
      renderWithI18n(<Button>A11y Button</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("aria-live", "polite");
    });

    it("uses custom ariaLabel when provided and not loading", () => {
      renderWithI18n(<Button ariaLabel="Custom Label">Button</Button>);
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Custom Label",
      );
    });

    it("overrides ariaLabel with loading text when isLoading=true", () => {
      renderWithI18n(
        <Button ariaLabel="Custom Label" isLoading>
          Button
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Loading...",
      );
    });

    it("loading dots container has aria-hidden='true'", () => {
      renderWithI18n(<Button isLoading>Submit</Button>);
      const dotsContainer = screen
        .getByRole("button")
        .querySelector('[aria-hidden="true"]');
      expect(dotsContainer).toBeInTheDocument();
    });

    it("does not have aria-label when not provided and not loading", () => {
      renderWithI18n(<Button>No Label</Button>);
      expect(screen.getByRole("button")).not.toHaveAttribute("aria-label");
    });
  });

  // ============================================
  // 7. Event Handling
  // ============================================
  describe("Event Handling", () => {
    it("calls onClick handler when clicked", () => {
      const handleClick = vi.fn();
      renderWithI18n(<Button onClick={handleClick}>Click</Button>);
      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", () => {
      const handleClick = vi.fn();
      renderWithI18n(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>,
      );
      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("does not call onClick when loading", () => {
      const handleClick = vi.fn();
      renderWithI18n(
        <Button onClick={handleClick} isLoading>
          Loading
        </Button>,
      );
      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("passes through native button props", () => {
      renderWithI18n(
        <Button type="submit" name="submit-btn">
          Submit
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("name", "submit-btn");
    });
  });

  // ============================================
  // 8. Internationalization (i18n)
  // ============================================
  describe("Internationalization", () => {
    it("displays English loading text when locale is 'en'", () => {
      renderWithI18n(<Button isLoading>Submit</Button>, "en");
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Loading...",
      );
    });

    it("displays Japanese loading text when locale is 'ja'", () => {
      renderWithI18n(<Button isLoading>Submit</Button>, "ja");
      expect(screen.getByText("ローディング中...")).toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "ローディング中...",
      );
    });
  });
});
