import { type Meta, type StoryObj } from "@storybook/react-vite";
import { expect, within, userEvent, fn } from "storybook/test";
import CheckBox, {
  type CheckBoxProps,
  type CheckBoxOption,
} from "../components/CheckBox";

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
        <CheckBox
          options={defaultOptions}
          onValueChange={() => {}}
          error={{ message: "Please select at least one option" }}
        />
      </div>
      <div>
        <p className="text-xs font-bold text-ui-secondary mb-2">Disabled</p>
        <CheckBox
          options={defaultOptions}
          onValueChange={() => {}}
          error={{}}
          disabled
        />
      </div>
    </div>
  ),
};

export const ClickInteraction: Story = {
  args: {
    options: defaultOptions,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByRole("checkbox");

    await userEvent.click(checkboxes[0]);
    await expect(args.onValueChange).toHaveBeenCalledWith("option1");

    await userEvent.click(checkboxes[2]);
    await expect(args.onValueChange).toHaveBeenCalledWith("option3");

    await expect(args.onValueChange).toHaveBeenCalledTimes(2);
  },
};
