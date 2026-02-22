import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Radio from "../Radio";
import { type Option } from "../../types/utils.types";

// Sample options for tests
const defaultOptions: Option[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const twoOptions: Option[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const singleOption: Option[] = [{ value: "only", label: "Only Option" }];

const optionsWithDescription: Option[] = [
  { value: "basic", label: "Basic Plan", description: "Free tier" },
  { value: "pro", label: "Pro Plan", description: "Paid tier" },
];

describe("Radio", () => {
  // ============================================
  // 1. Basic Rendering
  // ============================================
  describe("Basic Rendering", () => {
    it("renders all radio options", () => {
      render(<Radio options={defaultOptions} name="test-radio" />);
      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(3);
    });

    it("renders labels for each option", () => {
      render(<Radio options={defaultOptions} name="test-radio" />);
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });

    it("renders a fieldset element", () => {
      const { container } = render(
        <Radio options={defaultOptions} name="test-radio" />,
      );
      const fieldset = container.querySelector("fieldset");
      expect(fieldset).toBeInTheDocument();
    });

    it("renders with correct name attribute on all radios", () => {
      render(<Radio options={defaultOptions} name="my-radio-group" />);
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute("name", "my-radio-group");
      });
    });

    it("renders with correct value attributes", () => {
      render(<Radio options={defaultOptions} name="test-radio" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("value", "option1");
      expect(radios[1]).toHaveAttribute("value", "option2");
      expect(radios[2]).toHaveAttribute("value", "option3");
    });

    it("renders radio inputs with type='radio'", () => {
      render(<Radio options={defaultOptions} name="test-radio" />);
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute("type", "radio");
      });
    });

    it("renders with no option checked by default when no value is provided", () => {
      render(<Radio options={defaultOptions} name="test-radio" />);
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).not.toBeChecked();
      });
    });
  });

  // ============================================
  // 2. Group Label (legend)
  // ============================================
  describe("Group Label", () => {
    it("renders a legend with groupLabel text", () => {
      render(
        <Radio
          options={defaultOptions}
          name="test-radio"
          groupLabel="Choose an option"
        />,
      );
      const legend = screen.getByText("Choose an option");
      expect(legend).toBeInTheDocument();
      expect(legend.tagName).toBe("LEGEND");
    });

    it("applies sr-only class to the legend", () => {
      render(
        <Radio
          options={defaultOptions}
          name="test-radio"
          groupLabel="Choose an option"
        />,
      );
      const legend = screen.getByText("Choose an option");
      expect(legend).toHaveClass("sr-only");
    });

    it("does not render a legend when groupLabel is not provided", () => {
      const { container } = render(
        <Radio options={defaultOptions} name="test-radio" />,
      );
      const legend = container.querySelector("legend");
      expect(legend).not.toBeInTheDocument();
    });
  });

  // ============================================
  // 3. Checked / Selected State
  // ============================================
  describe("Checked State", () => {
    it("checks the correct radio when value is provided", () => {
      render(
        <Radio options={defaultOptions} name="test-radio" value="option2" />,
      );
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
      expect(radios[2]).not.toBeChecked();
    });

    it("checks the first option when its value matches", () => {
      render(
        <Radio options={defaultOptions} name="test-radio" value="option1" />,
      );
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toBeChecked();
    });

    it("checks the last option when its value matches", () => {
      render(
        <Radio options={defaultOptions} name="test-radio" value="option3" />,
      );
      const radios = screen.getAllByRole("radio");
      expect(radios[2]).toBeChecked();
    });

    it("checks no radio when value does not match any option", () => {
      render(
        <Radio
          options={defaultOptions}
          name="test-radio"
          value="nonexistent"
        />,
      );
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).not.toBeChecked();
      });
    });

    it("only one radio is checked at a time", () => {
      render(
        <Radio options={defaultOptions} name="test-radio" value="option2" />,
      );
      const radios = screen.getAllByRole("radio");
      const checkedRadios = radios.filter(
        (radio) => (radio as HTMLInputElement).checked,
      );
      expect(checkedRadios).toHaveLength(1);
    });
  });

  // ============================================
  // 4. Event Handling
  // ============================================
  describe("Event Handling", () => {
    it("calls onChange when a radio is clicked", () => {
      const handleChange = vi.fn();
      render(
        <Radio
          options={defaultOptions}
          name="test-radio"
          onChange={handleChange}
        />,
      );
      const radios = screen.getAllByRole("radio");
      fireEvent.click(radios[1]);
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("calls onChange with the correct event target value", () => {
      const handleChange = vi.fn();
      render(
        <Radio
          options={defaultOptions}
          name="test-radio"
          onChange={handleChange}
        />,
      );
      const radios = screen.getAllByRole("radio");
      fireEvent.click(radios[2]);
      expect(handleChange).toHaveBeenCalledTimes(1);
      const event = handleChange.mock.calls[0][0];
      expect(event.target.value).toBe("option3");
    });

    it("calls onBlur when a radio loses focus", () => {
      const handleBlur = vi.fn();
      render(
        <Radio
          options={defaultOptions}
          name="test-radio"
          onBlur={handleBlur}
        />,
      );
      const radios = screen.getAllByRole("radio");
      fireEvent.focus(radios[0]);
      fireEvent.blur(radios[0]);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("calls onChange for each different radio clicked", () => {
      const handleChange = vi.fn();
      render(
        <Radio
          options={defaultOptions}
          name="test-radio"
          onChange={handleChange}
        />,
      );
      const radios = screen.getAllByRole("radio");
      fireEvent.click(radios[0]);
      fireEvent.click(radios[1]);
      fireEvent.click(radios[2]);
      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it("does not call onChange when not provided", () => {
      render(<Radio options={defaultOptions} name="test-radio" />);
      const radios = screen.getAllByRole("radio");
      // Should not throw
      expect(() => fireEvent.click(radios[0])).not.toThrow();
    });
  });

  // ============================================
  // 5. Error State
  // ============================================
  describe("Error State", () => {
    it("displays error message when error prop is provided", () => {
      render(
        <Radio
          options={defaultOptions}
          name="test-radio"
          error={{ message: "Please select an option" }}
        />,
      );
      expect(screen.getByText("Please select an option")).toBeInTheDocument();
    });

    it("renders error message with role='alert'", () => {
      render(
        <Radio
          options={defaultOptions}
          name="test-radio"
          error={{ message: "Required field" }}
        />,
      );
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent("Required field");
    });

    it("does not display error message when error is empty object", () => {
      render(<Radio options={defaultOptions} name="test-radio" error={{}} />);
      const alerts = screen.queryAllByRole("alert");
      expect(alerts).toHaveLength(0);
    });

    it("does not display error message when error message is undefined", () => {
      render(
        <Radio
          options={defaultOptions}
          name="test-radio"
          error={{ message: undefined }}
        />,
      );
      const alerts = screen.queryAllByRole("alert");
      expect(alerts).toHaveLength(0);
    });

    it("does not display error message when error is not provided", () => {
      render(<Radio options={defaultOptions} name="test-radio" />);
      const alerts = screen.queryAllByRole("alert");
      expect(alerts).toHaveLength(0);
    });
  });

  // ============================================
  // 6. Disabled State
  // ============================================
  describe("Disabled State", () => {
    it("disables all radios when disabled prop is true", () => {
      render(<Radio options={defaultOptions} name="test-radio" disabled />);
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });

    it("radios are not disabled by default", () => {
      render(<Radio options={defaultOptions} name="test-radio" />);
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).not.toBeDisabled();
      });
    });

    it("disabled radios have disabled attribute preventing interaction", () => {
      render(<Radio options={defaultOptions} name="test-radio" disabled />);
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
        expect(radio).toHaveAttribute("disabled");
      });
    });
  });

  // ============================================
  // 7. Label-Input Association
  // ============================================
  describe("Label-Input Association", () => {
    it("each label is associated with its radio input via htmlFor", () => {
      render(<Radio options={defaultOptions} name="test-radio" />);
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        const id = radio.getAttribute("id");
        expect(id).toBeTruthy();
        const label = document.querySelector(`label[for="${id}"]`);
        expect(label).toBeInTheDocument();
      });
    });

    it("clicking on a label selects the associated radio", () => {
      const handleChange = vi.fn();
      render(
        <Radio
          options={defaultOptions}
          name="test-radio"
          onChange={handleChange}
        />,
      );
      const label = screen.getByText("Option 2");
      fireEvent.click(label);
      expect(handleChange).toHaveBeenCalled();
    });

    it("generates unique ids for each radio", () => {
      render(<Radio options={defaultOptions} name="test-radio" />);
      const radios = screen.getAllByRole("radio");
      const ids = radios.map((radio) => radio.getAttribute("id"));
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  // ============================================
  // 8. className / Custom Styling
  // ============================================
  describe("Custom Styling", () => {
    it("applies custom className to the wrapper div", () => {
      const { container } = render(
        <Radio
          options={defaultOptions}
          name="test-radio"
          className="custom-class"
        />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("custom-class");
    });

    it("preserves default classes when custom className is applied", () => {
      const { container } = render(
        <Radio
          options={defaultOptions}
          name="test-radio"
          className="my-custom"
        />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("w-full");
      expect(wrapper).toHaveClass("my-custom");
    });

    it("radio inputs have sr-only class (visually hidden)", () => {
      render(<Radio options={defaultOptions} name="test-radio" />);
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toHaveClass("sr-only");
      });
    });
  });

  // ============================================
  // 9. Ref Forwarding
  // ============================================
  describe("Ref Forwarding", () => {
    it("passes ref to radio inputs", () => {
      const ref = vi.fn();
      render(<Radio options={defaultOptions} name="test-radio" ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });

  // ============================================
  // 10. Props Spreading
  // ============================================
  describe("Props Spreading", () => {
    it("passes through additional input props to radios", () => {
      render(
        <Radio
          options={defaultOptions}
          name="test-radio"
          aria-label="radio group"
          required
        />,
      );
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toBeRequired();
      });
    });

    it("applies data attributes to radio inputs", () => {
      render(
        <Radio
          options={defaultOptions}
          name="test-radio"
          data-testid="custom-radio"
        />,
      );
      const radios = screen.getAllByTestId("custom-radio");
      expect(radios).toHaveLength(3);
    });
  });

  // ============================================
  // 11. Edge Cases
  // ============================================
  describe("Edge Cases", () => {
    it("handles empty options array", () => {
      const { container } = render(<Radio options={[]} name="test-radio" />);
      const radios = screen.queryAllByRole("radio");
      expect(radios).toHaveLength(0);
      const fieldset = container.querySelector("fieldset");
      expect(fieldset).toBeInTheDocument();
    });

    it("handles single option", () => {
      render(<Radio options={singleOption} name="test-radio" />);
      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(1);
      expect(screen.getByText("Only Option")).toBeInTheDocument();
    });

    it("handles single option selected", () => {
      render(<Radio options={singleOption} name="test-radio" value="only" />);
      const radio = screen.getByRole("radio");
      expect(radio).toBeChecked();
    });

    it("handles two options", () => {
      render(<Radio options={twoOptions} name="test-radio" value="yes" />);
      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(2);
      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });

    it("handles options with special characters in values", () => {
      const specialOptions: Option[] = [
        { value: "option-1", label: "Option One" },
        { value: "option_2", label: "Option Two" },
        { value: "option.3", label: "Option Three" },
      ];
      const handleChange = vi.fn();
      render(
        <Radio
          options={specialOptions}
          name="test-radio"
          onChange={handleChange}
        />,
      );
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("value", "option-1");
      expect(radios[1]).toHaveAttribute("value", "option_2");
      expect(radios[2]).toHaveAttribute("value", "option.3");
      fireEvent.click(radios[1]);
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("renders correctly with options that have descriptions", () => {
      render(<Radio options={optionsWithDescription} name="test-radio" />);
      expect(screen.getByText("Basic Plan")).toBeInTheDocument();
      expect(screen.getByText("Pro Plan")).toBeInTheDocument();
    });
  });

  // ============================================
  // 12. Multiple Radio Groups Isolation
  // ============================================
  describe("Multiple Radio Groups", () => {
    it("renders two independent radio groups without conflict", () => {
      render(
        <>
          <Radio options={twoOptions} name="group1" value="yes" />
          <Radio options={defaultOptions} name="group2" value="option3" />
        </>,
      );
      const allRadios = screen.getAllByRole("radio");
      expect(allRadios).toHaveLength(5);

      const group1Radios = allRadios.filter(
        (r) => r.getAttribute("name") === "group1",
      );
      const group2Radios = allRadios.filter(
        (r) => r.getAttribute("name") === "group2",
      );

      expect(group1Radios).toHaveLength(2);
      expect(group2Radios).toHaveLength(3);

      expect(group1Radios[0]).toBeChecked();
      expect(group1Radios[1]).not.toBeChecked();

      expect(group2Radios[0]).not.toBeChecked();
      expect(group2Radios[1]).not.toBeChecked();
      expect(group2Radios[2]).toBeChecked();
    });
  });

  // ============================================
  // 13. Accessibility
  // ============================================
  describe("Accessibility", () => {
    it("all radio inputs are focusable", () => {
      render(<Radio options={defaultOptions} name="test-radio" />);
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        radio.focus();
        expect(radio).toHaveFocus();
      });
    });

    it("disabled radios are not interactive", () => {
      render(<Radio options={defaultOptions} name="test-radio" disabled />);
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });

    it("uses semantic fieldset for grouping", () => {
      const { container } = render(
        <Radio
          options={defaultOptions}
          name="test-radio"
          groupLabel="Select one"
        />,
      );
      const fieldset = container.querySelector("fieldset");
      expect(fieldset).toBeInTheDocument();
      const legend = fieldset?.querySelector("legend");
      expect(legend).toBeInTheDocument();
      expect(legend).toHaveTextContent("Select one");
    });
  });
});
