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

const sampleUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Viewer" },
];

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
