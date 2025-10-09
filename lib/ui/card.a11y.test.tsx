/**
 * Accessibility Tests for Card Component
 *
 * Uses axe-core to test for accessibility violations
 */

import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";

expect.extend(toHaveNoViolations);

describe("Card Accessibility", () => {
  it("should have no accessibility violations - basic card", async () => {
    const { container } = render(
      <Card>
        <CardContent>Basic card content</CardContent>
      </Card>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations - full card", async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description text</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the main content of the card.</p>
        </CardContent>
        <CardFooter>
          <button type="button">Action</button>
        </CardFooter>
      </Card>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have proper heading hierarchy", async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Main Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>
          <h2>Subheading</h2>
          <p>Content under subheading</p>
        </CardContent>
      </Card>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have accessible interactive elements", async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Interactive Card</CardTitle>
        </CardHeader>
        <CardContent>
          <button type="button" aria-label="Close">
            ×
          </button>
        </CardContent>
      </Card>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should be keyboard accessible", async () => {
    const { container } = render(
      <Card tabIndex={0} role="article">
        <CardHeader>
          <CardTitle>Focusable Card</CardTitle>
        </CardHeader>
        <CardContent>Content that can receive focus</CardContent>
      </Card>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
