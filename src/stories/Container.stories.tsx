import { type Meta, type StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Container } from "../components/layout/Container";
import { type ComponentProps } from "react";

type ContainerProps = ComponentProps<typeof Container>;

const meta: Meta<ContainerProps> = {
  component: Container,
  title: "Layout/Container",
  argTypes: {
    size: {
      options: ["default", "narrow", "full"],
      control: { type: "select" },
    },
    className: {
      control: { type: "text" },
    },
  },
  args: {
    className: "",
  },
};

export default meta;

type Story = StoryObj<ContainerProps>;

// Placeholder content used across stories
const PlaceholderContent = ({ label }: { label?: string }) => (
  <div className="rounded-lg border-2 border-dashed border-ui-border bg-ui-accent/5 p-6 text-center text-sm text-ui-secondary">
    {label || "Container Content"}
  </div>
);

const MultiBlockContent = () => (
  <div className="space-y-4">
    <div className="rounded-lg bg-ui-accent/10 p-4 text-sm text-ui-primary font-bold">
      Header Block
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-lg border border-ui-border bg-ui-bg p-4 text-sm text-ui-secondary text-center"
        >
          Card {i}
        </div>
      ))}
    </div>
    <div className="rounded-lg bg-ui-accent/10 p-4 text-sm text-ui-primary font-bold">
      Footer Block
    </div>
  </div>
);

// ============================================
// Basic Stories (Visual Documentation)
// ============================================

export const Default: Story = {
  args: {
    size: "default",
    children: <PlaceholderContent label="Default Container (max-w-10xl)" />,
  },
};

export const Narrow: Story = {
  args: {
    size: "narrow",
    children: <PlaceholderContent label="Narrow Container (max-w-3xl)" />,
  },
};

export const Full: Story = {
  args: {
    size: "full",
    children: <PlaceholderContent label="Full Width Container (max-w-full)" />,
  },
};

// ============================================
// Size Comparison
// ============================================

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-ui-secondary mb-2 font-bold">
          size=&quot;default&quot; (max-w-10xl)
        </p>
        <Container size="default" className="bg-ui-accent/5 border border-ui-border rounded-lg">
          <div className="p-4 text-sm text-center text-ui-primary">Default</div>
        </Container>
      </div>
      <div>
        <p className="text-xs text-ui-secondary mb-2 font-bold">
          size=&quot;narrow&quot; (max-w-3xl)
        </p>
        <Container size="narrow" className="bg-ui-accent/5 border border-ui-border rounded-lg">
          <div className="p-4 text-sm text-center text-ui-primary">Narrow</div>
        </Container>
      </div>
      <div>
        <p className="text-xs text-ui-secondary mb-2 font-bold">
          size=&quot;full&quot; (max-w-full)
        </p>
        <Container size="full" className="bg-ui-accent/5 border border-ui-border rounded-lg">
          <div className="p-4 text-sm text-center text-ui-primary">Full</div>
        </Container>
      </div>
    </div>
  ),
};

// ============================================
// With Realistic Content
// ============================================

export const WithCardLayout: Story = {
  args: {
    size: "default",
    children: <MultiBlockContent />,
  },
};

export const NarrowWithForm: Story = {
  args: {
    size: "narrow",
    children: (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-ui-primary">Sign Up</h2>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-ui-primary">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-lg border border-ui-border bg-ui-bg px-3 py-2 text-sm"
            readOnly
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-ui-primary">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-ui-border bg-ui-bg px-3 py-2 text-sm"
            readOnly
          />
        </div>
        <button className="w-full rounded-lg bg-ui-accent px-4 py-2 text-sm font-bold text-white">
          Submit
        </button>
      </div>
    ),
  },
};

export const FullWidthBanner: Story = {
  args: {
    size: "full",
    children: (
      <div className="rounded-lg bg-ui-accent/10 p-8 text-center">
        <h1 className="text-2xl font-bold text-ui-primary mb-2">
          Full Width Banner
        </h1>
        <p className="text-sm text-ui-secondary">
          This container stretches to the full available width.
        </p>
      </div>
    ),
  },
};

// ============================================
// Custom className
// ============================================

export const WithCustomClassName: Story = {
  args: {
    size: "default",
    className: "bg-ui-accent/5 rounded-xl py-8",
    children: (
      <PlaceholderContent label="Container with custom className (bg + rounded + padding)" />
    ),
  },
};

export const WithNoPadding: Story = {
  args: {
    size: "default",
    className: "px-0 sm:px-0 lg:px-0",
    children: (
      <PlaceholderContent label="Container with padding overridden to 0" />
    ),
  },
};

// ============================================
// Nested Containers
// ============================================

export const NestedContainers: Story = {
  render: () => (
    <Container size="full" className="bg-ui-accent/5 py-6 rounded-lg">
      <p className="text-xs text-ui-secondary mb-4 font-bold">
        Outer: size=&quot;full&quot;
      </p>
      <Container size="narrow" className="bg-ui-bg border border-ui-border rounded-lg py-4">
        <p className="text-xs text-ui-secondary mb-2 font-bold">
          Inner: size=&quot;narrow&quot;
        </p>
        <PlaceholderContent label="Nested content inside narrow container" />
      </Container>
    </Container>
  ),
};

// ============================================
// Responsive Behavior
// ============================================

export const ResponsiveDemo: Story = {
  args: {
    size: "default",
    children: (
      <div className="space-y-2">
        <p className="text-sm text-ui-primary font-bold">
          Resize the viewport to see responsive padding
        </p>
        <p className="text-xs text-ui-secondary">
          Mobile: px-4 → Tablet: px-6 → Desktop: px-8
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-lg border-2 border-dashed border-ui-border p-4 text-center text-sm text-ui-secondary"
            >
              Item {i}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: "responsive",
    },
  },
};

// ============================================
// Interaction Tests (Play Functions)
// ============================================

export const RendersChildren: Story = {
  args: {
    size: "default",
    children: <p data-testid="child-content">Hello, Container!</p>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const child = canvas.getByTestId("child-content");
    await expect(child).toBeInTheDocument();
    await expect(child).toHaveTextContent("Hello, Container!");
  },
};

export const DefaultSizeHasCorrectClass: Story = {
  args: {
    size: "default",
    children: <span>Content</span>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = canvas.getByText("Content");
    const container = content.parentElement!;
    await expect(container).toHaveClass("mx-auto");
    await expect(container).toHaveClass("w-full");
    await expect(container).toHaveClass("max-w-10xl");
  },
};

export const NarrowSizeHasCorrectClass: Story = {
  args: {
    size: "narrow",
    children: <span>Content</span>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = canvas.getByText("Content");
    const container = content.parentElement!;
    await expect(container).toHaveClass("max-w-3xl");
  },
};

export const FullSizeHasCorrectClass: Story = {
  args: {
    size: "full",
    children: <span>Content</span>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = canvas.getByText("Content");
    const container = content.parentElement!;
    await expect(container).toHaveClass("max-w-full");
  },
};

export const CustomClassNameApplied: Story = {
  args: {
    size: "default",
    className: "my-custom-class",
    children: <span>Content</span>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = canvas.getByText("Content");
    const container = content.parentElement!;
    await expect(container).toHaveClass("my-custom-class");
    // Default classes should still be present
    await expect(container).toHaveClass("mx-auto");
    await expect(container).toHaveClass("w-full");
  },
};

export const ResponsivePaddingClasses: Story = {
  args: {
    size: "default",
    children: <span>Content</span>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = canvas.getByText("Content");
    const container = content.parentElement!;
    await expect(container).toHaveClass("px-4");
    await expect(container).toHaveClass("sm:px-6");
    await expect(container).toHaveClass("lg:px-8");
  },
};

// ============================================
// Edge Cases
// ============================================

export const EmptyContainer: Story = {
  args: {
    size: "default",
    children: null as unknown as React.ReactNode,
  },
};

export const DeeplyNestedContent: Story = {
  args: {
    size: "default",
    children: (
      <div>
        <div>
          <div>
            <PlaceholderContent label="Deeply nested content" />
          </div>
        </div>
      </div>
    ),
  },
};

export const WithLongContent: Story = {
  args: {
    size: "narrow",
    children: (
      <div className="space-y-4">
        {Array.from({ length: 10 }, (_, i) => (
          <p key={i} className="text-sm text-ui-secondary">
            Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            ullamco laboris.
          </p>
        ))}
      </div>
    ),
  },
};
