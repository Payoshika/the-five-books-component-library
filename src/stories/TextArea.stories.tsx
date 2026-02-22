import { type Meta, type StoryObj } from "@storybook/react-vite";
import { expect, within, userEvent, fn } from "storybook/test";
import TextArea from "../components/TextArea";
import { type ComponentProps } from "react";

type StoryProps = ComponentProps<typeof TextArea>;

const meta: Meta<StoryProps> = {
  component: TextArea,
  title: "Components/TextArea",
  argTypes: {
    label: {
      control: { type: "text" },
    },
    placeholder: {
      control: { type: "text" },
    },
    maxChar: {
      control: { type: "number" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    actionLabel: {
      control: { type: "text" },
    },
  },
  args: {
    onChange: fn(),
    componentAction: fn(),
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Default: Story = {
  args: {
    label: "Description",
    placeholder: "Enter your text here...",
    maxChar: 500,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-md">
      <TextArea label="Default" placeholder="Default state..." />
      <TextArea
        label="With Error"
        placeholder="Error state..."
        error={{ message: "Something went wrong" }}
      />
      <TextArea label="Disabled" placeholder="Disabled state..." disabled />
      <TextArea
        label="With Action"
        placeholder="Has action button..."
        componentAction={() => {}}
        actionLabel="Save"
      />
    </div>
  ),
};

export const TypeInteraction: Story = {
  args: {
    label: "Comments",
    placeholder: "Type something...",
    maxChar: 100,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");

    await userEvent.type(textarea, "Hello, World!");
    await expect(textarea).toHaveValue("Hello, World!");
    await expect(args.onChange).toHaveBeenCalled();
    await expect(canvas.getByText("13 / 100")).toBeInTheDocument();
  },
};

export const MaxCharacterEnforced: Story = {
  args: {
    label: "Max Limit Test",
    maxChar: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");

    await userEvent.type(
      textarea,
      "This is a very long text that exceeds the limit",
    );
    await expect(textarea).toHaveValue("This is a ");
    await expect(canvas.getByText("10 / 10")).toBeInTheDocument();
  },
};
