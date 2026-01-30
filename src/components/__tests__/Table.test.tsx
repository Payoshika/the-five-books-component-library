import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Table from "../table/Table";
import TableHeader, { THC } from "../table/TableHeader";
import TableRow from "../table/TableRow";
import TC from "../table/TableCell";

// Helper component for complete table rendering
const renderCompleteTable = (props?: {
  tableProps?: Partial<React.ComponentProps<typeof Table>>;
  withIcons?: boolean;
  withActions?: boolean;
}) => {
  const {
    tableProps = {},
    withIcons = false,
    withActions = false,
  } = props || {};

  return render(
    <Table {...tableProps}>
      <TableHeader>
        <THC>Name</THC>
        <THC>Email</THC>
        <THC>Role</THC>
      </TableHeader>
      <tbody>
        <TableRow
          icon={withIcons ? <span data-testid="user-icon">👤</span> : undefined}
          action={
            withActions ? (
              <button data-testid="edit-btn" aria-label="Edit John">
                Edit
              </button>
            ) : undefined
          }
        >
          <TC>John Doe</TC>
          <TC>john@example.com</TC>
          <TC>Admin</TC>
        </TableRow>
        <TableRow
          icon={withIcons ? <span data-testid="user-icon">👤</span> : undefined}
          action={
            withActions ? (
              <button data-testid="edit-btn" aria-label="Edit Jane">
                Edit
              </button>
            ) : undefined
          }
        >
          <TC>Jane Smith</TC>
          <TC>jane@example.com</TC>
          <TC>Editor</TC>
        </TableRow>
      </tbody>
    </Table>,
  );
};

describe("Table", () => {
  // ============================================
  // 1. Basic Rendering
  // ============================================
  describe("Basic Rendering", () => {
    it("renders table with children", () => {
      renderCompleteTable();
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("renders within a scrollable region", () => {
      renderCompleteTable();
      const region = screen.getByRole("region");
      expect(region).toBeInTheDocument();
      expect(region).toHaveAttribute("aria-label", "Scrollable table");
    });

    it("makes the scrollable container focusable", () => {
      renderCompleteTable();
      const region = screen.getByRole("region");
      expect(region).toHaveAttribute("tabIndex", "0");
    });

    it("applies default styling classes", () => {
      renderCompleteTable();
      const region = screen.getByRole("region");
      expect(region).toHaveClass(
        "overflow-x-auto",
        "border",
        "border-ui-border",
        "bg-ui-bg",
      );
    });

    it("applies custom className to table", () => {
      renderCompleteTable({ tableProps: { className: "custom-table" } });
      const table = screen.getByRole("table");
      expect(table).toHaveClass("custom-table");
    });
  });

  // ============================================
  // 2. Caption
  // ============================================
  describe("Caption", () => {
    it("renders caption when provided", () => {
      renderCompleteTable({ tableProps: { caption: "User Management" } });
      const caption = screen.getByText("User Management");
      expect(caption).toBeInTheDocument();
      expect(caption.tagName).toBe("CAPTION");
    });

    it("does not render caption when not provided", () => {
      renderCompleteTable();
      const table = screen.getByRole("table");
      expect(within(table).queryByRole("caption")).not.toBeInTheDocument();
    });

    it("applies correct styling to caption", () => {
      renderCompleteTable({ tableProps: { caption: "Styled Caption" } });
      const caption = screen.getByText("Styled Caption");
      expect(caption).toHaveClass(
        "px-4",
        "py-3",
        "text-left",
        "text-ui-secondary",
        "font-semibold",
      );
    });
  });

  // ============================================
  // 3. Accessibility Props
  // ============================================
  describe("Accessibility", () => {
    it("applies aria-label to table", () => {
      renderCompleteTable({ tableProps: { "aria-label": "User list" } });
      const table = screen.getByRole("table");
      expect(table).toHaveAttribute("aria-label", "User list");
    });

    it("applies aria-labelledby to table", () => {
      render(
        <div>
          <h2 id="table-heading">Users</h2>
          <Table aria-labelledby="table-heading">
            <tbody>
              <tr>
                <td>Content</td>
              </tr>
            </tbody>
          </Table>
        </div>,
      );
      const table = screen.getByRole("table");
      expect(table).toHaveAttribute("aria-labelledby", "table-heading");
    });

    it("can have both caption and aria-label", () => {
      renderCompleteTable({
        tableProps: {
          caption: "User Management",
          "aria-label": "Detailed user list",
        },
      });
      const table = screen.getByRole("table");
      expect(screen.getByText("User Management")).toBeInTheDocument();
      expect(table).toHaveAttribute("aria-label", "Detailed user list");
    });
  });
});

describe("TableHeader", () => {
  // ============================================
  // 1. Basic Rendering
  // ============================================
  describe("Basic Rendering", () => {
    it("renders thead element", () => {
      renderCompleteTable();
      const rowgroups = screen.getAllByRole("rowgroup");
      const thead = rowgroups[0]; // First rowgroup is thead
      expect(thead).toBeInTheDocument();
      expect(thead.tagName).toBe("THEAD");
    });

    it("renders header row with children", () => {
      renderCompleteTable();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Role")).toBeInTheDocument();
    });

    it("applies correct styling classes", () => {
      renderCompleteTable();
      const thead = document.querySelector("thead");
      expect(thead).toHaveClass(
        "bg-ui-bg",
        "border-b",
        "border-ui-border",
        "uppercase",
        "text-xs",
        "text-ui-secondary",
      );
    });
  });

  // ============================================
  // 2. Accessibility
  // ============================================
  describe("Accessibility", () => {
    it("renders empty header cells with sr-only labels", () => {
      renderCompleteTable();
      expect(screen.getByText("Row icon")).toHaveClass("sr-only");
      expect(screen.getByText("Row action")).toHaveClass("sr-only");
    });

    it("all th elements have scope='col'", () => {
      renderCompleteTable();
      const headerCells = document.querySelectorAll("th");
      headerCells.forEach((th) => {
        expect(th).toHaveAttribute("scope", "col");
      });
    });
  });
});

describe("THC (Table Header Cell)", () => {
  it("renders th element with children", () => {
    render(
      <table>
        <thead>
          <tr>
            <THC>Header Text</THC>
          </tr>
        </thead>
      </table>,
    );
    const th = screen.getByRole("columnheader");
    expect(th).toHaveTextContent("Header Text");
  });

  it("has scope='col' attribute", () => {
    render(
      <table>
        <thead>
          <tr>
            <THC>Header</THC>
          </tr>
        </thead>
      </table>,
    );
    const th = screen.getByRole("columnheader");
    expect(th).toHaveAttribute("scope", "col");
  });

  it("applies default styling classes", () => {
    render(
      <table>
        <thead>
          <tr>
            <THC>Header</THC>
          </tr>
        </thead>
      </table>,
    );
    const th = screen.getByRole("columnheader");
    expect(th).toHaveClass("px-4", "py-3", "font-semibold", "text-ui-primary");
  });

  it("applies custom className", () => {
    render(
      <table>
        <thead>
          <tr>
            <THC className="w-1/2">Header</THC>
          </tr>
        </thead>
      </table>,
    );
    const th = screen.getByRole("columnheader");
    expect(th).toHaveClass("w-1/2");
  });
});

describe("TableRow", () => {
  // ============================================
  // 1. Basic Rendering
  // ============================================
  describe("Basic Rendering", () => {
    it("renders tr element with children", () => {
      renderCompleteTable();
      const rows = screen.getAllByRole("row");
      // 1 header row + 2 data rows
      expect(rows).toHaveLength(3);
    });

    it("renders cell content", () => {
      renderCompleteTable();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });

    it("applies default styling classes", () => {
      renderCompleteTable();
      const dataRows = screen.getAllByRole("row").slice(1); // Skip header row
      dataRows.forEach((row) => {
        expect(row).toHaveClass(
          "group",
          "border-b",
          "border-ui-border",
          "transition-colors",
        );
      });
    });

    it("applies custom className", () => {
      render(
        <table>
          <tbody>
            <TableRow className="custom-row">
              <TC>Cell</TC>
            </TableRow>
          </tbody>
        </table>,
      );
      const row = screen.getByRole("row");
      expect(row).toHaveClass("custom-row");
    });
  });

  // ============================================
  // 2. Icon
  // ============================================
  describe("Icon", () => {
    it("renders icon when provided", () => {
      renderCompleteTable({ withIcons: true });
      const icons = screen.getAllByTestId("user-icon");
      expect(icons).toHaveLength(2);
    });

    it("does not render icon container when icon is not provided", () => {
      renderCompleteTable({ withIcons: false });
      expect(screen.queryByTestId("user-icon")).not.toBeInTheDocument();
    });

    it("marks icon as aria-hidden for screen readers", () => {
      renderCompleteTable({ withIcons: true });
      const iconContainers = screen.getAllByTestId("user-icon");
      iconContainers.forEach((icon) => {
        expect(icon.parentElement).toHaveAttribute("aria-hidden", "true");
      });
    });
  });

  // ============================================
  // 3. Action
  // ============================================
  describe("Action", () => {
    it("renders action when provided", () => {
      renderCompleteTable({ withActions: true });
      const actions = screen.getAllByTestId("edit-btn");
      expect(actions).toHaveLength(2);
    });

    it("does not render action when not provided", () => {
      renderCompleteTable({ withActions: false });
      expect(screen.queryByTestId("edit-btn")).not.toBeInTheDocument();
    });

    it("action buttons have aria-label for accessibility", () => {
      renderCompleteTable({ withActions: true });
      expect(screen.getByLabelText("Edit John")).toBeInTheDocument();
      expect(screen.getByLabelText("Edit Jane")).toBeInTheDocument();
    });
  });

  // ============================================
  // 4. Complete Row
  // ============================================
  describe("Complete Row", () => {
    it("renders with both icon and action", () => {
      renderCompleteTable({ withIcons: true, withActions: true });
      expect(screen.getAllByTestId("user-icon")).toHaveLength(2);
      expect(screen.getAllByTestId("edit-btn")).toHaveLength(2);
    });
  });
});

describe("TC (Table Cell)", () => {
  // ============================================
  // 1. Basic Rendering
  // ============================================
  describe("Basic Rendering", () => {
    it("renders td element with children", () => {
      render(
        <table>
          <tbody>
            <tr>
              <TC>Cell Content</TC>
            </tr>
          </tbody>
        </table>,
      );
      const cell = screen.getByRole("cell");
      expect(cell).toHaveTextContent("Cell Content");
    });

    it("applies default styling classes", () => {
      render(
        <table>
          <tbody>
            <tr>
              <TC>Cell</TC>
            </tr>
          </tbody>
        </table>,
      );
      const cell = screen.getByRole("cell");
      expect(cell).toHaveClass(
        "px-4",
        "py-3",
        "align-middle",
        "text-ui-primary",
      );
    });

    it("applies custom className", () => {
      render(
        <table>
          <tbody>
            <tr>
              <TC className="w-1/3">Cell</TC>
            </tr>
          </tbody>
        </table>,
      );
      const cell = screen.getByRole("cell");
      expect(cell).toHaveClass("w-1/3");
    });
  });

  // ============================================
  // 2. Truncation
  // ============================================
  describe("Truncation", () => {
    it("wraps content in truncate div", () => {
      render(
        <table>
          <tbody>
            <tr>
              <TC>Long content</TC>
            </tr>
          </tbody>
        </table>,
      );
      const truncateDiv = screen.getByText("Long content");
      expect(truncateDiv).toHaveClass("truncate", "w-full");
    });

    it("adds title attribute for string children", () => {
      render(
        <table>
          <tbody>
            <tr>
              <TC>Truncated text</TC>
            </tr>
          </tbody>
        </table>,
      );
      const truncateDiv = screen.getByText("Truncated text");
      expect(truncateDiv).toHaveAttribute("title", "Truncated text");
    });

    it("does not add title attribute for non-string children", () => {
      render(
        <table>
          <tbody>
            <tr>
              <TC>
                <span data-testid="complex-content">Complex</span>
              </TC>
            </tr>
          </tbody>
        </table>,
      );
      const content = screen.getByTestId("complex-content");
      expect(content.parentElement).not.toHaveAttribute("title");
    });
  });
});

describe("Complete Table Integration", () => {
  it("renders a complete accessible table", () => {
    render(
      <Table caption="User Management" aria-label="List of users">
        <TableHeader>
          <THC>Name</THC>
          <THC>Email</THC>
          <THC>Role</THC>
        </TableHeader>
        <tbody>
          <TableRow
            icon={<span>👤</span>}
            action={<button aria-label="Edit user">Edit</button>}
          >
            <TC>John Doe</TC>
            <TC>john@example.com</TC>
            <TC>Admin</TC>
          </TableRow>
        </tbody>
      </Table>,
    );

    // Check table structure
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("region")).toBeInTheDocument();

    // Check caption
    expect(screen.getByText("User Management")).toBeInTheDocument();

    // Check headers
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();

    // Check data
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();

    // Check accessibility
    expect(screen.getByRole("table")).toHaveAttribute(
      "aria-label",
      "List of users",
    );
    expect(screen.getByLabelText("Edit user")).toBeInTheDocument();
  });

  it("renders empty table state", () => {
    render(
      <Table aria-label="Empty table">
        <TableHeader>
          <THC>Name</THC>
          <THC>Email</THC>
        </TableHeader>
        <tbody>
          <tr>
            <td colSpan={4} className="text-center py-8">
              No data available
            </td>
          </tr>
        </tbody>
      </Table>,
    );

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });
});
