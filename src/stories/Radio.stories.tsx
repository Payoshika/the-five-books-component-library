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

const defaultOptions: Option[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export const Default: Story = {
  args: {
    options: defaultOptions,
    name: "default-radio",
    defaultValue: "option1",
  },
};

export const States: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold text-ui-secondary mb-2">Error</p>
        <Radio
          options={defaultOptions}
          name="error-radio"
          error={{ message: "Please select an option" }}
        />
      </div>
      <div>
        <p className="text-xs font-bold text-ui-secondary mb-2">Disabled</p>
        <Radio
          options={defaultOptions}
          name="disabled-radio"
          defaultValue="option2"
          disabled
          error={{}}
        />
      </div>
    </div>
  ),
};

const InteractiveRadioExample = () => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  return (
    <div className="space-y-4">
      <Radio
        options={defaultOptions}
        name="interactive-radio"
        onChange={(e) => setSelectedValue(e.target.value)}
        error={{}}
      />
      <p className="text-sm text-ui-secondary">
        Selected: <strong>{selectedValue || "None"}</strong>
      </p>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveRadioExample />,
};

export const OnlyOneSelected: Story = {
  render: () => {
    const [value, setValue] = useState<string>("");
    return (
      <Radio
        options={defaultOptions}
        name="single-selection-test"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={{}}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText("Option 1"));
    const radio1 = canvas.getByRole("radio", { name: "Option 1" });
    await expect(radio1).toBeChecked();

    await userEvent.click(canvas.getByText("Option 2"));
    const radio2 = canvas.getByRole("radio", { name: "Option 2" });
    await expect(radio2).toBeChecked();
    await expect(radio1).not.toBeChecked();
  },
};
