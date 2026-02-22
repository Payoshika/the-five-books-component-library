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

const PlaceholderContent = ({ label }: { label?: string }) => (
  <div className="rounded-lg border-2 border-dashed border-ui-border bg-ui-accent/5 p-6 text-center text-sm text-ui-secondary">
    {label || "Container Content"}
  </div>
);

export const Default: Story = {
  args: {
    size: "default",
    children: <PlaceholderContent label="Default Container (max-w-10xl)" />,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-6">
      {(
        [
          { size: "default", label: "default — max-w-10xl" },
          { size: "narrow", label: "narrow — max-w-3xl" },
          { size: "full", label: "full — max-w-full" },
        ] as const
      ).map(({ size, label }) => (
        <div key={size}>
          <p className="text-xs font-bold text-ui-secondary mb-2">{label}</p>
          <Container
            size={size}
            className="bg-ui-accent/5 border border-ui-border rounded-lg"
          >
            <div className="p-4 text-sm text-center text-ui-primary">
              {size}
            </div>
          </Container>
        </div>
      ))}
    </div>
  ),
};

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

export const SizeClassesApplied: Story = {
  render: () => (
    <>
      <Container size="default" className="">
        <span data-testid="default">default</span>
      </Container>
      <Container size="narrow" className="">
        <span data-testid="narrow">narrow</span>
      </Container>
      <Container size="full" className="">
        <span data-testid="full">full</span>
      </Container>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const defaultEl = canvas.getByTestId("default").parentElement!;
    await expect(defaultEl).toHaveClass("max-w-10xl");
    await expect(defaultEl).toHaveClass("mx-auto");
    await expect(defaultEl).toHaveClass("px-4");

    const narrowEl = canvas.getByTestId("narrow").parentElement!;
    await expect(narrowEl).toHaveClass("max-w-3xl");

    const fullEl = canvas.getByTestId("full").parentElement!;
    await expect(fullEl).toHaveClass("max-w-full");
  },
};
