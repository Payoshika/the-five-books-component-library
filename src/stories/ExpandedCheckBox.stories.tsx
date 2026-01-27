import { type Meta, type StoryObj } from "@storybook/react-vite";
import { expect, within, userEvent, fn } from "storybook/test";
import ExpandedCheckBox from "../components/ExpandedCheckBox";
import { type CheckBoxProps, type CheckBoxOption } from "../components/CheckBox";
import { useState } from "react";

const meta: Meta<CheckBoxProps> = {
  component: ExpandedCheckBox,
  title: "Components/ExpandedCheckBox",
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
// Stories with Descriptions
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
        value: "basic",
        label: "Basic Plan",
        description: "Perfect for individuals getting started",
        checked: true,
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
        checked: true,
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
    error: { message: "This combination is not allowed" },
  },
};

export const WithDescriptionsAndError: Story = {
  args: {
    options: optionsWithDescriptions,
    error: { message: "Please select a valid plan" },
  },
};

// ============================================
// Disabled States
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
// Interactive Stories
// ============================================

const InteractiveExpandedCheckBoxExample = () => {
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
          : option
      )
    );
  };

  return (
    <ExpandedCheckBox
      options={options}
      onValueChange={handleValueChange}
      error={{}}
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveExpandedCheckBoxExample />,
};

const InteractiveWithDescriptionsExample = () => {
  const [options, setOptions] = useState<CheckBoxOption[]>([
    {
      value: "notifications",
      label: "Email Notifications",
      description: "Receive updates about your account via email",
      checked: true,
    },
    {
      value: "marketing",
      label: "Marketing Emails",
      description: "Receive promotional content and special offers",
      checked: false,
    },
    {
      value: "newsletter",
      label: "Weekly Newsletter",
      description: "Get a weekly digest of the latest news and articles",
      checked: false,
    },
  ]);

  const handleValueChange = (value: string) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.value === value
          ? { ...option, checked: !option.checked }
          : option
      )
    );
  };

  return (
    <ExpandedCheckBox
      options={options}
      onValueChange={handleValueChange}
      error={{}}
    />
  );
};

export const InteractiveWithDescriptions: Story = {
  render: () => <InteractiveWithDescriptionsExample />,
};

// ============================================
// Interaction Tests
// ============================================

export const ToggleExpansion: Story = {
  args: {
    options: defaultOptions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggleButton = canvas.getByText("click to open the option");

    // Initially, checkboxes should not be visible
    expect(canvas.queryByRole("checkbox")).toBeNull();

    // Click to expand
    await userEvent.click(toggleButton);

    // Now checkboxes should be visible
    const checkboxes = canvas.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);

    // Click again to collapse
    await userEvent.click(toggleButton);

    // Checkboxes should be hidden again
    expect(canvas.queryByRole("checkbox")).toBeNull();
  },
};

export const ExpandAndSelectOption: Story = {
  args: {
    options: defaultOptions,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggleButton = canvas.getByText("click to open the option");

    // Expand the checkbox options
    await userEvent.click(toggleButton);

    // Find and click a checkbox
    const checkboxes = canvas.getAllByRole("checkbox");
    await userEvent.click(checkboxes[0]);

    // Verify onValueChange was called
    expect(args.onValueChange).toHaveBeenCalledWith("option1");
  },
};

export const ExpandWithDescriptions: Story = {
  args: {
    options: optionsWithDescriptions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggleButton = canvas.getByText("click to open the option");

    // Expand
    await userEvent.click(toggleButton);

    // Check that descriptions are rendered
    expect(
      canvas.getByText("Perfect for individuals getting started")
    ).toBeInTheDocument();
    expect(
      canvas.getByText("Best for professionals and small teams")
    ).toBeInTheDocument();
    expect(
      canvas.getByText("Advanced features for large organizations")
    ).toBeInTheDocument();
  },
};

export const ExpandWithError: Story = {
  args: {
    options: defaultOptions,
    error: { message: "Please select at least one option" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggleButton = canvas.getByText("click to open the option");

    // Expand
    await userEvent.click(toggleButton);

    // Error message should be visible
    const errorMessage = canvas.getByRole("alert");
    expect(errorMessage).toHaveTextContent("Please select at least one option");
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
      { value: "opt4", label: "Option 4", checked: false },
      { value: "opt5", label: "Option 5", checked: true },
      { value: "opt6", label: "Option 6", checked: false },
      { value: "opt7", label: "Option 7", checked: false },
      { value: "opt8", label: "Option 8", checked: true },
      { value: "opt9", label: "Option 9", checked: false },
      { value: "opt10", label: "Option 10", checked: false },
    ],
  },
};

export const LongLabels: Story = {
  args: {
    options: [
      {
        value: "long1",
        label:
          "This is a very long option label that might wrap to multiple lines",
        checked: false,
      },
      {
        value: "long2",
        label:
          "Another extremely long label to test how the component handles text overflow",
        checked: true,
      },
    ],
  },
};

export const LongDescriptions: Story = {
  args: {
    options: [
      {
        value: "desc1",
        label: "Option with Long Description",
        description:
          "This is a very detailed description that explains everything about this option in great detail, potentially spanning multiple lines of text.",
        checked: false,
      },
      {
        value: "desc2",
        label: "Another Option",
        description:
          "Another comprehensive description that provides extensive information about what this option does and why you might want to select it.",
        checked: false,
      },
    ],
  },
};
