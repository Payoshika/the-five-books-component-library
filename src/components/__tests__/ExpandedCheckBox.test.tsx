import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ExpandedCheckBox from "../ExpandedCheckBox";
import { type CheckBoxOption } from "../CheckBox";

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

const allCheckedOptions: CheckBoxOption[] = [
  { value: "option1", label: "Option 1", checked: true },
  { value: "option2", label: "Option 2", checked: true },
  { value: "option3", label: "Option 3", checked: true },
];

const manyCheckedOptions: CheckBoxOption[] = [
  { value: "opt1", label: "First", checked: true },
  { value: "opt2", label: "Second", checked: true },
  { value: "opt3", label: "Third", checked: true },
  { value: "opt4", label: "Fourth", checked: true },
  { value: "opt5", label: "Fifth", checked: true },
];

describe("ExpandedCheckBox", () => {
  // ============================================
  // 1. Basic Rendering
  // ============================================
  describe("Basic Rendering", () => {
    it("renders toggle button", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders placeholder text when no options are checked", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      expect(
        screen.getByText("click to open the option"),
      ).toBeInTheDocument();
    });

    it("does not render checkbox dropdown initially", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      expect(screen.queryByRole("group")).not.toBeInTheDocument();
    });

    it("renders chevron icon", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      const button = screen.getByRole("button");
      expect(button.querySelector("svg")).toBeInTheDocument();
    });
  });

  // ============================================
  // 2. Checked Options Display
  // ============================================
  describe("Checked Options Display", () => {
    it("displays checked option labels as badges", () => {
      render(
        <ExpandedCheckBox
          options={mixedOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Cherry")).toBeInTheDocument();
    });

    it("does not display unchecked option labels in button", () => {
      render(
        <ExpandedCheckBox
          options={mixedOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      // "Banana" should not be visible in the button (it's unchecked)
      // Note: When dropdown is closed, Banana shouldn't be in the button
      const button = screen.getByRole("button");
      expect(button).not.toHaveTextContent("Banana");
    });

    it("shows only first 3 checked options when more than 3 are checked", () => {
      render(
        <ExpandedCheckBox
          options={manyCheckedOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
      expect(screen.getByText("Third")).toBeInTheDocument();
    });

    it("shows '+X more' text when more than 3 options are checked", () => {
      render(
        <ExpandedCheckBox
          options={manyCheckedOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      expect(screen.getByText("+2 more")).toBeInTheDocument();
    });

    it("does not show '+X more' text when 3 or fewer options are checked", () => {
      render(
        <ExpandedCheckBox
          options={allCheckedOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      expect(screen.queryByText(/more/)).not.toBeInTheDocument();
    });

    it("shows placeholder when all options become unchecked", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      expect(
        screen.getByText("click to open the option"),
      ).toBeInTheDocument();
    });
  });

  // ============================================
  // 3. Dropdown Behavior
  // ============================================
  describe("Dropdown Behavior", () => {
    it("opens dropdown when button is clicked", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      fireEvent.click(screen.getByRole("button"));

      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("closes dropdown when button is clicked again", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );
      const button = screen.getByRole("button");

      // Open
      fireEvent.click(button);
      expect(screen.getByRole("group")).toBeInTheDocument();

      // Close
      fireEvent.click(button);
      expect(screen.queryByRole("group")).not.toBeInTheDocument();
    });

    it("displays all checkbox options when dropdown is open", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      fireEvent.click(screen.getByRole("button"));

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(3);
    });

    it("closes dropdown when clicking outside", () => {
      render(
        <div>
          <ExpandedCheckBox
            options={defaultOptions}
            onValueChange={vi.fn()}
            error={{}}
          />
          <button data-testid="outside">Outside</button>
        </div>,
      );

      // Open dropdown
      fireEvent.click(screen.getByRole("button", { name: /click to open/i }));
      expect(screen.getByRole("group")).toBeInTheDocument();

      // Click outside
      fireEvent.mouseDown(screen.getByTestId("outside"));

      expect(screen.queryByRole("group")).not.toBeInTheDocument();
    });

    it("does not close dropdown when clicking inside the dropdown", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      const dropdown = screen.getByRole("group");

      fireEvent.mouseDown(dropdown);

      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("rotates chevron icon when dropdown is open", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      const button = screen.getByRole("button");
      const chevron = button.querySelector("svg");

      // Initially not rotated
      expect(chevron).not.toHaveClass("rotate-180");

      // Open dropdown
      fireEvent.click(button);

      expect(chevron).toHaveClass("rotate-180");
    });
  });

  // ============================================
  // 4. Event Handling
  // ============================================
  describe("Event Handling", () => {
    it("calls onValueChange when a checkbox is clicked", () => {
      const handleValueChange = vi.fn();
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={handleValueChange}
          error={{}}
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[0]);

      expect(handleValueChange).toHaveBeenCalledTimes(1);
      expect(handleValueChange).toHaveBeenCalledWith("option1");
    });

    it("calls onValueChange with correct value for each checkbox", () => {
      const handleValueChange = vi.fn();
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={handleValueChange}
          error={{}}
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      const checkboxes = screen.getAllByRole("checkbox");

      fireEvent.click(checkboxes[0]);
      expect(handleValueChange).toHaveBeenCalledWith("option1");

      fireEvent.click(checkboxes[1]);
      expect(handleValueChange).toHaveBeenCalledWith("option2");

      fireEvent.click(checkboxes[2]);
      expect(handleValueChange).toHaveBeenCalledWith("option3");
    });

    it("keeps dropdown open after selecting a checkbox", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[0]);

      expect(screen.getByRole("group")).toBeInTheDocument();
    });
  });

  // ============================================
  // 5. Error State
  // ============================================
  describe("Error State", () => {
    it("displays error message when dropdown is closed", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{ message: "Please select at least one option" }}
        />,
      );

      expect(
        screen.getByText("Please select at least one option"),
      ).toBeInTheDocument();
    });

    it("does not display error message below button when dropdown is open", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{ message: "Please select at least one option" }}
        />,
      );

      fireEvent.click(screen.getByRole("button"));

      // The error is passed to CheckBox component which renders it inside the dropdown
      // The external error message below the button should be hidden
      const errorMessages = screen.getAllByText(
        "Please select at least one option",
      );
      // Should only show in CheckBox dropdown, not below button
      expect(errorMessages).toHaveLength(1);
    });

    it("does not display error message when error is empty object", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      const alerts = screen.queryAllByRole("alert");
      expect(alerts).toHaveLength(0);
    });

    it("does not display error message when message is undefined", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{ message: undefined }}
        />,
      );

      const alerts = screen.queryAllByRole("alert");
      expect(alerts).toHaveLength(0);
    });

    it("passes error prop to CheckBox component", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{ message: "Error message" }}
        />,
      );

      fireEvent.click(screen.getByRole("button"));

      // CheckBox should render the error message inside dropdown
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });
  });

  // ============================================
  // 6. Checked State in Dropdown
  // ============================================
  describe("Checked State in Dropdown", () => {
    it("renders checkboxes with correct checked state", () => {
      render(
        <ExpandedCheckBox
          options={mixedOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      const checkboxes = screen.getAllByRole("checkbox");

      expect(checkboxes[0]).toBeChecked(); // Apple
      expect(checkboxes[1]).not.toBeChecked(); // Banana
      expect(checkboxes[2]).toBeChecked(); // Cherry
    });

    it("renders all unchecked when no options are checked", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      const checkboxes = screen.getAllByRole("checkbox");

      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
    });

    it("renders all checked when all options are checked", () => {
      render(
        <ExpandedCheckBox
          options={allCheckedOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      const checkboxes = screen.getAllByRole("checkbox");

      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });
  });

  // ============================================
  // 7. Disabled State
  // ============================================
  describe("Disabled State", () => {
    it("disables all checkboxes when disabled prop is true", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
          disabled
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      const checkboxes = screen.getAllByRole("checkbox");

      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeDisabled();
      });
    });

    it("does not call onValueChange when checkbox is disabled", () => {
      const handleValueChange = vi.fn();
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={handleValueChange}
          error={{}}
          disabled
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[0]);

      expect(handleValueChange).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // 8. Edge Cases
  // ============================================
  describe("Edge Cases", () => {
    it("handles empty options array", () => {
      render(
        <ExpandedCheckBox options={[]} onValueChange={vi.fn()} error={{}} />,
      );

      expect(
        screen.getByText("click to open the option"),
      ).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button"));
      expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
    });

    it("handles single option", () => {
      const singleOption: CheckBoxOption[] = [
        { value: "single", label: "Single Option", checked: false },
      ];
      render(
        <ExpandedCheckBox
          options={singleOption}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      expect(screen.getAllByRole("checkbox")).toHaveLength(1);
    });

    it("handles single checked option display", () => {
      const singleCheckedOption: CheckBoxOption[] = [
        { value: "single", label: "Single Option", checked: true },
      ];
      render(
        <ExpandedCheckBox
          options={singleCheckedOption}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      expect(screen.getByText("Single Option")).toBeInTheDocument();
    });

    it("handles options with special characters in values", () => {
      const specialOptions: CheckBoxOption[] = [
        { value: "option-1", label: "Option 1", checked: true },
        { value: "option_2", label: "Option 2", checked: false },
        { value: "option.3", label: "Option 3", checked: true },
      ];
      const handleValueChange = vi.fn();
      render(
        <ExpandedCheckBox
          options={specialOptions}
          onValueChange={handleValueChange}
          error={{}}
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[1]);

      expect(handleValueChange).toHaveBeenCalledWith("option_2");
    });

    it("handles rapid toggle of dropdown", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      const button = screen.getByRole("button");

      // Rapid clicks
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      // Should be open after odd number of clicks
      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("handles exactly 3 checked options without showing more text", () => {
      render(
        <ExpandedCheckBox
          options={allCheckedOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
      expect(screen.queryByText(/more/)).not.toBeInTheDocument();
    });

    it("handles exactly 4 checked options showing +1 more", () => {
      const fourOptions: CheckBoxOption[] = [
        { value: "opt1", label: "First", checked: true },
        { value: "opt2", label: "Second", checked: true },
        { value: "opt3", label: "Third", checked: true },
        { value: "opt4", label: "Fourth", checked: true },
      ];
      render(
        <ExpandedCheckBox
          options={fourOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      expect(screen.getByText("+1 more")).toBeInTheDocument();
    });
  });

  // ============================================
  // 9. Props Spreading
  // ============================================
  describe("Props Spreading", () => {
    it("passes through additional input props to checkboxes", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
          data-testid="custom-checkbox"
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      const checkboxes = screen.getAllByRole("checkbox");

      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute("data-testid", "custom-checkbox");
      });
    });

    it("applies required attribute to all checkboxes", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
          required
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      const checkboxes = screen.getAllByRole("checkbox");

      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeRequired();
      });
    });
  });

  // ============================================
  // 10. Styling
  // ============================================
  describe("Styling", () => {
    it("applies correct styling to badge elements", () => {
      render(
        <ExpandedCheckBox
          options={mixedOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      const badge = screen.getByText("Apple");
      expect(badge).toHaveClass("bg-ui-accent", "text-ui-bg", "rounded-full");
    });

    it("applies secondary text color to placeholder", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      const placeholder = screen.getByText("click to open the option");
      expect(placeholder).toHaveClass("text-ui-secondary");
    });

    it("applies secondary text color to '+X more' text", () => {
      render(
        <ExpandedCheckBox
          options={manyCheckedOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      const moreText = screen.getByText("+2 more");
      expect(moreText).toHaveClass("text-ui-secondary");
    });

    it("applies danger text color to error message", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{ message: "Error" }}
        />,
      );

      const errorMessage = screen.getByText("Error");
      expect(errorMessage).toHaveClass("text-ui-danger");
    });

    it("dropdown has correct positioning classes", () => {
      render(
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={vi.fn()}
          error={{}}
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      const dropdown = screen.getByRole("group");

      expect(dropdown).toHaveClass("absolute", "z-50", "w-full");
    });
  });
});
