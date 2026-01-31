import { type Meta, type StoryObj } from "@storybook/react-vite";
import { expect, within, userEvent, fn } from "storybook/test";
import Modal from "../components/Modal";
import { type ComponentProps, useState } from "react";
import Button from "../components/Button";

type StoryProps = ComponentProps<typeof Modal>;

// Sample content components for better examples
const SimpleContent = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-2">Simple Modal</h2>
    <p className="text-ui-fg-muted">
      This is a simple modal with basic content.
    </p>
  </div>
);

const ConfirmationContent = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-2">Confirm Action</h2>
    <p className="text-ui-fg-muted">
      Are you sure you want to delete this item? This action cannot be undone.
    </p>
  </div>
);

const FormContent = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4">Create New Item</h2>
    <form className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          placeholder="Enter name"
          className="w-full px-3 py-2 border border-ui-border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          placeholder="Enter description"
          rows={3}
          className="w-full px-3 py-2 border border-ui-border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select className="w-full px-3 py-2 border border-ui-border rounded-md">
          <option>Select a category</option>
          <option>Category 1</option>
          <option>Category 2</option>
          <option>Category 3</option>
        </select>
      </div>
    </form>
  </div>
);

const LongContent = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>
    <div className="text-ui-fg-muted space-y-4">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris.
      </p>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo.
      </p>
      <p>
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
        fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
        sequi nesciunt.
      </p>
      <p>
        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
        consectetur, adipisci velit, sed quia non numquam eius modi tempora
        incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
      </p>
    </div>
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

// ============================================
// Basic Stories (Visual Documentation)
// ============================================

export const Default: Story = {
  args: {
    isOpen: true,
    showCancel: true,
    children: <SimpleContent />,
  },
};

export const ConfirmationDialog: Story = {
  args: {
    isOpen: true,
    showCancel: true,
    onAction: fn(),
    children: <ConfirmationContent />,
  },
};

export const FormModal: Story = {
  args: {
    isOpen: true,
    showCancel: true,
    onAction: fn(),
    children: <FormContent />,
  },
};

export const ScrollableContent: Story = {
  args: {
    isOpen: true,
    showCancel: true,
    onAction: fn(),
    children: <LongContent />,
  },
};

export const WithoutCancel: Story = {
  args: {
    isOpen: true,
    showCancel: false,
    onAction: fn(),
    children: <SimpleContent />,
  },
};

export const WithoutAction: Story = {
  args: {
    isOpen: true,
    showCancel: true,
    onAction: undefined,
    children: <SimpleContent />,
  },
};

export const MinimalModal: Story = {
  args: {
    isOpen: true,
    showCancel: false,
    onAction: undefined,
    children: (
      <div className="p-6">
        <p className="text-ui-fg-muted">
          Click outside to close this minimal modal.
        </p>
      </div>
    ),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    children: <SimpleContent />,
  },
};

// ============================================
// Interactive Examples
// ============================================

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

const InteractiveFormExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>Create New Item</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showCancel={true}
        onAction={() => {
          alert("Form submitted!");
          setIsOpen(false);
        }}
      >
        <FormContent />
      </Modal>
    </div>
  );
};

export const InteractiveForm: Story = {
  render: () => <InteractiveFormExample />,
};

const InteractiveConfirmationExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Delete Item
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showCancel={true}
        onAction={() => {
          alert("Item deleted!");
          setIsOpen(false);
        }}
      >
        <ConfirmationContent />
      </Modal>
    </div>
  );
};

export const InteractiveConfirmation: Story = {
  render: () => <InteractiveConfirmationExample />,
};

// ============================================
// Interaction Tests (Play Functions)
// ============================================

export const CloseOnBackdropClick: Story = {
  args: {
    isOpen: true,
    showCancel: true,
    children: <SimpleContent />,
  },
  play: async ({ args }) => {
    // Modal uses createPortal, so we need to query from document.body
    const body = within(document.body);

    // Find the dialog
    const dialog = body.getByRole("dialog");

    // Clicking the backdrop (dialog element) should trigger onClose
    await userEvent.click(dialog);
    await expect(args.onClose).toHaveBeenCalled();
  },
};

export const CancelButtonClick: Story = {
  args: {
    isOpen: true,
    showCancel: true,
    children: <SimpleContent />,
  },
  play: async ({ args }) => {
    // Modal uses createPortal, so we need to query from document.body
    const body = within(document.body);
    const cancelButton = body.getByRole("button", { name: "Cancel" });

    // Test: Cancel button triggers onClose
    await userEvent.click(cancelButton);
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};

export const ActionButtonClick: Story = {
  args: {
    isOpen: true,
    showCancel: true,
    onAction: fn(),
    children: <SimpleContent />,
  },
  play: async ({ args }) => {
    // Modal uses createPortal, so we need to query from document.body
    const body = within(document.body);
    const actionButton = body.getByRole("button", { name: "Action" });

    // Test: Action button triggers onAction
    await userEvent.click(actionButton);
    await expect(args.onAction).toHaveBeenCalledTimes(1);
  },
};

export const ModalContentClickDoesNotClose: Story = {
  args: {
    isOpen: true,
    showCancel: true,
    children: <SimpleContent />,
  },
  play: async ({ args }) => {
    // Modal uses createPortal, so we need to query from document.body
    const body = within(document.body);

    // Find the modal content by heading
    const modalHeading = body.getByText("Simple Modal");

    // Clicking the modal content should NOT trigger onClose (stopPropagation)
    await userEvent.click(modalHeading);
    await expect(args.onClose).not.toHaveBeenCalled();
  },
};

// ============================================
// All Variants (Visual Comparison)
// ============================================

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <h3 className="text-lg font-semibold">
        Modal variants are shown one at a time. Use the Interactive stories to
        see the modal in action.
      </h3>
      <p>Available configurations:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>
          <strong>Default</strong> - Simple modal with content
        </li>
        <li>
          <strong>ConfirmationDialog</strong> - Delete confirmation style
        </li>
        <li>
          <strong>FormModal</strong> - Modal with form inputs
        </li>
        <li>
          <strong>ScrollableContent</strong> - Long content that scrolls
        </li>
        <li>
          <strong>WithoutCancel</strong> - Only Action button
        </li>
        <li>
          <strong>WithoutAction</strong> - Only Cancel button
        </li>
        <li>
          <strong>MinimalModal</strong> - No buttons, close by clicking outside
        </li>
      </ul>
      <div className="mt-4">
        <p className="font-medium">Interactive Examples:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>
            <strong>Interactive</strong> - Basic open/close flow
          </li>
          <li>
            <strong>InteractiveForm</strong> - Form submission flow
          </li>
          <li>
            <strong>InteractiveConfirmation</strong> - Delete confirmation flow
          </li>
        </ul>
      </div>
    </div>
  ),
};
