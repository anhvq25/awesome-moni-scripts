# Contributing

Thanks for helping grow the collection! 🎉

## Adding a script

1. Drop a single `.js` file into the matching folder under `scripts/`
   (`adblock`, `mock`, `rewrite`, `decrypt`, `ui-tweaks`, `utility`).
2. Start the file with a comment block:
   ```js
   // my-script.js
   // One line: what it does.
   // URL pattern: https://example.com/*   <- where to apply it
   ```
3. Use the standard interceptor API:
   ```js
   async function onRequest(context, request) { return request; }
   async function onResponse(context, request, response) { return response; }
   ```
4. Keep it small, commented, and dependency-free.

## Allowed scope

PRs are accepted only for **legitimate** use:
ad-blocking, mocking/testing **your own** app, request rewriting, HTTPS
inspection, and local UI customization on **your own device**.

We will **reject** anything that:
- bypasses paid features / licensing of apps you don't own,
- forges balances, credits, or other third-party data,
- targets or disrupts services without authorization.

## Style

- Plain JavaScript (no build step, no npm).
- Prefer `console.log('[tag] …')` so logs are easy to filter.
- One clear job per script.
