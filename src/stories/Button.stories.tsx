import { type Meta, type StoryObj } from "@storybook/react-vite";
import { expect, within, userEvent, fn } from "storybook/test";
import Button from "../components/Button";
import { type ComponentProps } from "react";

type StoryProps = ComponentProps<typeof Button> & {
  buttonText: string;
};

const meta: Meta<StoryProps> = {
  component: Button,
  title: "Components/Button",
  argTypes: {
    size: {
      options: ["xs", "sm", "md", "lg"],
      control: { type: "select" },
    },
    variant: {
      options: ["default", "outline", "primary", "accent", "danger"],
      control: { type: "select" },
    },
    isLoading: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
  args: {
    buttonText: "Button",
    onClick: fn(),
  },
  render: ({ buttonText, ...args }) => <Button {...args}>{buttonText}</Button>,
};

export default meta;

type Story = StoryObj<StoryProps>;

// ============================================
// Basic Stories (Visual Documentation)
// ============================================

export const Default: Story = {
  args: {
    buttonText: "Default Button",
    variant: "default",
    size: "md",
  },
};

export const Outline: Story = {
  args: {
    buttonText: "Outline Button",
    variant: "outline",
  },
};

export const Primary: Story = {
  args: {
    buttonText: "Primary Button",
    variant: "primary",
  },
};

export const Accent: Story = {
  args: {
    buttonText: "Accent Button",
    variant: "accent",
  },
};

export const Danger: Story = {
  args: {
    buttonText: "Danger Button",
    variant: "danger",
  },
};

// ============================================
// Size Variants
// ============================================

export const SizeXS: Story = {
  args: {
    buttonText: "XS",
    size: "xs",
  },
};

export const SizeSM: Story = {
  args: {
    buttonText: "Small",
    size: "sm",
  },
};

export const SizeMD: Story = {
  args: {
    buttonText: "Medium",
    size: "md",
  },
};

export const SizeLG: Story = {
  args: {
    buttonText: "Large",
    size: "lg",
  },
};

// ============================================
// States
// ============================================

export const Loading: Story = {
  args: {
    buttonText: "Submitting...",
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    buttonText: "Disabled",
    disabled: true,
  },
};

// ============================================
// Interaction Tests (Play Functions)
// ============================================

export const ClickInteraction: Story = {
  args: {
    buttonText: "Click Me",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Test: Button is clickable
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const DisabledNoClick: Story = {
  args: {
    buttonText: "Cannot Click",
    disabled: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Test: Button is disabled
    await expect(button).toBeDisabled();

    // Clicking a disabled button won't trigger onClick
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const LoadingNoClick: Story = {
  args: {
    buttonText: "Processing",
    isLoading: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Test: Button shows loading state
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("aria-busy", "true");

    // Clicking won't trigger onClick while loading
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const KeyboardAccessibility: Story = {
  args: {
    buttonText: "Press Enter",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Test: Button can be focused and activated with keyboard
    button.focus();
    await expect(button).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalled();
  },
};

// ============================================
// All Variants (Visual Comparison)
// ============================================

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="xs">XS</Button>
      <Button size="sm">SM</Button>
      <Button size="md">MD</Button>
      <Button size="lg">LG</Button>
    </div>
  ),
};
