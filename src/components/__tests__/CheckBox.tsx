import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import CheckBox, { type CheckBoxOption } from "../CheckBox";

// Sample options for tests
const defaultOptions: CheckBoxOption[] = [
  { value: "option1", label: "Option 1", checked: false },
  { value: "option2", label: "Option 2", checked: false },
  { value: "option3", label: "Option 3", checked: false },
];

const mixedOptions: CheckBoxOption[] = [
  { value: "apple", label: "Apple", checked: true },
  { value: "banana", label: "Banana", checked: false },
  { value: "cherry", label: "Cherry", checked: true },
];

describe("CheckBox", () => {
  // ============================================
  // 1. Basic Rendering
  // ============================================
  describe("Basic Rendering", () => {
    it("renders all options as checkboxes", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(3);
    });

    it("renders labels for each option", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });

    it("renders within a fieldset element", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("renders a legend for accessibility", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      const legend = screen.getByText("choose your options");
      expect(legend).toBeInTheDocument();
      expect(legend).toHaveClass("sr-only");
    });

    it("renders empty when options array is empty", () => {
      render(<CheckBox options={[]} onValueChange={vi.fn()} error={{}} />);
      expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
    });

    it("renders single option correctly", () => {
      const singleOption: CheckBoxOption[] = [
        { value: "single", label: "Single Option", checked: false },
      ];
      render(
        <CheckBox options={singleOption} onValueChange={vi.fn()} error={{}} />,
      );
      expect(screen.getAllByRole("checkbox")).toHaveLength(1);
      expect(screen.getByText("Single Option")).toBeInTheDocument();
    });
  });

  // ============================================
  // 2. Checked State
  // ============================================
  describe("Checked State", () => {
    it("renders unchecked checkboxes correctly", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
    });

    it("renders checked checkboxes correctly", () => {
      const allCheckedOptions: CheckBoxOption[] = [
        { value: "opt1", label: "Option 1", checked: true },
        { value: "opt2", label: "Option 2", checked: true },
      ];
      render(
        <CheckBox
          options={allCheckedOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });

    it("renders mixed checked states correctly", () => {
      render(
        <CheckBox options={mixedOptions} onValueChange={vi.fn()} error={{}} />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes[0]).toBeChecked(); // Apple
      expect(checkboxes[1]).not.toBeChecked(); // Banana
      expect(checkboxes[2]).toBeChecked(); // Cherry
    });
  });

  // ============================================
  // 3. Event Handling
  // ============================================
  describe("Event Handling", () => {
    it("calls onValueChange with correct value when checkbox is clicked", () => {
      const handleValueChange = vi.fn();
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={handleValueChange}
          error={{}}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[0]);
      expect(handleValueChange).toHaveBeenCalledWith("option1");
    });

    it("calls onValueChange for each checkbox click", () => {
      const handleValueChange = vi.fn();
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={handleValueChange}
          error={{}}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");

      fireEvent.click(checkboxes[0]);
      expect(handleValueChange).toHaveBeenCalledWith("option1");

      fireEvent.click(checkboxes[1]);
      expect(handleValueChange).toHaveBeenCalledWith("option2");

      fireEvent.click(checkboxes[2]);
      expect(handleValueChange).toHaveBeenCalledWith("option3");

      expect(handleValueChange).toHaveBeenCalledTimes(3);
    });

    it("calls onValueChange when clicking on label text", () => {
      const handleValueChange = vi.fn();
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={handleValueChange}
          error={{}}
        />,
      );
      const label = screen.getByText("Option 1");
      fireEvent.click(label);
      expect(handleValueChange).toHaveBeenCalledWith("option1");
    });

    it("does not call onValueChange when disabled", () => {
      const handleValueChange = vi.fn();
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={handleValueChange}
          error={{}}
          disabled
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[0]);
      expect(handleValueChange).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // 4. Error State
  // ============================================
  describe("Error State", () => {
    it("renders error message when provided", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{ message: "Please select at least one option" }}
        />,
      );
      expect(
        screen.getByText("Please select at least one option"),
      ).toBeInTheDocument();
    });

    it("renders error message with role='alert'", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{ message: "Error message" }}
        />,
      );
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent("Error message");
    });

    it("does not render error message when error is empty object", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("does not render error message when message is undefined", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{ message: undefined }}
        />,
      );
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("sets aria-invalid='true' on checkboxes when error exists", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{ message: "Error" }}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute("aria-invalid", "true");
      });
    });

    it("sets aria-invalid='false' on checkboxes when no error", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute("aria-invalid", "false");
      });
    });

    it("sets aria-describedby to error element when error exists", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{ message: "Error" }}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      const errorElement = screen.getByRole("alert");

      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute("aria-describedby", errorElement.id);
      });
    });

    it("does not set aria-describedby when no error", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toHaveAttribute("aria-describedby");
      });
    });
  });

  // ============================================
  // 5. Accessibility (A11y)
  // ============================================
  describe("Accessibility", () => {
    it("each checkbox has an associated id matching its value", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes[0]).toHaveAttribute("id", "option1");
      expect(checkboxes[1]).toHaveAttribute("id", "option2");
      expect(checkboxes[2]).toHaveAttribute("id", "option3");
    });

    it("each checkbox has a name attribute matching its value", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes[0]).toHaveAttribute("name", "option1");
      expect(checkboxes[1]).toHaveAttribute("name", "option2");
      expect(checkboxes[2]).toHaveAttribute("name", "option3");
    });

    it("each checkbox has a value attribute", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes[0]).toHaveAttribute("value", "option1");
      expect(checkboxes[1]).toHaveAttribute("value", "option2");
      expect(checkboxes[2]).toHaveAttribute("value", "option3");
    });

    it("checkboxes are keyboard accessible", () => {
      const handleValueChange = vi.fn();
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={handleValueChange}
          error={{}}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");

      // Focus first checkbox
      checkboxes[0].focus();
      expect(checkboxes[0]).toHaveFocus();

      // Simulate space key press
      fireEvent.keyDown(checkboxes[0], { key: " ", code: "Space" });
      fireEvent.change(checkboxes[0]);
    });
  });

  // ============================================
  // 6. Disabled State
  // ============================================
  describe("Disabled State", () => {
    it("disables all checkboxes when disabled prop is true", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
          disabled
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeDisabled();
      });
    });

    it("checkboxes are enabled when disabled prop is not provided", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeDisabled();
      });
    });

    it("checkboxes are enabled when disabled prop is false", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
          disabled={false}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeDisabled();
      });
    });
  });

  // ============================================
  // 7. Props Spreading
  // ============================================
  describe("Props Spreading", () => {
    it("passes through additional input props", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
          data-testid="custom-checkbox"
          aria-label="Custom checkbox group"
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute("data-testid", "custom-checkbox");
      });
    });

    it("applies required attribute to all checkboxes", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
          required
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeRequired();
      });
    });

    it("applies readOnly attribute to all checkboxes", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
          readOnly
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute("readonly");
      });
    });
  });

  // ============================================
  // 8. Edge Cases
  // ============================================
  describe("Edge Cases", () => {
    it("handles options with special characters in values", () => {
      const specialOptions: CheckBoxOption[] = [
        { value: "option-1", label: "Option 1", checked: false },
        { value: "option_2", label: "Option 2", checked: false },
        { value: "option.3", label: "Option 3", checked: false },
      ];
      const handleValueChange = vi.fn();
      render(
        <CheckBox
          options={specialOptions}
          onValueChange={handleValueChange}
          error={{}}
        />,
      );

      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[0]);
      expect(handleValueChange).toHaveBeenCalledWith("option-1");
    });

    it("handles options with long labels", () => {
      const longLabelOptions: CheckBoxOption[] = [
        {
          value: "long",
          label:
            "This is a very long label that might wrap to multiple lines in the UI",
          checked: false,
        },
      ];
      render(
        <CheckBox
          options={longLabelOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      expect(
        screen.getByText(
          "This is a very long label that might wrap to multiple lines in the UI",
        ),
      ).toBeInTheDocument();
    });

    it("handles rapid clicking", () => {
      const handleValueChange = vi.fn();
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={handleValueChange}
          error={{}}
        />,
      );

      const checkbox = screen.getAllByRole("checkbox")[0];
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);

      expect(handleValueChange).toHaveBeenCalledTimes(3);
    });

    it("generates correct errorId when options array is empty", () => {
      render(
        <CheckBox
          options={[]}
          onValueChange={vi.fn()}
          error={{ message: "Error with empty options" }}
        />,
      );
      const errorElement = screen.getByRole("alert");
      expect(errorElement).toHaveAttribute("id", "error-checkbox");
    });

    it("uses first option value for errorId", () => {
      render(
        <CheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{ message: "Error message" }}
        />,
      );
      const errorElement = screen.getByRole("alert");
      expect(errorElement).toHaveAttribute("id", "error-option1");
    });
  });
});
