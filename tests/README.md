# Playwright Accessibility Testing

This project uses Playwright with axe-core for automated accessibility testing.

## Running Tests

```bash
# Run all tests in headless mode
npm test

# Run quick smoke test (critical accessibility checks only)
npm run test:smoke

# Run tests with UI mode (recommended for development)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# View test report after running tests
npm run test:report
```

## Git Hooks

This project uses Husky to run automated checks:

- **pre-push**: Runs smoke tests automatically before each push to catch critical accessibility issues
- The smoke test will start the dev server if it's not running, or reuse an existing one
- Takes ~30-60 seconds if server is already running, or up to 2 minutes on first push
- To bypass the hook if needed: `git push --no-verify`
- **Recommendation**: Run full test suite (`npm test`) before major commits or PRs
- **Pro tip**: Keep `npm run dev` running in a terminal to make smoke tests faster

## Test Files

- `tests/smoke.spec.ts` - Fast smoke tests for git hooks (critical WCAG checks)
- `tests/accessibility.spec.ts` - General accessibility tests for the homepage
- `tests/components.spec.ts` - Component-specific accessibility tests

## What's Being Tested

### WCAG Compliance

- WCAG 2.1 Level A compliance
- WCAG 2.1 Level AA compliance
- Color contrast ratios
- Proper heading hierarchy

### Component Accessibility

- Skip link is the first focusable element and navigates to main content
- Avatar images have descriptive alt text
- Informative images have descriptive alt text; decorative images use empty alt text
- Status indicators are accessible to screen readers
- Keyboard navigation works for all interactive elements
- All buttons and links have accessible names
- Proper document structure with semantic HTML landmarks
- Anchor links maintain proper contrast when hovered
- Anchor links maintain proper contrast when focused

## Writing New Tests

To add new accessibility tests:

1. Create a new test file in the `tests/` directory
2. Import the necessary tools:

```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
```

3. Run axe scans on your pages:

```typescript
test("my component is accessible", async ({ page }) => {
  await page.goto("/my-route");

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

## Resources

- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
