import { type Meta, type StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { expect, within, userEvent, fn, waitFor } from "storybook/test";
import Select from "../components/Select";

const meta: Meta<typeof Select> = {
  component: Select,
  title: "Components/Select",
  argTypes: {
    variant: {
      options: ["default", "filled", "accent"],
      control: { type: "select" },
    },
    value: {
      control: { type: "text" },
    },
    placeholder: {
      control: { type: "text" },
    },
    error: {
      control: { type: "boolean" },
    },
  },
  args: {
    onChange: fn(),
    placeholder: "Select...",
    value: "",
    variant: "default",
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

// Sample options for stories
const fruitOptions = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Dragon Fruit", value: "dragonfruit" },
];

const countryOptions = [
  { label: "Japan", value: "jp" },
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Germany", value: "de" },
  { label: "France", value: "fr" },
];

const languageOptions = [
  { label: "English", value: "en" },
  { label: "日本語", value: "ja" },
  { label: "Español", value: "es" },
];

// ============================================
// Basic Stories
// ============================================

export const Default: Story = {
  args: {
    options: fruitOptions,
    variant: "default",
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<typeof args>();

    return (
      <Select
        {...args}
        value={value}
        onChange={(newValue) => {
          updateArgs({ value: newValue });
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

export const Filled: Story = {
  args: {
    options: fruitOptions,
    variant: "filled",
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<typeof args>();

    return (
      <Select
        {...args}
        value={value}
        onChange={(newValue) => {
          updateArgs({ value: newValue });
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

export const Accent: Story = {
  args: {
    options: fruitOptions,
    variant: "accent",
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<typeof args>();

    return (
      <Select
        {...args}
        value={value}
        onChange={(newValue) => {
          updateArgs({ value: newValue });
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

export const WithPreselectedValue: Story = {
  args: {
    options: fruitOptions,
    value: "banana",
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<typeof args>();

    return (
      <Select
        {...args}
        value={value}
        onChange={(newValue) => {
          updateArgs({ value: newValue });
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

export const WithCountries: Story = {
  args: {
    options: countryOptions,
    placeholder: "Select country...",
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<typeof args>();

    return (
      <Select
        {...args}
        value={value}
        onChange={(newValue) => {
          updateArgs({ value: newValue });
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

export const WithLanguages: Story = {
  args: {
    options: languageOptions,
    value: "ja",
    placeholder: "Select language...",
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<typeof args>();

    return (
      <Select
        {...args}
        value={value}
        onChange={(newValue) => {
          updateArgs({ value: newValue });
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

export const WithError: Story = {
  args: {
    options: fruitOptions,
    error: true,
    placeholder: "Required field",
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<typeof args>();

    return (
      <Select
        {...args}
        value={value}
        onChange={(newValue) => {
          updateArgs({ value: newValue });
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

// ============================================
// Edge Cases
// ============================================

export const SingleOption: Story = {
  args: {
    options: [{ label: "Only Option", value: "only" }],
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<typeof args>();

    return (
      <Select
        {...args}
        value={value}
        onChange={(newValue) => {
          updateArgs({ value: newValue });
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

export const ManyOptions: Story = {
  args: {
    options: Array.from({ length: 20 }, (_, i) => ({
      label: `Option ${i + 1}`,
      value: `option-${i + 1}`,
    })),
    placeholder: "Select from many...",
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<typeof args>();

    return (
      <Select
        {...args}
        value={value}
        onChange={(newValue) => {
          updateArgs({ value: newValue });
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

// ============================================
// Interaction Tests
// ============================================

export const SelectInteraction: Story = {
  args: {
    options: fruitOptions,
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<typeof args>();

    return (
      <Select
        {...args}
        value={value}
        onChange={(newValue) => {
          updateArgs({ value: newValue });
          args.onChange?.(newValue);
        }}
      />
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const selectButton = canvas.getByRole("button");

    // Test: Select button exists
    await expect(selectButton).toBeInTheDocument();

    // Test: Shows placeholder initially
    await expect(selectButton).toHaveTextContent("Select...");

    // Test: Open dropdown
    await userEvent.click(selectButton);

    // Test: Options are visible
    const options = canvas.getAllByRole("option");
    await expect(options).toHaveLength(4);

    // Test: Select an option
    await userEvent.click(canvas.getByText("Banana"));

    // Test: onChange was called with correct value
    await expect(args.onChange).toHaveBeenCalledWith("banana");

    // Test: Dropdown closes after selection
    await waitFor(() => {
      expect(canvas.queryByRole("listbox")).not.toBeInTheDocument();
    });
  },
};

// ============================================
// All Variants (Visual Comparison)
// ============================================

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div>
        <p className="text-sm mb-1 text-ui-secondary">Default</p>
        <Select
          options={fruitOptions}
          value=""
          variant="default"
          placeholder="Select..."
        />
      </div>
      <div>
        <p className="text-sm mb-1 text-ui-secondary">Filled</p>
        <Select
          options={fruitOptions}
          value=""
          variant="filled"
          placeholder="Select..."
        />
      </div>
      <div>
        <p className="text-sm mb-1 text-ui-secondary">Accent</p>
        <Select
          options={fruitOptions}
          value=""
          variant="accent"
          placeholder="Select..."
        />
      </div>
      <div>
        <p className="text-sm mb-1 text-ui-secondary">With Error</p>
        <Select options={fruitOptions} value="" error placeholder="Required" />
      </div>
    </div>
  ),
};
