import { type Meta, type StoryObj } from "@storybook/react-vite";
import Table from "../components/table/Table";
import TableHeader, { THC } from "../components/table/TableHeader";
import TableRow from "../components/table/TableRow";
import TC from "../components/table/TableCell";

const meta: Meta<typeof Table> = {
  component: Table,
  title: "Components/Table",
  argTypes: {
    className: {
      control: { type: "text" },
    },
    caption: {
      control: { type: "text" },
    },
    "aria-label": {
      control: { type: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Table>;

// ============================================
// Sample Data
// ============================================

const sampleUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Viewer" },
];

const sampleProducts = [
  { id: 1, name: "Laptop Pro", price: "$1,299", stock: 45, status: "In Stock" },
  {
    id: 2,
    name: "Wireless Mouse",
    price: "$49",
    stock: 120,
    status: "In Stock",
  },
  { id: 3, name: "USB-C Hub", price: "$79", stock: 0, status: "Out of Stock" },
  {
    id: 4,
    name: "Mechanical Keyboard",
    price: "$149",
    stock: 23,
    status: "Low Stock",
  },
];

// ============================================
// Icon Components for Stories
// ============================================

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const PackageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16.5 9.4 7.55 4.24" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" x2="12" y1="22" y2="12" />
  </svg>
);

// ============================================
// Basic Stories
// ============================================

export const Default: Story = {
  render: () => (
    <Table aria-label="User list">
      <TableHeader>
        <THC>Name</THC>
        <THC>Email</THC>
        <THC>Role</THC>
      </TableHeader>
      <tbody>
        {sampleUsers.map((user) => (
          <TableRow key={user.id}>
            <TC>{user.name}</TC>
            <TC>{user.email}</TC>
            <TC>{user.role}</TC>
          </TableRow>
        ))}
      </tbody>
    </Table>
  ),
};

// ============================================
// With Caption
// ============================================

export const WithCaption: Story = {
  render: () => (
    <Table caption="User Management">
      <TableHeader>
        <THC>Name</THC>
        <THC>Email</THC>
        <THC>Role</THC>
      </TableHeader>
      <tbody>
        {sampleUsers.map((user) => (
          <TableRow key={user.id}>
            <TC>{user.name}</TC>
            <TC>{user.email}</TC>
            <TC>{user.role}</TC>
          </TableRow>
        ))}
      </tbody>
    </Table>
  ),
};

// ============================================
// With Icons
// ============================================

export const WithIcons: Story = {
  render: () => (
    <Table aria-label="User list with icons">
      <TableHeader>
        <THC>Name</THC>
        <THC>Email</THC>
        <THC>Role</THC>
      </TableHeader>
      <tbody>
        {sampleUsers.map((user) => (
          <TableRow key={user.id} icon={<UserIcon />}>
            <TC>{user.name}</TC>
            <TC>{user.email}</TC>
            <TC>{user.role}</TC>
          </TableRow>
        ))}
      </tbody>
    </Table>
  ),
};

// ============================================
// With Actions
// ============================================

export const WithActions: Story = {
  render: () => (
    <Table aria-label="User list with edit actions">
      <TableHeader>
        <THC>Name</THC>
        <THC>Email</THC>
        <THC>Role</THC>
      </TableHeader>
      <tbody>
        {sampleUsers.map((user) => (
          <TableRow
            key={user.id}
            action={
              <button
                aria-label={`Edit ${user.name}`}
                className="p-1 hover:bg-ui-border rounded-sm transition-colors text-ui-secondary hover:text-ui-primary focus:outline-2 focus:outline-ui-accent"
              >
                <EditIcon />
              </button>
            }
          >
            <TC>{user.name}</TC>
            <TC>{user.email}</TC>
            <TC>{user.role}</TC>
          </TableRow>
        ))}
      </tbody>
    </Table>
  ),
};

// ============================================
// With Icons and Actions
// ============================================

export const WithIconsAndActions: Story = {
  render: () => (
    <Table caption="Team Members">
      <TableHeader>
        <THC>Name</THC>
        <THC>Email</THC>
        <THC>Role</THC>
      </TableHeader>
      <tbody>
        {sampleUsers.map((user) => (
          <TableRow
            key={user.id}
            icon={<UserIcon />}
            action={
              <button
                aria-label={`Edit ${user.name}`}
                className="p-1 hover:bg-ui-border rounded-sm transition-colors text-ui-secondary hover:text-ui-primary focus:outline-2 focus:outline-ui-accent"
              >
                <EditIcon />
              </button>
            }
          >
            <TC>{user.name}</TC>
            <TC>{user.email}</TC>
            <TC>{user.role}</TC>
          </TableRow>
        ))}
      </tbody>
    </Table>
  ),
};

// ============================================
// Product Table Example
// ============================================

export const ProductTable: Story = {
  render: () => (
    <Table caption="Product Inventory">
      <TableHeader>
        <THC>Product</THC>
        <THC>Price</THC>
        <THC>Stock</THC>
        <THC>Status</THC>
      </TableHeader>
      <tbody>
        {sampleProducts.map((product) => (
          <TableRow key={product.id} icon={<PackageIcon />}>
            <TC>{product.name}</TC>
            <TC>{product.price}</TC>
            <TC>{product.stock}</TC>
            <TC>
              <span
                className={
                  product.status === "In Stock"
                    ? "text-ui-success"
                    : product.status === "Out of Stock"
                      ? "text-ui-danger"
                      : "text-ui-secondary"
                }
              >
                {product.status}
              </span>
            </TC>
          </TableRow>
        ))}
      </tbody>
    </Table>
  ),
};

// ============================================
// Empty Table
// ============================================

export const EmptyTable: Story = {
  render: () => (
    <Table aria-label="Empty user list">
      <TableHeader>
        <THC>Name</THC>
        <THC>Email</THC>
        <THC>Role</THC>
      </TableHeader>
      <tbody>
        <tr>
          <td colSpan={5} className="text-center py-8 text-ui-secondary">
            No data available
          </td>
        </tr>
      </tbody>
    </Table>
  ),
};

// ============================================
// With Long Content (Truncation)
// ============================================

export const WithLongContent: Story = {
  render: () => (
    <Table caption="Products with Long Descriptions">
      <TableHeader>
        <THC>Name</THC>
        <THC>Description</THC>
        <THC>Status</THC>
      </TableHeader>
      <tbody>
        <TableRow>
          <TC>Very Long Product Name That Should Be Truncated</TC>
          <TC>
            This is a very long description that demonstrates how the table
            handles overflow content with text truncation using CSS ellipsis
          </TC>
          <TC>Active</TC>
        </TableRow>
        <TableRow>
          <TC>Another Item</TC>
          <TC>Short description</TC>
          <TC>Inactive</TC>
        </TableRow>
      </tbody>
    </Table>
  ),
};

// ============================================
// Custom Column Widths
// ============================================

export const CustomColumnWidths: Story = {
  render: () => (
    <Table aria-label="User list with custom column widths">
      <TableHeader>
        <THC className="w-1/4">Name</THC>
        <THC className="w-1/2">Email</THC>
        <THC className="w-1/4">Role</THC>
      </TableHeader>
      <tbody>
        {sampleUsers.map((user) => (
          <TableRow key={user.id}>
            <TC className="w-1/4">{user.name}</TC>
            <TC className="w-1/2">{user.email}</TC>
            <TC className="w-1/4">{user.role}</TC>
          </TableRow>
        ))}
      </tbody>
    </Table>
  ),
};

// ============================================
// With External Heading (aria-labelledby)
// ============================================

export const WithExternalHeading: Story = {
  render: () => (
    <div>
      <h2 id="users-heading" className="text-xl font-bold mb-4 text-ui-primary">
        Registered Users
      </h2>
      <Table aria-labelledby="users-heading">
        <TableHeader>
          <THC>Name</THC>
          <THC>Email</THC>
          <THC>Role</THC>
        </TableHeader>
        <tbody>
          {sampleUsers.map((user) => (
            <TableRow key={user.id}>
              <TC>{user.name}</TC>
              <TC>{user.email}</TC>
              <TC>{user.role}</TC>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  ),
};
