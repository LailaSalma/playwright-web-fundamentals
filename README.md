# playwright-web-fundamentals

Web UI tests with Playwright and TypeScript: a practice repo that ends in a small end-to-end suite against a demo shop.

This repo is the first stage of a learning plan toward a QA automation engineer role. It covers Playwright itself (runner, locators, waiting, debugging). Framework design (page objects, custom fixtures, stored login, environment config) and CI come next, in a separate repository.

## Status

| Stage | State |
|---|---|
| Phase 1: Playwright fundamentals | Done (Nov 2026) |
| Phase 1 deliverable: SauceDemo suite | Done: 10 tests, green on Chromium, Firefox and WebKit |
| Phase 2: web framework (page objects, fixtures, auth state, API data setup) | Next, in its own repo |
| Phase 3-4: reliability, reporting, CI/CD, Docker | Planned, in the framework repo |
| Phase 5: mobile with Appium + TypeScript | Planned, in its own repo |

This repo has no CI pipeline; CI will run in the framework repo.

## The deliverable suite

`tests/phase1-deliverables-saucedemo/` tests [SauceDemo](https://www.saucedemo.com), a public demo shop built for automation practice.

| File | Test | Tag |
|---|---|---|
| `SauceDemo-Login.spec.ts` | Valid login lands on the products page | `@smoke` |
| | Wrong password shows the error message | `@regression` |
| | Empty username shows "Username is required" | `@regression` |
| | Opening `/inventory.html` without logging in is refused | `@regression` |
| `SauceDemo-Shop.spec.ts` | Add two products, remove one: badge and button states | `@smoke` |
| | Sort by price, low to high: full price order checked | `@regression` |
| | The cart lists exactly the added products | `@smoke` |
| | Full checkout: each page change, item list, item total, confirmation | `@smoke` |
| | Checkout with an empty first name shows the error | `@regression` |
| | Logout returns to the login page and ends the session | `@smoke` |

Rules the suite follows:

- No hard waits (`waitForTimeout`), no `force: true`, no one-shot checks. Every check is a web-first assertion that retries.
- Locators in priority order: role, label, placeholder, text, then test id where an element has no usable role or name. No XPath.
- Every final assertion fails if the feature is broken. Where the expected state could already be true before the action, the test asserts a precondition first (for example, the default price order before sorting).
- Tests are independent. Each one gets a fresh browser context, so the cart starts empty, and the suite runs in parallel.

The SauceDemo usernames and password in the tests are the public demo accounts printed on the site's login page.

### A real failure, found with the trace

Running the sort test as SauceDemo's `problem_user` fails. The report shows the prices after sorting in exactly the default A-to-Z order, so the sort had no effect. In the trace, `selectOption` succeeded, but the After snapshot shows the dropdown back on "Name (A to Z)". The same test passes for `standard_user` on all three browsers, which rules out the test code. The bug is in the app, for that user, and the test stays as it is.

## Learning examples

The other files in `tests/` are worked examples (`*-demo.spec.ts`) and exercises (`*-exercise.spec.ts`), one pair per topic. Most run against [the-internet](https://the-internet.herokuapp.com) and [TodoMVC](https://demo.playwright.dev/todomvc/).

| Topic | Files |
|---|---|
| Runner anatomy: hooks, tags, annotations, timeouts | `hooks-demo`, `tags-demo`, `timeout-exercise`, `example` |
| Locators: priority, laziness, strictness | `locators-demo`, `login-locators` |
| Chaining and filtering | `chaining-demo`, `chaining-exercise` |
| Auto-waiting, web-first vs one-shot assertions | `auto-waiting-demo`, `auto-waiting-exercise` |
| Frames | `frames-demo`, `frames-exercise` |
| New tabs and popups | `popups-demo`, `popups-exercise` |
| Dialogs (`alert`, `confirm`, `prompt`) | `dialogs-demo`, `dialogs-exercise` |
| File upload and download | `files-demo`, `download-explained`, `files-exercise` |
| Shadow DOM (open vs closed roots) | `shadow-demo`, `shadow-exercise` |

Test data for uploads and the local shadow DOM pages is in `tests/fixtures/`.

## Tech stack

- Playwright Test (`@playwright/test` 1.65) as runner, browser driver and assertion library
- TypeScript
- Node.js 22, 24 or 26
- Developed on Ubuntu Linux

## Getting started

```bash
git clone https://github.com/LailaSalma/playwright-web-fundamentals.git
cd playwright-web-fundamentals
npm ci
npx playwright install --with-deps
```

Run the deliverable suite on all three browsers:

```bash
npx playwright test tests/phase1-deliverables-saucedemo
```

Expected: `30 passed` (10 tests × 3 browsers).

More ways to run it:

```bash
# Only the smoke tests
npx playwright test --grep @smoke

# One browser
npx playwright test --project=chromium

# With a trace for every test, then open the report
npx playwright test tests/phase1-deliverables-saucedemo --trace on
npx playwright show-report
```

Four learning examples demonstrate `test.fail()`: they fail on purpose (one clicks a locator that matches two elements), so the runner reports them as passed. A fifth demonstrates `test.fixme` and is skipped.

## Configuration

Main settings in `playwright.config.ts`:

| Setting | Value | Why |
|---|---|---|
| `projects` | Chromium, Firefox, WebKit | Every test runs in all three engines |
| `actionTimeout` | 10 s | An action that cannot happen fails fast, with a log that names the failing check |
| `retries` | 2 on CI, 0 locally | Locally a failure shows at once; on CI a retry records evidence |
| `trace`, `video` | `on-first-retry` | Full evidence on a retry, no cost on a green run |
| `screenshot` | `only-on-failure` | A quick look at the page in the HTML report |
| `reporter` | `list` + `html` locally; `dot` + `html` + `junit` on CI | Readable locally, machine-readable on CI |

The SauceDemo files set `baseURL` and `testIdAttribute: 'data-test'` with `test.use()` for that file only, because the earlier examples rely on the default `data-testid`.