import { type Meta, type StoryObj } from "@storybook/react-vite";
import Card from "../components/Card";

const meta: Meta<typeof Card> = {
  component: Card,
  title: "Components/Card",
  argTypes: {
    variant: {
      options: ["default", "outline", "accent"],
      control: { type: "select" },
    },
    as: {
      options: ["div", "article", "section"],
      control: { type: "select" },
    },
    title: {
      control: { type: "text" },
    },
    footer: {
      control: { type: "text" },
    },
  },
  args: {
    children: "Card content goes here",
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    variant: "default",
    children: "This is a default card.",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Card variant="default" title="Default">
        Dark background card
      </Card>
      <Card variant="outline" title="Outline">
        Paper-like background card
      </Card>
      <Card variant="accent" title="Accent">
        Accent color background card
      </Card>
    </div>
  ),
};

export const WithTitleAndFooter: Story = {
  args: {
    variant: "outline",
    title: "Card Title",
    footer: "Card Footer — additional info",
    children: "Card body content with both title and footer.",
  },
};
