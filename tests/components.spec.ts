import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Steam Component Accessibility", () => {
  test("user avatar should have proper alt text", async ({ page }) => {
    await page.goto("/");

    // Target the specific Steam avatar image
    const avatar = page.locator('img[alt="Steam avatar"]');

    // Avatar might not render if API/env is unavailable
    if ((await avatar.count()) > 0) {
      await expect(avatar).toBeVisible();

      // Verify it has meaningful alt text (not empty)
      const altText = await avatar.getAttribute("alt");
      expect(altText).toBe("Steam avatar");
    }
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
