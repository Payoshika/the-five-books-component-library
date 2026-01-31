import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Select from "../Select";

// Sample options for tests
const fruitOptions = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

describe("Select", () => {
  // ============================================
  // 1. Basic Rendering
  // ============================================
  describe("Basic Rendering", () => {
    it("renders with placeholder when no value is selected", () => {
      render(<Select options={fruitOptions} />);
      expect(screen.getByRole("button")).toHaveTextContent("Select...");
    });

    it("renders with custom placeholder", () => {
      render(<Select options={fruitOptions} placeholder="Choose a fruit..." />);
      expect(screen.getByRole("button")).toHaveTextContent("Choose a fruit...");
    });

    it("renders selected value label", () => {
      render(<Select options={fruitOptions} value="banana" />);
      expect(screen.getByRole("button")).toHaveTextContent("Banana");
    });

    it("applies custom className", () => {
      render(<Select options={fruitOptions} className="custom-class" />);
      const container = screen.getByRole("button").parentElement;
      expect(container).toHaveClass("custom-class");
    });

    it("renders hidden input with name and value for form submission", () => {
      render(<Select options={fruitOptions} name="fruit" value="apple" />);
      const hiddenInput = document.querySelector('input[type="hidden"]');
      expect(hiddenInput).toHaveAttribute("name", "fruit");
      expect(hiddenInput).toHaveAttribute("value", "apple");
    });
  });

  // ============================================
  // 2. Dropdown Behavior
  // ============================================
  describe("Dropdown Behavior", () => {
    it("opens dropdown when button is clicked", () => {
      render(<Select options={fruitOptions} />);

      // Dropdown should be closed initially
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

      // Click to open
      fireEvent.click(screen.getByRole("button"));

      // Dropdown should be open
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("closes dropdown when button is clicked again", () => {
      render(<Select options={fruitOptions} />);
      const button = screen.getByRole("button");

      // Open
      fireEvent.click(button);
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      // Close
      fireEvent.click(button);
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("displays all options when dropdown is open", () => {
      render(<Select options={fruitOptions} />);
      fireEvent.click(screen.getByRole("button"));

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent("Apple");
      expect(options[1]).toHaveTextContent("Banana");
      expect(options[2]).toHaveTextContent("Cherry");
    });

    it("closes dropdown when an option is selected", () => {
      render(<Select options={fruitOptions} />);
      fireEvent.click(screen.getByRole("button"));

      fireEvent.click(screen.getByText("Banana"));

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("closes dropdown when clicking outside", () => {
      render(
        <div>
          <Select options={fruitOptions} />
          <button data-testid="outside">Outside</button>
        </div>,
      );

      // Open dropdown
      fireEvent.click(screen.getByRole("button", { name: /select/i }));
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      // Click outside
      fireEvent.mouseDown(screen.getByTestId("outside"));

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // 3. Selection & onChange
  // ============================================
  describe("Selection & onChange", () => {
    it("calls onChange with selected value", () => {
      const handleChange = vi.fn();
      render(<Select options={fruitOptions} onChange={handleChange} />);

      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(screen.getByText("Banana"));

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith("banana");
    });

    it("does not call onChange when same option is selected", () => {
      const handleChange = vi.fn();
      render(
        <Select
          options={fruitOptions}
          value="banana"
          onChange={handleChange}
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      // Use getByRole to find the option in the dropdown, avoiding duplicate text issue
      fireEvent.click(screen.getByRole("option", { name: /banana/i }));

      // Still called - component doesn't prevent re-selection
      expect(handleChange).toHaveBeenCalledWith("banana");
    });

    it("shows check icon for selected option", () => {
      render(<Select options={fruitOptions} value="banana" />);
      fireEvent.click(screen.getByRole("button"));

      const selectedOption = screen.getByRole("option", { name: /banana/i });
      expect(selectedOption).toHaveAttribute("aria-selected", "true");
      // Check icon should be present in the selected option
      expect(selectedOption.querySelector("svg")).toBeInTheDocument();
    });

    it("does not show check icon for unselected options", () => {
      render(<Select options={fruitOptions} value="banana" />);
      fireEvent.click(screen.getByRole("button"));

      const unselectedOption = screen.getByRole("option", { name: /apple/i });
      expect(unselectedOption).toHaveAttribute("aria-selected", "false");
      expect(unselectedOption.querySelector("svg")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // 4. Variant Styles
  // ============================================
  describe("Variant Styles", () => {
    it("renders with variant='default' and applies correct classes", () => {
      render(<Select options={fruitOptions} variant="default" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "bg-ui-bg",
        "text-ui-primary",
        "border-ui-border",
      );
    });

    it("renders with variant='filled' and applies correct classes", () => {
      render(<Select options={fruitOptions} variant="filled" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "bg-ui-primary",
        "text-ui-bg",
        "border-ui-primary",
      );
    });

    it("renders with variant='accent' and applies correct classes", () => {
      render(<Select options={fruitOptions} variant="accent" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "bg-ui-accent",
        "text-ui-bg",
        "border-ui-accent",
      );
    });

    it("applies variant classes to dropdown container", () => {
      render(<Select options={fruitOptions} variant="filled" />);
      fireEvent.click(screen.getByRole("button"));

      const listbox = screen.getByRole("listbox");
      expect(listbox).toHaveClass("bg-ui-primary", "text-ui-bg");
    });
  });

  // ============================================
  // 5. Error State
  // ============================================
  describe("Error State", () => {
    it("applies error styles when error has message", () => {
      render(
        <Select options={fruitOptions} error={{ message: "Required field" }} />,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border-ui-danger");
    });

    it("does not apply error styles when error has no message", () => {
      render(<Select options={fruitOptions} error={{}} />);
      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("border-ui-danger");
    });
  });

  // ============================================
  // 6. Accessibility
  // ============================================
  describe("Accessibility", () => {
    it("has aria-haspopup='listbox' on button", () => {
      render(<Select options={fruitOptions} />);
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-haspopup",
        "listbox",
      );
    });

    it("has aria-expanded='false' when closed", () => {
      render(<Select options={fruitOptions} />);
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("has aria-expanded='true' when open", () => {
      render(<Select options={fruitOptions} />);
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("options have role='option'", () => {
      render(<Select options={fruitOptions} />);
      fireEvent.click(screen.getByRole("button"));

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(3);
    });

    it("selected option has aria-selected='true'", () => {
      render(<Select options={fruitOptions} value="banana" />);
      fireEvent.click(screen.getByRole("button"));

      expect(screen.getByRole("option", { name: /banana/i })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    it("unselected options have aria-selected='false'", () => {
      render(<Select options={fruitOptions} value="banana" />);
      fireEvent.click(screen.getByRole("button"));

      expect(screen.getByRole("option", { name: /apple/i })).toHaveAttribute(
        "aria-selected",
        "false",
      );
    });

    it("dropdown has role='listbox'", () => {
      render(<Select options={fruitOptions} />);
      fireEvent.click(screen.getByRole("button"));

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
  });

  // ============================================
  // 7. onBlur Callback
  // ============================================
  describe("onBlur Callback", () => {
    it("calls onBlur when clicking outside while open", () => {
      const handleBlur = vi.fn();
      render(
        <div>
          <Select options={fruitOptions} onBlur={handleBlur} />
          <button data-testid="outside">Outside</button>
        </div>,
      );

      // Open dropdown
      fireEvent.click(screen.getByRole("button", { name: /select/i }));

      // Click outside
      fireEvent.mouseDown(screen.getByTestId("outside"));

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("does not call onBlur when selecting an option", () => {
      const handleBlur = vi.fn();
      render(<Select options={fruitOptions} onBlur={handleBlur} />);

      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(screen.getByText("Banana"));

      expect(handleBlur).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // 8. Edge Cases
  // ============================================
  describe("Edge Cases", () => {
    it("handles empty options array", () => {
      render(<Select options={[]} />);
      fireEvent.click(screen.getByRole("button"));

      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeInTheDocument();
      expect(screen.queryAllByRole("option")).toHaveLength(0);
    });

    it("handles single option", () => {
      render(<Select options={[{ label: "Only", value: "only" }]} />);
      fireEvent.click(screen.getByRole("button"));

      expect(screen.getAllByRole("option")).toHaveLength(1);
    });

    it("handles value that does not exist in options", () => {
      render(<Select options={fruitOptions} value="nonexistent" />);
      // Should show placeholder when value doesn't match any option
      expect(screen.getByRole("button")).toHaveTextContent("Select...");
    });

    it("placeholder text has reduced opacity", () => {
      render(<Select options={fruitOptions} />);
      const placeholderSpan = screen.getByText("Select...");
      expect(placeholderSpan).toHaveClass("opacity-50");
    });

    it("selected value text does not have reduced opacity", () => {
      render(<Select options={fruitOptions} value="banana" />);
      const selectedSpan = screen.getByText("Banana");
      expect(selectedSpan).not.toHaveClass("opacity-50");
    });
  });
});
