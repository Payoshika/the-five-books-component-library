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

// ============================================
// Basic Stories (Visual Documentation)
// ============================================

export const Default: Story = {
  args: {
    placeholder: "Enter your text here...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Description",
    placeholder: "Enter a description...",
  },
};

export const WithError: Story = {
  args: {
    label: "Bio",
    placeholder: "Tell us about yourself...",
    error: { message: "This field is required" },
  },
};

export const WithCustomMaxChar: Story = {
  args: {
    label: "Short Comment",
    placeholder: "Keep it brief...",
    maxChar: 100,
  },
};

export const WithAction: Story = {
  args: {
    label: "Message",
    placeholder: "Type your message...",
    componentAction: fn(),
    actionLabel: "Send",
  },
};

// ============================================
// States
// ============================================

export const Disabled: Story = {
  args: {
    label: "Disabled TextArea",
    placeholder: "This field is disabled",
    disabled: true,
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: "Pre-filled Content",
    defaultValue:
      "This is some pre-filled content that was already in the textarea.",
  },
};

export const NearMaxCharacter: Story = {
  args: {
    label: "Almost Full",
    maxChar: 50,
    defaultValue: "This text is getting close to the max limit",
  },
};

export const AtMaxCharacter: Story = {
  args: {
    label: "At Maximum",
    maxChar: 30,
    defaultValue: "This is exactly thirty chars!",
  },
};

// ============================================
// Interaction Tests (Play Functions)
// ============================================

export const TypeInteraction: Story = {
  args: {
    label: "Comments",
    placeholder: "Type something...",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");

    // Test: TextArea is typeable
    await userEvent.type(textarea, "Hello, World!");
    await expect(textarea).toHaveValue("Hello, World!");
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const CharacterCountUpdates: Story = {
  args: {
    label: "Character Counter Test",
    maxChar: 100,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");

    // Test: Character count updates as user types
    await userEvent.type(textarea, "Testing");
    await expect(canvas.getByText("7 / 100")).toBeInTheDocument();
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

    // Test: Cannot type beyond max character limit
    await userEvent.type(
      textarea,
      "This is a very long text that exceeds the limit",
    );
    await expect(textarea).toHaveValue("This is a ");
    await expect(canvas.getByText("10 / 10")).toBeInTheDocument();
  },
};

export const ActionButtonClick: Story = {
  args: {
    label: "With Action",
    placeholder: "Type and submit...",
    actionLabel: "Submit",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");
    const button = canvas.getByRole("button", { name: "Submit" });

    // Test: Type text and click action button
    await userEvent.type(textarea, "My submission");
    await userEvent.click(button);
    await expect(args.componentAction).toHaveBeenCalledTimes(1);
  },
};

export const DisabledNoInteraction: Story = {
  args: {
    label: "Disabled Field",
    placeholder: "Cannot type here",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");

    // Test: TextArea is disabled
    await expect(textarea).toBeDisabled();
  },
};

export const ErrorStateDisplayed: Story = {
  args: {
    label: "Required Field",
    error: { message: "This field cannot be empty" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test: Error message is displayed
    await expect(
      canvas.getByText("This field cannot be empty"),
    ).toBeInTheDocument();
  },
};

export const KeyboardAccessibility: Story = {
  args: {
    label: "Accessible TextArea",
    placeholder: "Use Tab to focus...",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");

    // Test: TextArea can be focused
    textarea.focus();
    await expect(textarea).toHaveFocus();

    // Test: Can type with keyboard
    await userEvent.keyboard("Typed via keyboard");
    await expect(textarea).toHaveValue("Typed via keyboard");
  },
};

// ============================================
// Visual Comparison Stories
// ============================================

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

export const DifferentMaxChars: Story = {
  args: {
    maxChar: 1000,
  },

  render: () => (
    <div className="flex flex-col gap-6 max-w-md">
      <TextArea
        label="50 Characters Max"
        maxChar={50}
        placeholder="Short input..."
      />
      <TextArea
        label="1000 Characters Max"
        maxChar={1000}
        placeholder="Super Long input..."
      />
      <TextArea
        label="500 Characters Max (Default)"
        maxChar={500}
        placeholder="Long input..."
      />
    </div>
  ),
};
