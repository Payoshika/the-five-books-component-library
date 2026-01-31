import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Card from "../Card";

describe("Card", () => {
  // ============================================
  // 1. Basic Rendering
  // ============================================
  describe("Basic Rendering", () => {
    it("renders children content correctly", () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText("Card content")).toBeInTheDocument();
    });

    it("renders with default props (variant='outline', as='div')", () => {
      render(<Card>Default card</Card>);
      const content = screen.getByText("Default card");
      // Content is inside inner div, which is inside the Card div
      const card = content.closest(".rounded-sm");
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass(
        "bg-ui-bg",
        "text-ui-primary",
        "border-ui-border",
      );
    });

    it("applies custom className alongside default classes", () => {
      render(<Card className="custom-class">Styled card</Card>);
      const card = screen.getByText("Styled card").closest(".rounded-sm");
      expect(card).toHaveClass("custom-class");
      expect(card).toHaveClass("rounded-sm", "border");
    });
  });

  // ============================================
  // 2. Variant Styles
  // ============================================
  describe("Variant Styles", () => {
    it("renders with variant='default' and applies correct classes", () => {
      render(<Card variant="default">Default variant</Card>);
      const card = screen.getByText("Default variant").closest(".rounded-sm");
      expect(card).toHaveClass(
        "bg-ui-primary",
        "text-ui-bg",
        "border-transparent",
      );
    });

    it("renders with variant='outline' and applies correct classes", () => {
      render(<Card variant="outline">Outline variant</Card>);
      const card = screen.getByText("Outline variant").closest(".rounded-sm");
      expect(card).toHaveClass(
        "bg-ui-bg",
        "text-ui-primary",
        "border-ui-border",
      );
    });

    it("renders with variant='accent' and applies correct classes", () => {
      render(<Card variant="accent">Accent variant</Card>);
      const card = screen.getByText("Accent variant").closest(".rounded-sm");
      expect(card).toHaveClass(
        "bg-ui-accent",
        "text-ui-bg",
        "border-transparent",
      );
    });
  });

  // ============================================
  // 3. Semantic Elements (as prop)
  // ============================================
  describe("Semantic Elements", () => {
    it("renders as div by default", () => {
      render(<Card>Default element</Card>);
      const content = screen.getByText("Default element");
      // The parent of content is the body div, grandparent is the card
      const card = content.parentElement?.parentElement;
      expect(card?.tagName).toBe("DIV");
    });

    it("renders as article when as='article'", () => {
      render(<Card as="article">Article card</Card>);
      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
      expect(article).toHaveClass("max-w-prose");
    });

    it("renders as section when as='section'", () => {
      render(<Card as="section">Section card</Card>);
      // section doesn't have an implicit role, so we find by text
      const card = screen.getByText("Section card").closest("section");
      expect(card).toBeInTheDocument();
      expect(card?.tagName).toBe("SECTION");
    });

    it("applies max-w-prose only for article element", () => {
      const { rerender } = render(<Card as="div">Div card</Card>);
      let content = screen.getByText("Div card");
      let card = content.parentElement?.parentElement;
      expect(card).not.toHaveClass("max-w-prose");

      rerender(<Card as="article">Article card</Card>);
      const article = screen.getByRole("article");
      expect(article).toHaveClass("max-w-prose");

      rerender(<Card as="section">Section card</Card>);
      content = screen.getByText("Section card");
      card = content.parentElement?.parentElement;
      expect(card).not.toHaveClass("max-w-prose");
    });
  });

  // ============================================
  // 4. Title
  // ============================================
  describe("Title", () => {
    it("renders title when provided", () => {
      render(<Card title="Card Title">Content</Card>);
      expect(screen.getByText("Card Title")).toBeInTheDocument();
    });

    it("does not render title section when title is not provided", () => {
      render(<Card>Content only</Card>);
      const card =
        screen.getByText("Content only").parentElement?.parentElement;
      // Should only have the body div, not a title div
      expect(card?.children.length).toBe(1);
    });

    it("renders title with correct styling", () => {
      render(<Card title="Styled Title">Content</Card>);
      const titleElement = screen.getByText("Styled Title");
      expect(titleElement).toHaveClass("font-bold", "text-lg", "border-b");
    });

    it("renders ReactNode as title", () => {
      render(
        <Card title={<span data-testid="custom-title">Custom Title</span>}>
          Content
        </Card>,
      );
      expect(screen.getByTestId("custom-title")).toBeInTheDocument();
    });

    it("applies correct inner border class for each variant title", () => {
      const { rerender } = render(
        <Card variant="default" title="Title">
          Content
        </Card>,
      );
      let titleElement = screen.getByText("Title");
      expect(titleElement).toHaveClass("border-ui-bg/20");

      rerender(
        <Card variant="outline" title="Title">
          Content
        </Card>,
      );
      titleElement = screen.getByText("Title");
      expect(titleElement).toHaveClass("border-ui-border/30");

      rerender(
        <Card variant="accent" title="Title">
          Content
        </Card>,
      );
      titleElement = screen.getByText("Title");
      expect(titleElement).toHaveClass("border-ui-bg/20");
    });
  });

  // ============================================
  // 5. Footer
  // ============================================
  describe("Footer", () => {
    it("renders footer when provided", () => {
      render(<Card footer="Card Footer">Content</Card>);
      expect(screen.getByText("Card Footer")).toBeInTheDocument();
    });

    it("does not render footer section when footer is not provided", () => {
      render(<Card>Content only</Card>);
      const card =
        screen.getByText("Content only").parentElement?.parentElement;
      expect(card?.children.length).toBe(1);
    });

    it("renders footer with correct styling", () => {
      render(<Card footer="Styled Footer">Content</Card>);
      const footerElement = screen.getByText("Styled Footer").closest("footer");
      expect(footerElement).toHaveClass("text-sm", "italic", "border-t");
    });

    it("renders ReactNode as footer", () => {
      render(
        <Card footer={<button data-testid="footer-btn">Action</button>}>
          Content
        </Card>,
      );
      expect(screen.getByTestId("footer-btn")).toBeInTheDocument();
    });
  });

  // ============================================
  // 6. Complete Card (Title + Content + Footer)
  // ============================================
  describe("Complete Card", () => {
    it("renders title, content, and footer in correct order", () => {
      render(
        <Card title="Title" footer="Footer">
          Body Content
        </Card>,
      );

      // Find the card container using the base class
      const card = screen.getByText("Body Content").closest(".rounded-sm");
      const children = card?.children;

      expect(children?.length).toBe(3);
      expect(children?.[0]).toHaveTextContent("Title");
      expect(children?.[1]).toHaveTextContent("Body Content");
      expect(children?.[2]).toHaveTextContent("Footer");
    });

    it("renders with all props combined", () => {
      render(
        <Card
          as="article"
          variant="accent"
          title="Full Card"
          footer="Footer info"
          className="extra-class"
        >
          Full content
        </Card>,
      );

      const article = screen.getByRole("article");
      expect(article).toHaveClass("bg-ui-accent", "max-w-prose", "extra-class");
      expect(screen.getByText("Full Card")).toBeInTheDocument();
      expect(screen.getByText("Full content")).toBeInTheDocument();
      expect(screen.getByText("Footer info")).toBeInTheDocument();
    });
  });
});
