import { type Meta, type StoryObj } from "@storybook/react-vite";
import { expect, within, userEvent, fn } from "storybook/test";
import Modal from "../components/Modal";
import { type ComponentProps, useState } from "react";
import { Button } from "../components/Button";

type StoryProps = ComponentProps<typeof Modal>;

const SimpleContent = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-2">Simple Modal</h2>
    <p className="text-ui-fg-muted">
      This is a simple modal with basic content.
    </p>
  </div>
);

const meta: Meta<StoryProps> = {
  component: Modal,
  title: "Components/Modal",
  argTypes: {
    isOpen: {
      control: { type: "boolean" },
    },
    showCancel: {
      control: { type: "boolean" },
    },
  },
  args: {
    isOpen: true,
    onClose: fn(),
    onAction: fn(),
    showCancel: true,
    children: <SimpleContent />,
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Default: Story = {
  args: {
    isOpen: true,
    showCancel: true,
    children: <SimpleContent />,
  },
};

export const WithoutCancel: Story = {
  args: {
    isOpen: true,
    showCancel: false,
    children: <SimpleContent />,
  },
};

const InteractiveModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showCancel={true}
        onAction={() => {
          alert("Action triggered!");
          setIsOpen(false);
        }}
      >
        <SimpleContent />
      </Modal>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveModalExample />,
};

export const CancelButtonClick: Story = {
  args: {
    isOpen: true,
    showCancel: true,
    children: <SimpleContent />,
  },
  play: async ({ args }) => {
    const body = within(document.body);
    const cancelButton = body.getByRole("button", { name: "Cancel" });

    await userEvent.click(cancelButton);
    await expect(args.onClose).toHaveBeenCalledTimes(1);

    // Clicking modal content should not close the modal
    const modalHeading = body.getByText("Simple Modal");
    await userEvent.click(modalHeading);
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};
