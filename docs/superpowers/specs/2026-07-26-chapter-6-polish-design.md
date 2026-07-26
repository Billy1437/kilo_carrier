# Chapter 6 Polish Design

## Goal

Finish the remaining Chapter 6 requirements without redesigning KiloCarrier or
expanding its feature set.

## Scope

1. Replace the landing-page claim that Telegram contacts are verified with
   accurate language stating that a Telegram contact is required.
2. Capture the deployed landing page at 1280×800.
3. Capture the deployed browse page at 390×844.
4. Store both PNG files in `screenshots/`.
5. Update the README to show the new captures and state their viewport sizes.

## Constraints

- Preserve the existing visual system, layout, routes, and application behavior.
- Do not modify or close GitHub issues.
- Do not add features, dependencies, analytics providers, or deployment
  infrastructure.
- Keep all existing screenshots unless removing one becomes necessary to keep
  the README accurate.

## Verification

- Run lint and a production build.
- Inspect the deployed site with Chrome DevTools at both required viewport
  sizes and confirm there are no console errors.
- Run a Playwright click-through covering landing, browse, route filtering,
  protected post navigation, and login.
- Confirm the new PNG dimensions with a local file-inspection command.
- Confirm Vercel Analytics still loads successfully on the deployed site.
