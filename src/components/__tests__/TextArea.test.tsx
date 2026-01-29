import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import TextArea from "../TextArea";

describe("TextArea", () => {
  // ============================================
  // 1. Basic Rendering
  // ============================================
  describe("Basic Rendering", () => {
    it("renders a textarea element", () => {
      render(<TextArea />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders with placeholder text", () => {
      render(<TextArea placeholder="Enter your message..." />);
      expect(
        screen.getByPlaceholderText("Enter your message..."),
      ).toBeInTheDocument();
    });

    it("renders with default value", () => {
      render(<TextArea defaultValue="Hello, World!" />);
      expect(screen.getByRole("textbox")).toHaveValue("Hello, World!");
    });

    it("applies custom className to textarea", () => {
      render(<TextArea className="custom-class" />);
      expect(screen.getByRole("textbox")).toHaveClass("custom-class");
    });

    it("renders without label when not provided", () => {
      render(<TextArea />);
      expect(screen.queryByRole("label")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // 2. Label Rendering
  // ============================================
  describe("Label Rendering", () => {
    it("renders label when provided", () => {
      render(<TextArea label="Description" />);
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("associates label with textarea via htmlFor", () => {
      render(<TextArea label="Bio" id="bio-textarea" />);
      const label = screen.getByText("Bio");
      const textarea = screen.getByRole("textbox");
      expect(label).toHaveAttribute("for", "bio-textarea");
      expect(textarea).toHaveAttribute("id", "bio-textarea");
    });

    it("generates id automatically when not provided", () => {
      render(<TextArea label="Comments" />);
      const label = screen.getByText("Comments");
      const textarea = screen.getByRole("textbox");
      expect(label).toHaveAttribute("for");
      expect(textarea.id).toBe(label.getAttribute("for"));
    });

    it("applies correct styling to label", () => {
      render(<TextArea label="Notes" />);
      const label = screen.getByText("Notes");
      expect(label).toHaveClass("text-sm", "font-medium", "text-ui-primary");
    });
  });

  // ============================================
  // 3. Character Counter
  // ============================================
  describe("Character Counter", () => {
    it("displays character counter with default maxChar (500)", () => {
      render(<TextArea />);
      expect(screen.getByText(/0 \/ 500/)).toBeInTheDocument();
    });

    it("displays character counter with custom maxChar", () => {
      render(<TextArea maxChar={100} />);
      expect(screen.getByText("0 / 100")).toBeInTheDocument();
    });

    it("updates character count when typing", async () => {
      const user = userEvent.setup();
      render(<TextArea maxChar={100} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Hello");

      expect(screen.getByText("5 / 100")).toBeInTheDocument();
    });

    it("enforces maxLength on textarea", () => {
      render(<TextArea maxChar={10} />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("maxLength", "10");
    });

    it("applies normal styling when count is below 80% threshold", async () => {
      const user = userEvent.setup();
      render(<TextArea maxChar={100} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Short");

      const counter = screen.getByText("5 / 100");
      expect(counter).toHaveClass("text-ui-secondary");
      expect(counter).not.toHaveClass("text-ui-danger");
    });

    it("applies danger styling when count reaches maxChar", async () => {
      const user = userEvent.setup();
      render(<TextArea maxChar={10} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "1234567890");

      const counter = screen.getByText("10 / 10");
      expect(counter).toHaveClass("text-ui-danger", "font-bold");
    });

    it("has aria-live='polite' for screen reader announcements", () => {
      render(<TextArea />);
      const counter = screen.getByText(/0 \/ 500/);
      expect(counter).toHaveAttribute("aria-live", "polite");
    });
  });

  // ============================================
  // 4. Error State
  // ============================================
  describe("Error State", () => {
    it("displays error message when error is provided", () => {
      render(<TextArea error={{ message: "This field is required" }} />);
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("does not display error message when error is undefined", () => {
      render(<TextArea />);
      // ErrorMessage component returns null when no message
      const errorElement = screen.queryByText(/error/i);
      expect(errorElement).not.toBeInTheDocument();
    });

    it("does not display error message when error.message is undefined", () => {
      render(<TextArea error={{}} />);
      // ErrorMessage component returns null when message is undefined
      const errorElement = screen.queryByText(/error/i);
      expect(errorElement).not.toBeInTheDocument();
    });

    it("applies error border styling when error is present", () => {
      render(<TextArea error={{ message: "Error" }} />);
      const container = screen.getByRole("textbox").parentElement;
      expect(container).toHaveClass("border-ui-danger");
    });

    it("applies normal border styling when no error", () => {
      render(<TextArea />);
      const container = screen.getByRole("textbox").parentElement;
      expect(container).toHaveClass("border-ui-border");
      expect(container).not.toHaveClass("border-ui-danger");
    });
  });

  // ============================================
  // 5. Action Button
  // ============================================
  describe("Action Button", () => {
    it("renders action button when componentAction and actionLabel are provided", () => {
      const handleAction = vi.fn();
      render(<TextArea componentAction={handleAction} actionLabel="Submit" />);
      expect(
        screen.getByRole("button", { name: "Submit" }),
      ).toBeInTheDocument();
    });

    it("does not render action button when only componentAction is provided", () => {
      const handleAction = vi.fn();
      render(<TextArea componentAction={handleAction} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("does not render action button when only actionLabel is provided", () => {
      render(<TextArea actionLabel="Submit" />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("calls componentAction when action button is clicked", async () => {
      const user = userEvent.setup();
      const handleAction = vi.fn();
      render(<TextArea componentAction={handleAction} actionLabel="Send" />);

      await user.click(screen.getByRole("button", { name: "Send" }));

      expect(handleAction).toHaveBeenCalledTimes(1);
    });

    it("action button has type='button' to prevent form submission", () => {
      const handleAction = vi.fn();
      render(<TextArea componentAction={handleAction} actionLabel="Save" />);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });
  });

  // ============================================
  // 6. onChange Handler
  // ============================================
  describe("onChange Handler", () => {
    it("calls onChange when typing", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<TextArea onChange={handleChange} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Test");

      expect(handleChange).toHaveBeenCalled();
    });

    it("passes event to onChange handler", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<TextArea onChange={handleChange} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "A");

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "A",
          }),
        }),
      );
    });

    it("updates internal count even without onChange handler", async () => {
      const user = userEvent.setup();
      render(<TextArea maxChar={100} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Hello");

      expect(screen.getByText("5 / 100")).toBeInTheDocument();
    });
  });

  // ============================================
  // 7. Dynamic Height
  // ============================================
  describe("Dynamic Height", () => {
    it("calculates height based on maxChar", () => {
      render(<TextArea maxChar={400} />);
      const textarea = screen.getByRole("textbox");
      // Height = Math.min(400, Math.max(100, Math.floor(400/4))) = Math.min(400, Math.max(100, 100)) = 100
      expect(textarea).toHaveStyle({ height: "100px" });
    });

    it("caps height at 400px for large maxChar values", () => {
      render(<TextArea maxChar={2000} />);
      const textarea = screen.getByRole("textbox");
      // Height = Math.min(400, Math.max(100, Math.floor(2000/4))) = Math.min(400, 500) = 400
      expect(textarea).toHaveStyle({ height: "400px" });
    });

    it("enforces minimum height of 100px for small maxChar values", () => {
      render(<TextArea maxChar={50} />);
      const textarea = screen.getByRole("textbox");
      // Height = Math.min(400, Math.max(100, Math.floor(50/4))) = Math.min(400, Math.max(100, 12)) = 100
      expect(textarea).toHaveStyle({ height: "100px" });
    });

    it("applies default maxChar (500) height calculation", () => {
      render(<TextArea />);
      const textarea = screen.getByRole("textbox");
      // Height = Math.min(400, Math.max(100, Math.floor(500/4))) = Math.min(400, Math.max(100, 125)) = 125
      expect(textarea).toHaveStyle({ height: "125px" });
    });
  });

  // ============================================
  // 8. Disabled State
  // ============================================
  describe("Disabled State", () => {
    it("disables textarea when disabled=true", () => {
      render(<TextArea disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("textarea has disabled attribute when disabled=true", () => {
      render(<TextArea disabled />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("disabled");
    });

    it("is not disabled by default", () => {
      render(<TextArea />);
      expect(screen.getByRole("textbox")).not.toBeDisabled();
    });
  });

  // ============================================
  // 9. Accessibility
  // ============================================
  describe("Accessibility", () => {
    it("textarea is focusable", () => {
      render(<TextArea />);
      const textarea = screen.getByRole("textbox");
      textarea.focus();
      expect(textarea).toHaveFocus();
    });

    it("label is associated with textarea for screen readers", () => {
      render(<TextArea label="Message" />);
      const textarea = screen.getByLabelText("Message");
      expect(textarea).toBeInTheDocument();
    });

    it("error message is displayed with proper styling", () => {
      render(<TextArea error={{ message: "Required field" }} />);
      const errorMessage = screen.getByText("Required field");
      expect(errorMessage).toBeInTheDocument();
    });

    it("character counter has role='status' for screen readers", () => {
      render(<TextArea />);
      const counter = screen.getByRole("status");
      expect(counter).toHaveTextContent(/0 \/ 500/);
    });
  });

  // ============================================
  // 10. Ref Forwarding
  // ============================================
  describe("Ref Forwarding", () => {
    it("forwards ref to textarea element", () => {
      const ref = vi.fn();
      render(<TextArea ref={ref} />);
      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLTextAreaElement);
    });

    it("allows imperative focus via ref", () => {
      const textareaRef = createRef<HTMLTextAreaElement>();
      render(<TextArea ref={textareaRef} />);

      textareaRef.current?.focus();
      expect(screen.getByRole("textbox")).toHaveFocus();
    });
  });

  // ============================================
  // 11. Native Props Passthrough
  // ============================================
  describe("Native Props Passthrough", () => {
    it("passes through name attribute", () => {
      render(<TextArea name="description" />);
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "name",
        "description",
      );
    });

    it("passes through required attribute", () => {
      render(<TextArea required />);
      expect(screen.getByRole("textbox")).toBeRequired();
    });

    it("passes through readOnly attribute", () => {
      render(<TextArea readOnly />);
      expect(screen.getByRole("textbox")).toHaveAttribute("readOnly");
    });

    it("passes through rows attribute", () => {
      render(<TextArea rows={5} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("rows", "5");
    });

    it("passes through aria-label attribute", () => {
      render(<TextArea aria-label="Enter comments" />);
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-label",
        "Enter comments",
      );
    });
  });

  // ============================================
  // 12. Edge Cases
  // ============================================
  describe("Edge Cases", () => {
    it("handles empty string value", () => {
      render(<TextArea value="" onChange={() => {}} />);
      expect(screen.getByRole("textbox")).toHaveValue("");
    });

    it("handles controlled component with value prop", () => {
      const { rerender } = render(
        <TextArea value="Initial" onChange={() => {}} />,
      );
      expect(screen.getByRole("textbox")).toHaveValue("Initial");

      rerender(<TextArea value="Updated" onChange={() => {}} />);
      expect(screen.getByRole("textbox")).toHaveValue("Updated");
    });

    it("handles maxChar of 0", () => {
      render(<TextArea maxChar={0} />);
      expect(screen.getByText("0 / 0")).toBeInTheDocument();
    });

    it("handles very long error messages", () => {
      const longMessage =
        "This is a very long error message that should still be displayed correctly without breaking the layout of the component.";
      render(<TextArea error={{ message: longMessage }} />);
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it("handles special characters in text", async () => {
      const user = userEvent.setup();
      render(<TextArea maxChar={100} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "<script>alert('xss')</script>");

      expect(textarea).toHaveValue("<script>alert('xss')</script>");
    });

    it("handles unicode characters correctly", async () => {
      const user = userEvent.setup();
      render(<TextArea maxChar={100} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "こんにちは");

      expect(screen.getByText("5 / 100")).toBeInTheDocument();
    });
  });
});
