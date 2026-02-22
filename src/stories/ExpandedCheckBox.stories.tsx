import { type Meta, type StoryObj } from "@storybook/react-vite";
import { expect, within, userEvent, fn } from "storybook/test";
import ExpandedCheckBox from "../components/ExpandedCheckBox";
import {
  type CheckBoxProps,
  type CheckBoxOption,
} from "../components/CheckBox";

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

const defaultOptions: CheckBoxOption[] = [
  { value: "option1", label: "Option 1", checked: false },
  { value: "option2", label: "Option 2", checked: true },
  { value: "option3", label: "Option 3", checked: false },
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
    checked: true,
  },
  {
    value: "enterprise",
    label: "Enterprise Plan",
    description: "Advanced features for large organizations",
    checked: false,
  },
];

export const Default: Story = {
  args: {
    options: defaultOptions,
  },
};

export const WithDescriptions: Story = {
  args: {
    options: optionsWithDescriptions,
  },
};

export const States: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold text-ui-secondary mb-2">Error</p>
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={() => {}}
          error={{ message: "Please select at least one option" }}
        />
      </div>
      <div>
        <p className="text-xs font-bold text-ui-secondary mb-2">Disabled</p>
        <ExpandedCheckBox
          options={defaultOptions}
          onValueChange={() => {}}
          error={{}}
          disabled
        />
      </div>
    </div>
  ),
};

export const ToggleExpansion: Story = {
  args: {
    options: defaultOptions,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggleButton = canvas.getByText("click to open the option");

    // Initially collapsed — no checkboxes visible
    expect(canvas.queryByRole("checkbox")).toBeNull();

    // Expand
    await userEvent.click(toggleButton);
    const checkboxes = canvas.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);

    // Select an option
    await userEvent.click(checkboxes[0]);
    expect(args.onValueChange).toHaveBeenCalledWith("option1");

    // Collapse
    await userEvent.click(toggleButton);
    expect(canvas.queryByRole("checkbox")).toBeNull();
  },
};
