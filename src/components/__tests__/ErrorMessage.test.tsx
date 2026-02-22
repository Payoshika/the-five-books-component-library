import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ErrorMessage from "../ErrorMessage";

describe("ErrorMessage", () => {
  // ============================================
  // 1. Basic Rendering
  // ============================================
  describe("Basic Rendering", () => {
    it("renders the error message text when message is provided", () => {
      render(<ErrorMessage message="This field is required" />);
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("renders as a <p> element", () => {
      render(<ErrorMessage message="Error" />);
      const element = screen.getByRole("alert");
      expect(element.tagName).toBe("P");
    });

    it("renders with role='alert' for accessibility", () => {
      render(<ErrorMessage message="Error occurred" />);
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
    });

    it("applies default styling classes", () => {
      render(<ErrorMessage message="Styled error" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("text-xs", "text-ui-danger", "leading-5");
    });
  });

  // ============================================
  // 2. Conditional Rendering (returns null)
  // ============================================
  describe("Conditional Rendering", () => {
    it("returns null when message is undefined", () => {
      const { container } = render(<ErrorMessage />);
      expect(container.innerHTML).toBe("");
    });

    it("returns null when message is an empty string", () => {
      const { container } = render(<ErrorMessage message="" />);
      expect(container.innerHTML).toBe("");
    });

    it("does not render role='alert' when message is undefined", () => {
      render(<ErrorMessage />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("does not render role='alert' when message is empty string", () => {
      render(<ErrorMessage message="" />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // 3. ID Prop
  // ============================================
  describe("ID Prop", () => {
    it("applies id attribute when id prop is provided", () => {
      render(<ErrorMessage message="Error" id="error-email" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveAttribute("id", "error-email");
    });

    it("does not have id attribute when id prop is not provided", () => {
      render(<ErrorMessage message="Error" />);
      const alert = screen.getByRole("alert");
      expect(alert).not.toHaveAttribute("id");
    });

    it("supports id for aria-describedby association", () => {
      const { container } = render(
        <div>
          <input aria-describedby="field-error" />
          <ErrorMessage message="Invalid input" id="field-error" />
        </div>,
      );
      const input = container.querySelector("input");
      const errorElement = screen.getByRole("alert");
      expect(input).toHaveAttribute("aria-describedby", errorElement.id);
    });
  });

  // ============================================
  // 4. Custom className
  // ============================================
  describe("Custom className", () => {
    it("applies custom className alongside default classes", () => {
      render(<ErrorMessage message="Error" className="mt-2" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("mt-2");
      expect(alert).toHaveClass("text-xs", "text-ui-danger", "leading-5");
    });

    it("applies multiple custom class names", () => {
      render(<ErrorMessage message="Error" className="mt-4 font-bold" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("mt-4", "font-bold");
    });

    it("allows overriding default classes via twMerge", () => {
      render(<ErrorMessage message="Error" className="text-sm" />);
      const alert = screen.getByRole("alert");
      // twMerge should resolve conflicting text-size classes
      expect(alert).toHaveClass("text-sm");
    });

    it("preserves default classes when className is not provided", () => {
      render(<ErrorMessage message="Error" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("text-xs", "text-ui-danger", "leading-5");
    });
  });

  // ============================================
  // 5. Message Content
  // ============================================
  describe("Message Content", () => {
    it("displays short error messages", () => {
      render(<ErrorMessage message="Required" />);
      expect(screen.getByText("Required")).toBeInTheDocument();
    });

    it("displays long error messages", () => {
      const longMessage =
        "This field must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.";
      render(<ErrorMessage message={longMessage} />);
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it("displays error messages with special characters", () => {
      render(<ErrorMessage message="Value must be > 0 & < 100" />);
      expect(
        screen.getByText("Value must be > 0 & < 100"),
      ).toBeInTheDocument();
    });

    it("displays error messages with unicode characters", () => {
      render(<ErrorMessage message="入力が必要です 🚨" />);
      expect(screen.getByText("入力が必要です 🚨")).toBeInTheDocument();
    });

    it("displays single character error message", () => {
      render(<ErrorMessage message="!" />);
      expect(screen.getByText("!")).toBeInTheDocument();
    });
  });

  // ============================================
  // 6. Rerendering Behavior
  // ============================================
  describe("Rerendering Behavior", () => {
    it("updates message when prop changes", () => {
      const { rerender } = render(<ErrorMessage message="First error" />);
      expect(screen.getByText("First error")).toBeInTheDocument();

      rerender(<ErrorMessage message="Second error" />);
      expect(screen.queryByText("First error")).not.toBeInTheDocument();
      expect(screen.getByText("Second error")).toBeInTheDocument();
    });

    it("removes element when message changes from string to undefined", () => {
      const { rerender } = render(<ErrorMessage message="Error" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();

      rerender(<ErrorMessage message={undefined} />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("removes element when message changes from string to empty string", () => {
      const { rerender } = render(<ErrorMessage message="Error" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();

      rerender(<ErrorMessage message="" />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("shows element when message changes from undefined to string", () => {
      const { rerender } = render(<ErrorMessage message={undefined} />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();

      rerender(<ErrorMessage message="New error" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("New error")).toBeInTheDocument();
    });
  });

  // ============================================
  // 7. All Props Combined
  // ============================================
  describe("All Props Combined", () => {
    it("renders correctly with all props provided", () => {
      render(
        <ErrorMessage
          message="Complete error"
          id="complete-error"
          className="mt-2 font-semibold"
        />,
      );
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Complete error");
      expect(alert).toHaveAttribute("id", "complete-error");
      expect(alert).toHaveClass(
        "text-ui-danger",
        "leading-5",
        "mt-2",
        "font-semibold",
      );
    });

    it("renders correctly with only message prop", () => {
      render(<ErrorMessage message="Minimal" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Minimal");
      expect(alert).not.toHaveAttribute("id");
      expect(alert).toHaveClass("text-xs", "text-ui-danger", "leading-5");
    });
  });
});
