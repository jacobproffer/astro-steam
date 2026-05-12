import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke test configuration - reuses an existing dev server or starts one if needed
 * This is used for git hooks to quickly catch critical accessibility issues
 */
export default defineConfig({
  testDir: "./tests",

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* No retries for smoke tests - we want fast feedback */
  retries: 0,

  /* Use fewer workers for faster startup */
  workers: 1,

  /* Reporter to use. */
  reporter: "list",

  /* Shared settings */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:4321",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Start dev server only if not already running */
  webServer: {
    command: "astro dev --config astro.config.dev.mjs --port 4321 --host",
    url: "http://localhost:4321",
    reuseExistingServer: true, // Always reuse if available
    timeout: 120000, // 2 minutes to allow for cold starts
  },
});
