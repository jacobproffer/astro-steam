import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Steam Component Accessibility", () => {
  test("user avatar should have proper alt text", async ({ page }) => {
    await page.goto("/");

    // Check if avatar image has alt text
    const avatar = page.locator("img[alt]").first();
    await expect(avatar).toBeVisible();
    const altText = await avatar.getAttribute("alt");
    expect(altText).toBeTruthy();
    expect(altText?.length).toBeGreaterThan(0);
  });

  test("status indicators should be accessible", async ({ page }) => {
    await page.goto("/");

    // Check for ARIA labels or semantic HTML on status elements
    const statusElement = page.locator('[id*="status"]').first();
    if ((await statusElement.count()) > 0) {
      await expect(statusElement).toBeVisible();
    }

    // Run axe scan focusing on status-related elements
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[id*="status"]')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("game list should be keyboard navigable", async ({ page }) => {
    await page.goto("/");

    // Check if interactive elements are focusable
    const links = page.locator("a[href]");
    const linkCount = await links.count();

    if (linkCount > 0) {
      // Tab through and verify focus is visible
      await page.keyboard.press("Tab");
      const focusedElement = await page.evaluate(
        () => document.activeElement?.tagName,
      );
      expect(focusedElement).toBeTruthy();
    }
  });

  test("color contrast should meet WCAG standards", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["color-contrast"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("all interactive elements should have accessible names", async ({
    page,
  }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["button-name", "link-name"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("heading hierarchy should be logical", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["heading-order"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("page should have proper document structure", async ({ page }) => {
    await page.goto("/");

    // Check for main landmark
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Check for proper heading structure
    const h1 = page.locator("main h1");
    await expect(h1).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["landmark"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
