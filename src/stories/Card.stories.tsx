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

// ============================================
// Basic Stories (Visual Documentation)
// ============================================

export const Default: Story = {
  args: {
    variant: "default",
    children: "This is a default card with dark background.",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "This is an outline card with paper-like background.",
  },
};

export const Accent: Story = {
  args: {
    variant: "accent",
    children: "This is an accent card for highlighting content.",
  },
};

// ============================================
// With Title and Footer
// ============================================

export const WithTitle: Story = {
  args: {
    variant: "outline",
    title: "Card Title",
    children: "Card body content with a title header.",
  },
};

export const WithTitleAndFooter: Story = {
  args: {
    variant: "outline",
    title: "Card Title",
    footer: "Card Footer - additional info",
    children: "Card body content with both title and footer.",
  },
};

// ============================================
// Semantic Elements (as prop)
// ============================================

export const AsArticle: Story = {
  args: {
    as: "article",
    variant: "outline",
    title: "Blog Post Title",
    children:
      "This card renders as an <article> element with max-w-prose for optimal reading width. Perfect for blog posts or self-contained content.",
    footer: "Posted on 2024-01-01",
  },
};

export const AsSection: Story = {
  args: {
    as: "section",
    variant: "outline",
    title: "Dashboard Section",
    children: "This card renders as a <section> element for thematic grouping.",
  },
};

// ============================================
// All Variants (Visual Comparison)
// ============================================

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

// ============================================
// With Rich Content
// ============================================

export const WithRichContent: Story = {
  args: {
    variant: "outline",
    title: "Rich Content Card",
    footer: "Last updated: Today",
    children: (
      <div className="space-y-2">
        <p>This card contains rich content with multiple elements.</p>
        <ul className="list-disc list-inside">
          <li>Feature one</li>
          <li>Feature two</li>
          <li>Feature three</li>
        </ul>
      </div>
    ),
  },
};
