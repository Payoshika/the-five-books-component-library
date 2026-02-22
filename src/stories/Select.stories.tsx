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

const fruitOptions = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Dragon Fruit", value: "dragonfruit" },
];

export const Default: Story = {
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
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      {(
        [
          { variant: "default", label: "Default" },
          { variant: "filled", label: "Filled" },
          { variant: "accent", label: "Accent" },
        ] as const
      ).map(({ variant, label }) => (
        <div key={variant}>
          <p className="text-sm mb-1 text-ui-secondary">{label}</p>
          <Select
            options={fruitOptions}
            value=""
            variant={variant}
            placeholder="Select..."
          />
        </div>
      ))}
      <div>
        <p className="text-sm mb-1 text-ui-secondary">With Error</p>
        <Select
          options={fruitOptions}
          value=""
          error={{ message: "Required field" }}
          placeholder="Required"
        />
      </div>
    </div>
  ),
};

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

    await expect(selectButton).toHaveTextContent("Select...");

    await userEvent.click(selectButton);

    const options = canvas.getAllByRole("option");
    await expect(options).toHaveLength(4);

    await userEvent.click(canvas.getByText("Banana"));
    await expect(args.onChange).toHaveBeenCalledWith("banana");

    await waitFor(() => {
      expect(canvas.queryByRole("listbox")).not.toBeInTheDocument();
    });
  },
};
