# ✍️ Writing your own scripts

A complete guide to the interceptor scripting API these snippets use. Every
script is plain JavaScript with two optional hooks — `onRequest` and
`onResponse` — that run on the matching traffic, on your device.

- [The two hooks](#the-two-hooks)
- [The `request` object](#the-request-object)
- [The `response` object](#the-response-object)
- [The `context` object (+ session state)](#the-context-object)
- [Returning a value](#returning-a-value-modify--block)
- [Logging](#logging)
- [Calling other APIs with `fetch`](#calling-other-apis-with-fetch)
- [URL matching](#url-matching)
- [Recipes](#recipes)
- [Gotchas](#gotchas)

---

## The two hooks

```js
// Runs BEFORE the request leaves your device.
async function onRequest(context, request) {
  return request;          // return the (modified) request, or null to BLOCK
}

// Runs AFTER the response arrives, BEFORE your app sees it.
async function onResponse(context, request, response) {
  return response;         // return the (modified) response, or null to BLOCK
}
```

- Define **either or both**. A script with only `onRequest` is fine.
- Both can be `async` and use `await`.
- A rule's **URL pattern** decides which requests a script runs on (see
  [URL matching](#url-matching)).

---

## The `request` object

What you receive in `onRequest(context, request)` / `onResponse(…, request, …)`:

| Field | Type | Notes |
|---|---|---|
| `request.url` | string | Full URL, e.g. `https://api.example.com/v1/items?page=2` |
| `request.host` | string | `api.example.com` |
| `request.path` | string | `/v1/items` |
| `request.queries` | object | Query params as a map: `{ page: "2" }` |
| `request.method` | string | `GET`, `POST`, … |
| `request.headers` | object | Header name → value (string, or array for repeats) |
| `request.body` | string | Decoded text body (for text/JSON requests) |
| `request.rawBody` | number[] | Raw bytes, if you need them |

**You modify a request by mutating these and returning it.** To change the
URL/path/query, edit `request.url` (or `request.path` + `request.queries`).
To change a header, edit `request.headers`.

```js
async function onRequest(context, request) {
  request.headers['X-Debug'] = 'moni';
  request.queries.page = '1';        // or: edit request.url directly
  return request;
}
```

---

## The `response` object

What you receive in `onResponse(context, request, response)`:

| Field | Type | Notes |
|---|---|---|
| `response.statusCode` | number | `200`, `404`, … set it to change the status |
| `response.headers` | object | Header name → value |
| `response.body` | string | Decoded text body (JSON/text). Re-stringify after editing. |
| `response.rawBody` | number[] | Raw bytes, for binary responses |

```js
async function onResponse(context, request, response) {
  const data = JSON.parse(response.body);
  data.injected = true;
  response.body = JSON.stringify(data);   // <- must re-stringify
  response.statusCode = 200;
  return response;
}
```

> The engine drops `Content-Encoding` for you, so you always read/write the
> **decoded** body — no need to gzip/deflate manually.

---

## The `context` object

Second… first argument to both hooks:

| Field | Type | Notes |
|---|---|---|
| `context.scriptName` | string | The rule's name |
| `context.os` | string | `ios`, `android`, `macos` |
| `context.deviceId` | string | Stable per-device id |
| `context.session` | object | **Persistent scratch space** — see below |

### `context.session` — keep state across requests

`context.session` is an object that **persists** between `onRequest` and
`onResponse` of the same request, *and* across multiple requests for the same
script. Use it to pass data forward or count things.

```js
async function onRequest(context, request) {
  context.session.startedAt = Date.now();         // remember for onResponse
  context.session.count = (context.session.count || 0) + 1;
  return request;
}

async function onResponse(context, request, response) {
  const ms = Date.now() - (context.session.startedAt || Date.now());
  console.log(`[timing] #${context.session.count} took ${ms}ms`);
  return response;
}
```

---

## Returning a value (modify / block)

| You return | Effect |
|---|---|
| the `request` / `response` object | Continue with your changes |
| `null` | **Block** — the request is dropped / the response is suppressed |
| nothing (`undefined`) | Treated as "no change" — original is used |

```js
// Block any request to a tracker host:
async function onRequest(context, request) {
  if (request.host.endsWith('tracker.example.com')) return null;
  return request;
}
```

---

## Logging

`console.log(...)` prints to the proxy's **script console** (in Moni Proxy:
the Script page log panel). Prefix with a `[tag]` so you can filter:

```js
console.log('[adblock] blocked ' + request.url);
```

`console.log` accepts multiple args and objects:
```js
console.log('[debug]', request.method, request.url, request.headers);
```

---

## Calling other APIs with `fetch`

You can `await fetch(...)` inside a hook — e.g. to enrich a request from
another endpoint, or build a response from a remote source.

```js
async function onResponse(context, request, response) {
  // Replace the body with content fetched elsewhere.
  const extra = await fetch('https://example.com/data.json').then(r => r.text());
  response.body = extra;
  return response;
}
```

Keep `fetch` calls fast — they run inline and add latency to that request.

---

## URL matching

The script's **URL pattern** (set on the rule, not in code) decides where it
runs. Patterns support `*` wildcards:

| Pattern | Matches |
|---|---|
| `*` | Everything (then filter inside the script) |
| `https://api.example.com/*` | All paths on that host |
| `https://*.example.com/*` | Any subdomain |
| `*://*/*ads*` | Any URL containing `ads` |

For host/path filtering it's often cleaner to match broadly (`*`) and check
`request.host` / `request.url` inside the script with a `RegExp`.

---

## Recipes

**Add a request header**
```js
async function onRequest(context, request) {
  request.headers['Authorization'] = 'Bearer dev-token';
  return request;
}
```

**Mock a JSON response**
```js
async function onResponse(context, request, response) {
  response.statusCode = 200;
  response.headers = { 'content-type': 'application/json' };
  response.body = JSON.stringify({ ok: true, items: [] });
  return response;
}
```

**Redirect a host to localhost (point prod API at your dev server)**
```js
const FROM = 'https://api.prod.example.com', TO = 'http://localhost:3000';
async function onRequest(context, request) {
  if (request.url.startsWith(FROM)) request.url = TO + request.url.slice(FROM.length);
  return request;
}
```

**Conditionally edit only POSTs**
```js
async function onRequest(context, request) {
  if (request.method === 'POST' && request.body) {
    const b = JSON.parse(request.body);
    b.debug = true;
    request.body = JSON.stringify(b);
  }
  return request;
}
```

More full examples live in [`/scripts`](../scripts).

---

## Gotchas

- **Re-stringify bodies.** `request.body` / `response.body` are strings. After
  `JSON.parse` + edit, write back with `JSON.stringify`.
- **`null` blocks.** Returning `null` drops the request/response — don't return
  it by accident (e.g. forgetting the final `return request;`).
- **Header case.** Some servers send `Content-Type`, some `content-type`. Check
  both: `response.headers['content-type'] || response.headers['Content-Type']`.
- **Binary bodies.** For images/protobuf, `body` may be bytes — use
  `request.rawBody` / `response.rawBody` and avoid `JSON.parse`.
- **Keep it fast.** Hooks run inline on real traffic; heavy work (big loops,
  slow `fetch`) adds latency to that request.
- **One job per script.** Smaller scripts are easier to toggle, share and debug.

---

## How to run a script

See the [README](../README.md#%EF%B8%8F-how-to-run-these-scripts). In short:
install an on-device proxy that supports this API (we test against
[Moni Proxy](https://moniproxy.com/)), trust its CA cert, then
**Rules → Script → Add**, paste your code, set the URL pattern, and enable it.
