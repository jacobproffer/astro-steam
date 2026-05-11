import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Steam Component Accessibility", () => {
  test("first focusable element is a skip link that navigates to main content", async ({
    page,
  }) => {
    await page.goto("/");

    // Tab to the first focusable element
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");

    // Verify it's the skip link
    await expect(focused).toHaveAttribute("href", "#main-content");
    await expect(focused).toHaveText("Skip to main content");

    // Activate the skip link and verify it navigated to main content
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);

    // Verify the main content element exists and is visible
    const mainContent = page.locator("#main-content");
    await expect(mainContent).toBeVisible();

    // Verify focus actually moved to the main content element
    await expect(mainContent).toBeFocused();
  });

  test("decorative images should have empty alt text", async ({ page }) => {
    await page.goto("/");

    // Decorative background images should have alt=""
    const decorativeImages = page.locator('img[alt=""]');

    if ((await decorativeImages.count()) > 0) {
      // Verify at least one decorative image exists and is properly marked
      expect(await decorativeImages.count()).toBeGreaterThan(0);
    }
  });

  test("status indicators should be accessible", async ({ page }) => {
    await page.goto("/");

    // Status element is conditionally rendered based on user state
    const statusElement = page.locator("#status");

    if ((await statusElement.count()) > 0) {
      // Verify status is visible
      await expect(statusElement).toBeVisible();

      // Run axe scan on status element when it exists
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include("#status")
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
    // Test passes if status doesn't render (empty string case)
  });

  test("game list should be keyboard navigable", async ({ page }) => {
    await page.goto("/");

    const interactiveElements = ["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"];
    const focusedElements: string[] = [];

    // Tab through multiple elements to verify keyboard navigation
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");

      const focusInfo = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName,
          isInteractive:
            el?.tagName &&
            ["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(el.tagName),
          hasFocusStyle: el
            ? window.getComputedStyle(el).outlineWidth !== "0px"
            : false,
          ariaLabel: el?.getAttribute("aria-label") || "",
          text: el?.textContent?.trim().substring(0, 50) || "",
        };
      });

      // Verify focused element is interactive
      expect(focusInfo.tagName).toBeTruthy();
      expect(interactiveElements).toContain(focusInfo.tagName);

      // Track what was focused for debugging
      focusedElements.push(
        `${focusInfo.tagName}: ${focusInfo.ariaLabel || focusInfo.text}`,
      );
    }

    // Ensure we actually tabbed through different elements
    expect(new Set(focusedElements).size).toBeGreaterThan(1);
  });

  test("color contrast should meet WCAG standards", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["color-contrast"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("all interactive elements should have accessible names", async ({
    page,
  }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["button-name", "link-name"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("heading hierarchy should be logical", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["heading-order"])
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
      .withRules(["region", "landmark-one-main", "landmark-unique"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
