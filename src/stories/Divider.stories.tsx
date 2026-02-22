import { type Meta, type StoryObj } from "@storybook/react-vite";
import { Divider } from "../components/Divider";

const meta: Meta<typeof Divider> = {
  component: Divider,
  title: "Components/Divider",
  argTypes: {
    variant: {
      options: [
        "border",
        "primary",
        "secondary",
        "accent",
        "danger",
        "success",
      ],
      control: { type: "select" },
    },
    styleVariant: {
      options: ["solid", "dashed", "dotted"],
      control: { type: "select" },
    },
    thickness: {
      options: ["sm", "md", "lg"],
      control: { type: "select" },
    },
    orientation: {
      options: ["horizontal", "vertical"],
      control: { type: "select" },
    },
  },
  args: {
    variant: "border",
    styleVariant: "solid",
    thickness: "sm",
    orientation: "horizontal",
  },
};

export default meta;

type Story = StoryObj<typeof Divider>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      {(
        [
          "border",
          "primary",
          "secondary",
          "accent",
          "danger",
          "success",
        ] as const
      ).map((variant) => (
        <div key={variant}>
          <p className="text-xs font-bold text-ui-secondary mb-2">{variant}</p>
          <Divider variant={variant} thickness="md" />
        </div>
      ))}
    </div>
  ),
};

export const AllStyleVariants: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      {(["solid", "dashed", "dotted"] as const).map((styleVariant) => (
        <div key={styleVariant}>
          <p className="text-xs font-bold text-ui-secondary mb-2">
            {styleVariant}
          </p>
          <Divider
            styleVariant={styleVariant}
            variant="primary"
            thickness="md"
          />
        </div>
      ))}
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4 h-16">
      <span className="text-sm text-ui-secondary">Left</span>
      <Divider orientation="vertical" variant="border" thickness="sm" />
      <span className="text-sm text-ui-secondary">Middle</span>
      <Divider
        orientation="vertical"
        variant="accent"
        thickness="md"
        styleVariant="dashed"
      />
      <span className="text-sm text-ui-secondary">Right</span>
    </div>
  ),
};
