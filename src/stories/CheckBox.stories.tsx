import { type Meta, type StoryObj } from "@storybook/react-vite";
import { expect, within, userEvent, fn } from "storybook/test";
import CheckBox, {
  type CheckBoxProps,
  type CheckBoxOption,
} from "../components/CheckBox";
import { useState } from "react";

const meta: Meta<CheckBoxProps> = {
  component: CheckBox,
  title: "Components/CheckBox",
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
    onValueChange: fn(),
    error: {},
  },
};

export default meta;

type Story = StoryObj<CheckBoxProps>;

// Sample options for stories
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

const optionsWithDescriptions: CheckBoxOption[] = [
  {
    value: "basic",
    label: "Basic Plan",
    description: "Perfect for individuals getting started",
    checked: false,
  },
  {
    value: "pro",
    label: "Pro Plan",
    description: "Best for professionals and small teams",
    checked: false,
  },
  {
    value: "enterprise",
    label: "Enterprise Plan",
    description: "Advanced features for large organizations",
    checked: false,
  },
];

// ============================================
// Basic Stories (Visual Documentation)
// ============================================

export const Default: Story = {
  args: {
    options: defaultOptions,
  },
};

export const WithCheckedItems: Story = {
  args: {
    options: mixedOptions,
  },
};

export const AllChecked: Story = {
  args: {
    options: [
      { value: "item1", label: "Item 1", checked: true },
      { value: "item2", label: "Item 2", checked: true },
      { value: "item3", label: "Item 3", checked: true },
    ],
  },
};

export const SingleOption: Story = {
  args: {
    options: [{ value: "single", label: "Single Option", checked: false }],
  },
};

// ============================================
// Options with Descriptions
// ============================================

export const WithDescriptions: Story = {
  args: {
    options: optionsWithDescriptions,
  },
};

export const WithDescriptionsChecked: Story = {
  args: {
    options: [
      {
        value: "email",
        label: "Email notifications",
        description: "Receive updates about your account via email",
        checked: true,
      },
      {
        value: "sms",
        label: "SMS notifications",
        description: "Get instant alerts via text message",
        checked: false,
      },
      {
        value: "push",
        label: "Push notifications",
        description: "Receive notifications on your mobile device",
        checked: true,
      },
    ],
  },
};

export const MixedWithAndWithoutDescriptions: Story = {
  args: {
    options: [
      {
        value: "required",
        label: "Required option",
        description: "This option has a description",
        checked: false,
      },
      {
        value: "simple",
        label: "Simple option",
        checked: false,
      },
      {
        value: "another",
        label: "Another with description",
        description: "Some additional context here",
        checked: true,
      },
    ],
  },
};

export const PermissionsExample: Story = {
  args: {
    options: [
      {
        value: "read",
        label: "Read access",
        description: "View files and documents",
        checked: true,
      },
      {
        value: "write",
        label: "Write access",
        description: "Create and edit files",
        checked: false,
      },
      {
        value: "delete",
        label: "Delete access",
        description: "Remove files permanently",
        checked: false,
      },
      {
        value: "admin",
        label: "Admin access",
        description: "Full control including user management",
        checked: false,
      },
    ],
  },
};

export const PrivacySettingsExample: Story = {
  args: {
    options: [
      {
        value: "profile_visible",
        label: "Public profile",
        description: "Allow others to see your profile information",
        checked: true,
      },
      {
        value: "show_email",
        label: "Show email",
        description: "Display your email address on your profile",
        checked: false,
      },
      {
        value: "allow_messages",
        label: "Allow messages",
        description: "Let other users send you direct messages",
        checked: true,
      },
      {
        value: "analytics",
        label: "Analytics cookies",
        description: "Help us improve by sharing anonymous usage data",
        checked: false,
      },
    ],
  },
};

// ============================================
// Error States
// ============================================

export const WithError: Story = {
  args: {
    options: defaultOptions,
    error: { message: "Please select at least one option" },
  },
};

export const WithErrorAndChecked: Story = {
  args: {
    options: mixedOptions,
    error: { message: "You can only select up to 2 options" },
  },
};

export const WithDescriptionsAndError: Story = {
  args: {
    options: optionsWithDescriptions,
    error: { message: "Please select a plan to continue" },
  },
};

// ============================================
// Disabled State
// ============================================

export const Disabled: Story = {
  args: {
    options: defaultOptions,
    disabled: true,
  },
};

export const DisabledWithChecked: Story = {
  args: {
    options: mixedOptions,
    disabled: true,
  },
};

export const DisabledWithDescriptions: Story = {
  args: {
    options: optionsWithDescriptions,
    disabled: true,
  },
};

// ============================================
// Interactive Example (Controlled State)
// ============================================

const InteractiveCheckBoxExample = () => {
  const [options, setOptions] = useState<CheckBoxOption[]>([
    { value: "react", label: "React", checked: false },
    { value: "vue", label: "Vue", checked: false },
    { value: "angular", label: "Angular", checked: false },
    { value: "svelte", label: "Svelte", checked: false },
  ]);

  const handleValueChange = (value: string) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.value === value
          ? { ...option, checked: !option.checked }
          : option,
      ),
    );
  };

  return (
    <div>
      <h3 className="mb-2 font-semibold">Select your favorite frameworks:</h3>
      <CheckBox
        options={options}
        onValueChange={handleValueChange}
        error={{}}
      />
      <div className="mt-4 text-sm text-gray-600">
        Selected:{" "}
        {options
          .filter((o) => o.checked)
          .map((o) => o.label)
          .join(", ") || "None"}
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveCheckBoxExample />,
};

const InteractiveWithDescriptionsExample = () => {
  const [options, setOptions] = useState<CheckBoxOption[]>([
    {
      value: "react",
      label: "React",
      description: "A JavaScript library for building user interfaces",
      checked: false,
    },
    {
      value: "vue",
      label: "Vue",
      description: "The progressive JavaScript framework",
      checked: false,
    },
    {
      value: "angular",
      label: "Angular",
      description: "Platform for building mobile and desktop web apps",
      checked: false,
    },
    {
      value: "svelte",
      label: "Svelte",
      description: "Cybernetically enhanced web apps",
      checked: false,
    },
  ]);

  const handleValueChange = (value: string) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.value === value
          ? { ...option, checked: !option.checked }
          : option,
      ),
    );
  };

  return (
    <div>
      <h3 className="mb-2 font-semibold">Select your favorite frameworks:</h3>
      <CheckBox
        options={options}
        onValueChange={handleValueChange}
        error={{}}
      />
      <div className="mt-4 text-sm text-gray-600">
        Selected:{" "}
        {options
          .filter((o) => o.checked)
          .map((o) => o.label)
          .join(", ") || "None"}
      </div>
    </div>
  );
};

export const InteractiveWithDescriptions: Story = {
  render: () => <InteractiveWithDescriptionsExample />,
};

const InteractiveWithValidationExample = () => {
  const [options, setOptions] = useState<CheckBoxOption[]>([
    {
      value: "terms",
      label: "I agree to the Terms of Service",
      checked: false,
    },
    {
      value: "privacy",
      label: "I agree to the Privacy Policy",
      checked: false,
    },
    {
      value: "newsletter",
      label: "Subscribe to newsletter (optional)",
      checked: false,
    },
  ]);
  const [error, setError] = useState<{ message?: string }>({});

  const handleValueChange = (value: string) => {
    const newOptions = options.map((option) =>
      option.value === value ? { ...option, checked: !option.checked } : option,
    );
    setOptions(newOptions);

    // Validation: terms and privacy must be checked
    const termsChecked = newOptions.find((o) => o.value === "terms")?.checked;
    const privacyChecked = newOptions.find(
      (o) => o.value === "privacy",
    )?.checked;

    if (!termsChecked || !privacyChecked) {
      setError({
        message: "You must agree to Terms of Service and Privacy Policy",
      });
    } else {
      setError({});
    }
  };

  return (
    <div>
      <h3 className="mb-2 font-semibold">Please review and accept:</h3>
      <CheckBox
        options={options}
        onValueChange={handleValueChange}
        error={error}
      />
    </div>
  );
};

export const InteractiveWithValidation: Story = {
  render: () => <InteractiveWithValidationExample />,
};

// ============================================
// Interaction Tests (Play Functions)
// ============================================

export const ClickInteraction: Story = {
  args: {
    options: defaultOptions,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByRole("checkbox");

    // Test: Click first checkbox
    await userEvent.click(checkboxes[0]);
    await expect(args.onValueChange).toHaveBeenCalledWith("option1");
  },
};

export const MultipleClickInteraction: Story = {
  args: {
    options: defaultOptions,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByRole("checkbox");

    // Test: Click multiple checkboxes
    await userEvent.click(checkboxes[0]);
    await expect(args.onValueChange).toHaveBeenCalledWith("option1");

    await userEvent.click(checkboxes[1]);
    await expect(args.onValueChange).toHaveBeenCalledWith("option2");

    await userEvent.click(checkboxes[2]);
    await expect(args.onValueChange).toHaveBeenCalledWith("option3");

    await expect(args.onValueChange).toHaveBeenCalledTimes(3);
  },
};

export const CheckboxHasCorrectLabel: Story = {
  args: {
    options: [{ value: "test", label: "Test Label", checked: false }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test: Label is rendered correctly
    const label = canvas.getByText("Test Label");
    await expect(label).toBeInTheDocument();
  },
};

export const CheckedStateRendered: Story = {
  args: {
    options: [
      { value: "checked", label: "Checked Option", checked: true },
      { value: "unchecked", label: "Unchecked Option", checked: false },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByRole("checkbox");

    // Test: Checked state is rendered correctly
    await expect(checkboxes[0]).toBeChecked();
    await expect(checkboxes[1]).not.toBeChecked();
  },
};

export const DescriptionRendered: Story = {
  args: {
    options: [
      {
        value: "test",
        label: "Test Label",
        description: "This is a test description",
        checked: false,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test: Label is rendered correctly
    const label = canvas.getByText("Test Label");
    await expect(label).toBeInTheDocument();

    // Test: Description is rendered correctly
    const description = canvas.getByText("This is a test description");
    await expect(description).toBeInTheDocument();
  },
};

export const ErrorMessageRendered: Story = {
  args: {
    options: defaultOptions,
    error: { message: "This is an error message" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test: Error message is rendered
    const errorMessage = canvas.getByRole("alert");
    await expect(errorMessage).toBeInTheDocument();
    await expect(errorMessage).toHaveTextContent("This is an error message");

    // Test: Checkboxes have aria-invalid attribute
    const checkboxes = canvas.getAllByRole("checkbox");
    for (const checkbox of checkboxes) {
      await expect(checkbox).toHaveAttribute("aria-invalid", "true");
    }
  },
};

export const NoErrorWhenMessageEmpty: Story = {
  args: {
    options: defaultOptions,
    error: {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test: No error alert is rendered
    const errorMessage = canvas.queryByRole("alert");
    await expect(errorMessage).not.toBeInTheDocument();

    // Test: Checkboxes don't have aria-invalid="true"
    const checkboxes = canvas.getAllByRole("checkbox");
    for (const checkbox of checkboxes) {
      await expect(checkbox).toHaveAttribute("aria-invalid", "false");
    }
  },
};

export const KeyboardNavigation: Story = {
  args: {
    options: defaultOptions,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByRole("checkbox");

    // Focus first checkbox
    checkboxes[0].focus();
    await expect(checkboxes[0]).toHaveFocus();

    // Press Space to toggle
    await userEvent.keyboard(" ");
    await expect(args.onValueChange).toHaveBeenCalledWith("option1");

    // Tab to next checkbox
    await userEvent.tab();
    await expect(checkboxes[1]).toHaveFocus();

    // Press Space to toggle
    await userEvent.keyboard(" ");
    await expect(args.onValueChange).toHaveBeenCalledWith("option2");
  },
};

// ============================================
// Edge Cases
// ============================================

export const EmptyOptions: Story = {
  args: {
    options: [],
  },
};

export const ManyOptions: Story = {
  args: {
    options: [
      { value: "opt1", label: "Option 1", checked: false },
      { value: "opt2", label: "Option 2", checked: true },
      { value: "opt3", label: "Option 3", checked: false },
      { value: "opt4", label: "Option 4", checked: true },
      { value: "opt5", label: "Option 5", checked: false },
      { value: "opt6", label: "Option 6", checked: false },
      { value: "opt7", label: "Option 7", checked: true },
      { value: "opt8", label: "Option 8", checked: false },
    ],
  },
};

export const LongLabels: Story = {
  args: {
    options: [
      {
        value: "long1",
        label: "This is a very long label that might wrap to multiple lines",
        checked: false,
      },
      {
        value: "long2",
        label: "Another extremely long label text for testing purposes",
        checked: true,
      },
    ],
  },
};

export const LongDescriptions: Story = {
  args: {
    options: [
      {
        value: "long1",
        label: "Option with long description",
        description:
          "This is a very long description that provides additional context about what this option does and why you might want to select it",
        checked: false,
      },
      {
        value: "long2",
        label: "Another option",
        description:
          "Another lengthy description that explains the purpose and functionality of this particular checkbox option in great detail",
        checked: true,
      },
    ],
  },
};
