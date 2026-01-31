import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Modal from "../Modal";

describe("Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Modal Content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any portaled content
    document.body.style.overflow = "";
  });

  // ============================================
  // 1. Basic Rendering
  // ============================================
  describe("Basic Rendering", () => {
    it("renders children content when isOpen is true", () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByText("Modal Content")).toBeInTheDocument();
    });

    it("does not render when isOpen is false", () => {
      render(<Modal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
    });

    it("renders modal in a portal (attached to document.body)", () => {
      render(<Modal {...defaultProps} />);
      const dialog = screen.getByRole("dialog");
      expect(dialog.parentElement).toBe(document.body);
    });

    it("renders with correct dialog role and aria attributes", () => {
      render(<Modal {...defaultProps} />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby");
    });
  });

  // ============================================
  // 2. Button Rendering
  // ============================================
  describe("Button Rendering", () => {
    it("renders Cancel button when showCancel is true", () => {
      render(<Modal {...defaultProps} showCancel />);
      expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    });

    it("does not render Cancel button when showCancel is false", () => {
      render(<Modal {...defaultProps} showCancel={false} />);
      expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
    });

    it("renders Action button when onAction is provided", () => {
      render(<Modal {...defaultProps} onAction={vi.fn()} />);
      expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
    });

    it("does not render Action button when onAction is not provided", () => {
      render(<Modal {...defaultProps} />);
      expect(screen.queryByRole("button", { name: "Action" })).not.toBeInTheDocument();
    });

    it("renders both Cancel and Action buttons when both props are provided", () => {
      render(<Modal {...defaultProps} showCancel onAction={vi.fn()} />);
      expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
    });

    it("does not render button container when neither showCancel nor onAction is provided", () => {
      render(<Modal {...defaultProps} showCancel={false} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // 3. Event Handling
  // ============================================
  describe("Event Handling", () => {
    it("calls onClose when Cancel button is clicked", () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} showCancel />);
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onAction when Action button is clicked", () => {
      const onAction = vi.fn();
      render(<Modal {...defaultProps} onAction={onAction} />);
      fireEvent.click(screen.getByRole("button", { name: "Action" }));
      expect(onAction).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when backdrop is clicked", () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      const dialog = screen.getByRole("dialog");
      fireEvent.click(dialog);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when modal content is clicked", () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      const content = screen.getByText("Modal Content");
      fireEvent.click(content);
      expect(onClose).not.toHaveBeenCalled();
    });

    it("does not call onClose when clicking inside modal container", () => {
      const onClose = vi.fn();
      render(
        <Modal {...defaultProps} onClose={onClose}>
          <button>Inner Button</button>
        </Modal>
      );
      fireEvent.click(screen.getByRole("button", { name: "Inner Button" }));
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // 4. Keyboard Interaction
  // ============================================
  describe("Keyboard Interaction", () => {
    it("calls onClose when Escape key is pressed", () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      fireEvent.keyDown(window, { key: "Escape" });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose for other key presses", () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      fireEvent.keyDown(window, { key: "Enter" });
      fireEvent.keyDown(window, { key: "Tab" });
      fireEvent.keyDown(window, { key: "Space" });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // 5. Body Scroll Lock
  // ============================================
  describe("Body Scroll Lock", () => {
    it("sets body overflow to hidden when modal is open", () => {
      render(<Modal {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("restores body overflow when modal is closed", async () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");

      rerender(<Modal {...defaultProps} isOpen={false} />);
      await waitFor(() => {
        expect(document.body.style.overflow).not.toBe("hidden");
      });
    });

    it("restores body overflow when modal is unmounted", () => {
      const originalOverflow = document.body.style.overflow;
      const { unmount } = render(<Modal {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");

      unmount();
      expect(document.body.style.overflow).toBe(originalOverflow);
    });
  });

  // ============================================
  // 6. Animation Classes
  // ============================================
  describe("Animation Classes", () => {
    it("applies opening animation classes when isOpen is true", () => {
      render(<Modal {...defaultProps} isOpen={true} />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("motion-opacity-in-0", "motion-duration-200");
    });

    it("applies closing animation classes when isOpen becomes false", () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={true} />);
      rerender(<Modal {...defaultProps} isOpen={false} />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("motion-opacity-out-0", "motion-duration-300");
    });
  });

  // ============================================
  // 7. Accessibility
  // ============================================
  describe("Accessibility", () => {
    it("has role='dialog'", () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has aria-modal='true'", () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    });

    it("has aria-labelledby with generated id", () => {
      render(<Modal {...defaultProps} />);
      const dialog = screen.getByRole("dialog");
      const labelledBy = dialog.getAttribute("aria-labelledby");
      expect(labelledBy).toMatch(/^modal-title-/);
    });

    it("generates unique aria-labelledby ids for multiple modals", () => {
      render(
        <>
          <Modal {...defaultProps}>Modal 1</Modal>
          <Modal {...defaultProps}>Modal 2</Modal>
        </>
      );
      const dialogs = screen.getAllByRole("dialog");
      const ids = dialogs.map((d) => d.getAttribute("aria-labelledby"));
      expect(ids[0]).not.toBe(ids[1]);
    });
  });

  // ============================================
  // 8. Children Content
  // ============================================
  describe("Children Content", () => {
    it("renders complex children correctly", () => {
      render(
        <Modal {...defaultProps}>
          <h2>Modal Title</h2>
          <p>Modal description</p>
          <input type="text" placeholder="Enter text" />
        </Modal>
      );
      expect(screen.getByRole("heading", { name: "Modal Title" })).toBeInTheDocument();
      expect(screen.getByText("Modal description")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
    });

    it("renders form elements and allows interaction", () => {
      render(
        <Modal {...defaultProps}>
          <input type="text" data-testid="modal-input" />
        </Modal>
      );
      const input = screen.getByTestId("modal-input");
      fireEvent.change(input, { target: { value: "test value" } });
      expect(input).toHaveValue("test value");
    });
  });

  // ============================================
  // 9. Styling
  // ============================================
  describe("Styling", () => {
    it("applies backdrop styles", () => {
      render(<Modal {...defaultProps} />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass(
        "fixed",
        "inset-0",
        "z-50",
        "bg-black/40",
        "backdrop-blur-sm"
      );
    });

    it("applies modal container styles", () => {
      render(<Modal {...defaultProps} />);
      const content = screen.getByText("Modal Content").closest(".bg-ui-bg");
      expect(content).toHaveClass(
        "rounded-lg",
        "shadow-xl",
        "overflow-hidden",
        "bg-ui-bg"
      );
    });

    it("applies max-height constraint for scrollable content", () => {
      render(<Modal {...defaultProps} />);
      const content = screen.getByText("Modal Content").closest(".max-h-\\[90vh\\]");
      expect(content).toBeInTheDocument();
    });
  });

  // ============================================
  // 10. Edge Cases
  // ============================================
  describe("Edge Cases", () => {
    it("handles rapid open/close toggles", () => {
      const onClose = vi.fn();
      const { rerender } = render(<Modal {...defaultProps} isOpen={true} onClose={onClose} />);

      rerender(<Modal {...defaultProps} isOpen={false} onClose={onClose} />);
      rerender(<Modal {...defaultProps} isOpen={true} onClose={onClose} />);
      rerender(<Modal {...defaultProps} isOpen={false} onClose={onClose} />);

      // Should not throw or cause issues
      expect(onClose).not.toHaveBeenCalled();
    });

    it("handles onClose being called multiple times", () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} showCancel />);

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      fireEvent.click(cancelButton);
      fireEvent.click(cancelButton);
      fireEvent.click(cancelButton);

      expect(onClose).toHaveBeenCalledTimes(3);
    });

    it("handles empty children", () => {
      render(<Modal {...defaultProps}>{null}</Modal>);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("handles undefined onAction gracefully", () => {
      render(<Modal {...defaultProps} onAction={undefined} />);
      expect(screen.queryByRole("button", { name: "Action" })).not.toBeInTheDocument();
    });
  });
});
