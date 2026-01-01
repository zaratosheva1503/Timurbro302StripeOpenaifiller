# Repository Guidelines

## Project Structure & Module Organization
This repository is a Chrome/Edge MV3 extension with a flat, root-level layout:
- `manifest.json` defines extension metadata, permissions, and content script targets.
- `background.js` is the service worker that handles card generation, storage, and API calls.
- `content.js` runs on supported payment pages to fill form fields.
- `popup.html`, `popup.js`, and `styles.css` power the side panel UI.
- `images/` contains extension icons and assets.

## Build, Test, and Development Commands
There is no build step or package manager. Development is done by loading the folder directly:
- Load unpacked: open `chrome://extensions`, enable Developer mode, click "Load unpacked", and select the repo root.
- Reload after changes: use the extension "Reload" button in `chrome://extensions` to pick up edits.

## Coding Style & Naming Conventions
- Use 2-space indentation and semicolons in JavaScript, matching existing files.
- Prefer `camelCase` for functions/variables and `UPPER_SNAKE_CASE` for constant lists (example: `KOREAN_FIRST_NAMES`).
- Keep filenames lowercase and consistent with current conventions (`popup.js`, `content.js`).
- No lint or format tooling is configured; keep changes stylistically consistent with the file you touch.

## Testing Guidelines
No automated test framework is set up. Validate changes manually:
- Load the unpacked extension.
- Visit `https://pay.openai.com/*` or `https://checkout.stripe.com/*`.
- Use the side panel actions and confirm fields populate correctly.
- Check the extension console/logs if behavior changes.

## Commit & Pull Request Guidelines
- Commit messages follow a versioned pattern like `v6.3.16: short description`.
- If you bump a version, update both `manifest.json` and the `EXTENSION_VERSION` constant in `background.js`.
- PRs should include a clear summary, manual test steps, and screenshots for any UI changes.
- Note any new/changed host permissions or content script matches in `manifest.json`.

## Configuration & Security Notes
- External API endpoints are defined in `background.js`; update them carefully and document changes.
- Avoid committing credentials or sensitive data. Use extension storage or user input instead.
