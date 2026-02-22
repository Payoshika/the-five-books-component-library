import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Container } from "../layout/Container";

describe("Container", () => {
  // ============================================
  // 1. Basic Rendering
  // ============================================
  describe("Basic Rendering", () => {
    it("renders children content correctly", () => {
      render(<Container className="">Hello World</Container>);
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    it("renders as a div element", () => {
      render(
        <Container className="" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container.tagName).toBe("DIV");
    });

    it("renders with default size when size prop is not provided", () => {
      render(
        <Container className="" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("max-w-10xl");
    });

    it("renders with base classes", () => {
      render(
        <Container className="" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("mx-auto", "w-full");
    });

    it("renders complex children content", () => {
      render(
        <Container className="">
          <h1>Title</h1>
          <p>Paragraph text</p>
          <button>Click me</button>
        </Container>,
      );
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Paragraph text")).toBeInTheDocument();
      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("renders null children without crashing", () => {
      render(
        <Container className="" data-testid="container">
          {null}
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).toBeInTheDocument();
    });
  });

  // ============================================
  // 2. Size Variants
  // ============================================
  describe("Size Variants", () => {
    it("applies max-w-10xl for size='default'", () => {
      render(
        <Container size="default" className="" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("max-w-10xl");
    });

    it("applies max-w-3xl for size='narrow'", () => {
      render(
        <Container size="narrow" className="" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("max-w-3xl");
    });

    it("applies max-w-full for size='full'", () => {
      render(
        <Container size="full" className="" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("max-w-full");
    });

    it("does not apply narrow class when size='default'", () => {
      render(
        <Container size="default" className="" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).not.toHaveClass("max-w-3xl");
      expect(container).not.toHaveClass("max-w-full");
    });

    it("does not apply default or full class when size='narrow'", () => {
      render(
        <Container size="narrow" className="" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).not.toHaveClass("max-w-10xl");
      expect(container).not.toHaveClass("max-w-full");
    });

    it("does not apply default or narrow class when size='full'", () => {
      render(
        <Container size="full" className="" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).not.toHaveClass("max-w-10xl");
      expect(container).not.toHaveClass("max-w-3xl");
    });
  });

  // ============================================
  // 3. Responsive Padding
  // ============================================
  describe("Responsive Padding", () => {
    it("applies mobile padding class px-4", () => {
      render(
        <Container className="" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("px-4");
    });

    it("applies tablet padding class sm:px-6", () => {
      render(
        <Container className="" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("sm:px-6");
    });

    it("applies desktop padding class lg:px-8", () => {
      render(
        <Container className="" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("lg:px-8");
    });

    it("has all responsive padding classes at once", () => {
      render(
        <Container className="" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("px-4", "sm:px-6", "lg:px-8");
    });
  });

  // ============================================
  // 4. Custom className
  // ============================================
  describe("Custom className", () => {
    it("applies custom className alongside default classes", () => {
      render(
        <Container className="my-custom-class" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("my-custom-class");
      expect(container).toHaveClass("mx-auto", "w-full");
    });

    it("applies multiple custom class names", () => {
      render(
        <Container className="bg-red-500 rounded-xl py-8" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("bg-red-500", "rounded-xl", "py-8");
    });

    it("allows overriding padding with twMerge", () => {
      render(
        <Container className="px-0" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      // twMerge should resolve the conflicting padding classes
      expect(container).toHaveClass("px-0");
    });

    it("preserves base classes when empty className is provided", () => {
      render(
        <Container className="" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("mx-auto", "w-full", "px-4", "sm:px-6", "lg:px-8");
    });
  });

  // ============================================
  // 5. Size + className Combination
  // ============================================
  describe("Size + className Combination", () => {
    it("applies both size classes and custom className", () => {
      render(
        <Container size="narrow" className="bg-gray-100" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("max-w-3xl", "bg-gray-100");
    });

    it("applies full size with custom padding override", () => {
      render(
        <Container size="full" className="px-0 sm:px-0 lg:px-0" data-testid="container">
          Content
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("max-w-full");
    });
  });

  // ============================================
  // 6. Centering
  // ============================================
  describe("Centering", () => {
    it("applies mx-auto for horizontal centering on all sizes", () => {
      const { rerender } = render(
        <Container size="default" className="" data-testid="container">
          Content
        </Container>,
      );
      expect(screen.getByTestId("container")).toHaveClass("mx-auto");

      rerender(
        <Container size="narrow" className="" data-testid="container">
          Content
        </Container>,
      );
      expect(screen.getByTestId("container")).toHaveClass("mx-auto");

      rerender(
        <Container size="full" className="" data-testid="container">
          Content
        </Container>,
      );
      expect(screen.getByTestId("container")).toHaveClass("mx-auto");
    });

    it("applies w-full on all sizes", () => {
      const { rerender } = render(
        <Container size="default" className="" data-testid="container">
          Content
        </Container>,
      );
      expect(screen.getByTestId("container")).toHaveClass("w-full");

      rerender(
        <Container size="narrow" className="" data-testid="container">
          Content
        </Container>,
      );
      expect(screen.getByTestId("container")).toHaveClass("w-full");

      rerender(
        <Container size="full" className="" data-testid="container">
          Content
        </Container>,
      );
      expect(screen.getByTestId("container")).toHaveClass("w-full");
    });
  });

  // ============================================
  // 7. Nested Containers
  // ============================================
  describe("Nested Containers", () => {
    it("renders nested containers without conflict", () => {
      render(
        <Container size="full" className="" data-testid="outer">
          <Container size="narrow" className="" data-testid="inner">
            Nested content
          </Container>
        </Container>,
      );
      const outer = screen.getByTestId("outer");
      const inner = screen.getByTestId("inner");

      expect(outer).toHaveClass("max-w-full");
      expect(inner).toHaveClass("max-w-3xl");
      expect(screen.getByText("Nested content")).toBeInTheDocument();
    });

    it("nested containers maintain their individual size classes", () => {
      render(
        <Container size="default" className="" data-testid="parent">
          <Container size="narrow" className="" data-testid="child">
            Inner
          </Container>
        </Container>,
      );
      const parent = screen.getByTestId("parent");
      const child = screen.getByTestId("child");

      expect(parent).toHaveClass("max-w-10xl");
      expect(parent).not.toHaveClass("max-w-3xl");

      expect(child).toHaveClass("max-w-3xl");
      expect(child).not.toHaveClass("max-w-10xl");
    });
  });

  // ============================================
  // 8. Edge Cases
  // ============================================
  describe("Edge Cases", () => {
    it("renders with string children", () => {
      render(<Container className="">Just a string</Container>);
      expect(screen.getByText("Just a string")).toBeInTheDocument();
    });

    it("renders with number children", () => {
      render(<Container className="">{42}</Container>);
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("renders with deeply nested children", () => {
      render(
        <Container className="">
          <div>
            <div>
              <div>
                <span data-testid="deep-child">Deep content</span>
              </div>
            </div>
          </div>
        </Container>,
      );
      expect(screen.getByTestId("deep-child")).toBeInTheDocument();
    });

    it("renders with multiple children elements", () => {
      render(
        <Container className="" data-testid="container">
          <div data-testid="child-1">First</div>
          <div data-testid="child-2">Second</div>
          <div data-testid="child-3">Third</div>
        </Container>,
      );
      const container = screen.getByTestId("container");
      expect(container.children).toHaveLength(3);
    });

    it("renders with fragment children", () => {
      render(
        <Container className="">
          <>
            <span>Fragment child 1</span>
            <span>Fragment child 2</span>
          </>
        </Container>,
      );
      expect(screen.getByText("Fragment child 1")).toBeInTheDocument();
      expect(screen.getByText("Fragment child 2")).toBeInTheDocument();
    });
  });
});
