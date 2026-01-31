import { type Meta, type StoryObj } from "@storybook/react-vite";
import { expect, within, userEvent, fn } from "storybook/test";
import Radio, { type RadioOptionProps } from "../components/Radio";
import { useState } from "react";
import { type Option } from "../types/utils.types";

const meta: Meta<RadioOptionProps> = {
  component: Radio,
  title: "Components/Radio",
  argTypes: {
    options: {
      control: { type: "object" },
    },
    error: {
      control: { type: "object" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
  args: {
    onChange: fn(),
    onBlur: fn(),
    error: {},
  },
};

export default meta;

type Story = StoryObj<RadioOptionProps>;

// Sample options for stories
const defaultOptions: Option[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const paymentOptions: Option[] = [
  { value: "credit", label: "Credit Card" },
  { value: "debit", label: "Debit Card" },
  { value: "paypal", label: "PayPal" },
];

const subscriptionOptions: Option[] = [
  { value: "monthly", label: "Monthly - $9.99/month" },
  { value: "yearly", label: "Yearly - $99.99/year" },
  { value: "lifetime", label: "Lifetime - $299.99" },
];

const sizeOptions: Option[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "xlarge", label: "Extra Large" },
];

// ============================================
// Basic Stories (Visual Documentation)
// ============================================

export const Default: Story = {
  args: {
    options: defaultOptions,
    name: "default-radio",
  },
};

export const PaymentMethod: Story = {
  args: {
    options: paymentOptions,
    name: "payment-method",
  },
};

export const SubscriptionPlan: Story = {
  args: {
    options: subscriptionOptions,
    name: "subscription-plan",
  },
};

export const SizeSelector: Story = {
  args: {
    options: sizeOptions,
    name: "size-selector",
  },
};

export const SingleOption: Story = {
  args: {
    options: [{ value: "single", label: "Single Option" }],
    name: "single-radio",
  },
};

export const TwoOptions: Story = {
  args: {
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    name: "yes-no-radio",
  },
};

// ============================================
// With Default Selection
// ============================================

export const WithDefaultValue: Story = {
  args: {
    options: paymentOptions,
    name: "payment-default",
    defaultValue: "credit",
  },
};

export const SubscriptionWithDefault: Story = {
  args: {
    options: subscriptionOptions,
    name: "subscription-default",
    defaultValue: "yearly",
  },
};

// ============================================
// Error States
// ============================================

export const WithError: Story = {
  args: {
    options: defaultOptions,
    name: "radio-error",
    error: { message: "Please select an option" },
  },
};

export const WithErrorAndDefaultValue: Story = {
  args: {
    options: paymentOptions,
    name: "payment-error",
    defaultValue: "credit",
    error: { message: "This payment method is not available" },
  },
};

export const RequiredFieldError: Story = {
  args: {
    options: subscriptionOptions,
    name: "subscription-required",
    error: { message: "Subscription plan is required" },
  },
};

// ============================================
// Disabled States
// ============================================

export const Disabled: Story = {
  args: {
    options: defaultOptions,
    name: "radio-disabled",
    disabled: true,
  },
};

export const DisabledWithDefaultValue: Story = {
  args: {
    options: paymentOptions,
    name: "payment-disabled",
    defaultValue: "paypal",
    disabled: true,
  },
};

// ============================================
// Interactive Examples
// ============================================

const InteractiveRadioExample = () => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value);
  };

  return (
    <div className="space-y-4">
      <Radio
        options={paymentOptions}
        name="interactive-payment"
        onChange={handleChange}
        error={{}}
      />
      <p className="text-sm text-gray-600">
        Selected: {selectedValue || "None"}
      </p>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveRadioExample />,
};

const InteractiveWithValidationExample = () => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [error, setError] = useState<{ message?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value);
    if (e.target.value) {
      setError({});
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!selectedValue) {
      setError({ message: "Please select a subscription plan" });
    } else {
      setError({});
    }
  };

  return (
    <div className="space-y-4">
      <Radio
        options={subscriptionOptions}
        name="validation-subscription"
        onChange={handleChange}
        error={error}
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
      {submitted && !error.message && selectedValue && (
        <p className="text-sm text-green-600">
          You selected: {subscriptionOptions.find((o) => o.value === selectedValue)?.label}
        </p>
      )}
    </div>
  );
};

export const InteractiveWithValidation: Story = {
  render: () => <InteractiveWithValidationExample />,
};

// ============================================
// Test Stories (Behavior Verification)
// ============================================

export const ClickInteraction: Story = {
  args: {
    options: defaultOptions,
    name: "click-test",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const option2Label = canvas.getByText("Option 2");

    await userEvent.click(option2Label);

    const radioInput = canvas.getByRole("radio", { name: "Option 2" });
    await expect(radioInput).toBeChecked();
  },
};

export const OnlyOneSelected: Story = {
  args: {
    options: defaultOptions,
    name: "single-selection-test",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click first option
    await userEvent.click(canvas.getByText("Option 1"));
    const radio1 = canvas.getByRole("radio", { name: "Option 1" });
    await expect(radio1).toBeChecked();

    // Click second option
    await userEvent.click(canvas.getByText("Option 2"));
    const radio2 = canvas.getByRole("radio", { name: "Option 2" });
    await expect(radio2).toBeChecked();

    // First option should now be unchecked
    await expect(radio1).not.toBeChecked();
  },
};

export const RadioHasCorrectLabel: Story = {
  args: {
    options: [{ value: "test", label: "Test Label" }],
    name: "label-test",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText("Test Label");
    await expect(label).toBeInTheDocument();
  },
};

export const ErrorMessageRendered: Story = {
  args: {
    options: defaultOptions,
    name: "error-test",
    error: { message: "This is an error message" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const errorMessage = canvas.getByText("This is an error message");
    await expect(errorMessage).toBeInTheDocument();
  },
};

export const NoErrorWhenMessageEmpty: Story = {
  args: {
    options: defaultOptions,
    name: "no-error-test",
    error: {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioInputs = canvas.getAllByRole("radio");
    await expect(radioInputs).toHaveLength(3);

    // Error message should not exist
    const errorMessage = canvas.queryByRole("alert");
    await expect(errorMessage).not.toBeInTheDocument();
  },
};

export const KeyboardNavigation: Story = {
  args: {
    options: defaultOptions,
    name: "keyboard-test",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioInputs = canvas.getAllByRole("radio");

    // Focus first radio
    await userEvent.tab();

    // Press space to select
    await userEvent.keyboard(" ");
    await expect(radioInputs[0]).toBeChecked();

    // Navigate with arrow keys
    await userEvent.keyboard("{ArrowDown}");
    await expect(radioInputs[1]).toBeChecked();

    await userEvent.keyboard("{ArrowDown}");
    await expect(radioInputs[2]).toBeChecked();
  },
};

// ============================================
// Edge Cases
// ============================================

export const EmptyOptions: Story = {
  args: {
    options: [],
    name: "empty-radio",
  },
};

export const ManyOptions: Story = {
  args: {
    options: [
      { value: "opt1", label: "Option 1" },
      { value: "opt2", label: "Option 2" },
      { value: "opt3", label: "Option 3" },
      { value: "opt4", label: "Option 4" },
      { value: "opt5", label: "Option 5" },
      { value: "opt6", label: "Option 6" },
      { value: "opt7", label: "Option 7" },
      { value: "opt8", label: "Option 8" },
    ],
    name: "many-options-radio",
  },
};

export const LongLabels: Story = {
  args: {
    options: [
      {
        value: "long1",
        label: "This is a very long label that might wrap to multiple lines",
      },
      {
        value: "long2",
        label:
          "Another extremely long label to test how the component handles text overflow",
      },
    ],
    name: "long-labels-radio",
  },
};

export const SpecialCharacters: Story = {
  args: {
    options: [
      { value: "special1", label: "Option with émojis 🎉 🚀" },
      { value: "special2", label: "Option with <special> & characters" },
      { value: "special3", label: "日本語オプション" },
    ],
    name: "special-chars-radio",
  },
};
