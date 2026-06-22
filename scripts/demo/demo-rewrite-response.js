// demo-rewrite-response.js
// ───────────────────────────────────────────────────────────────────────────
// DEMO / LEARNING SCRIPT — teaches the two most common interceptor techniques:
//   1) onRequest:  strip cache-validation headers so the server always returns
//                  the FULL body (no "304 Not Modified") while you're debugging.
//   2) onResponse: parse a JSON body, edit a nested field, re-stringify it.
//
// It edits a HARMLESS field on a make-believe API of your OWN app
// (a feature flag / a `isPremium` UI boolean) purely to show *how* the rewrite
// works. Use it on your own backend to test UI states before the server is
// ready — NOT to forge entitlements of apps you don't own.
//
// URL pattern: point it at YOUR api, e.g. https://api.myapp.example.com/*
// ───────────────────────────────────────────────────────────────────────────

// ── 1) REQUEST: force a fresh response ──────────────────────────────────────
// Caches use ETag + If-None-Match (and Last-Modified + If-Modified-Since) to let
// the server reply "304, nothing changed" with an empty body. While debugging a
// response rewrite that's annoying — you want the real body every time. Deleting
// these headers makes the server send the full 200 body so onResponse has JSON
// to work with. Header names are case-sensitive in the map, so we clear both.
async function onRequest(context, request) {
  delete request.headers["if-none-match"];
  delete request.headers["If-None-Match"];
  delete request.headers["if-modified-since"];
  delete request.headers["If-Modified-Since"];
  return request;
}

// ── 2) RESPONSE: parse → edit nested field → re-stringify ────────────────────
async function onResponse(context, request, response) {
  // Only touch JSON bodies. Servers vary on header casing, so check both.
  const ctype =
    response.headers["content-type"] || response.headers["Content-Type"] || "";
  if (!/json/i.test(ctype)) return response;

  try {
    // response.body is a STRING — parse it into an object to edit.
    const obj = JSON.parse(response.body);

    // TECHNIQUE: create nested objects safely before assigning into them,
    // so the script doesn't crash if `user` / `features` are missing.
    obj.user = obj.user || {};
    obj.user.features = obj.user.features || {};

    // DEMO EDIT — flip some demo fields to show the rewrite taking effect.
    // (On your own app this is how you'd preview a "premium" UI state, turn on
    //  an unreleased feature flag, or test a tier badge before the API ships.)
    obj.user.isPremium = true;
    obj.user.tier = "pro";                 // keyX -> example value
    obj.user.features.newDashboard = true; // keyY -> example value

    // IMPORTANT: re-stringify — response.body must be a string again.
    response.body = JSON.stringify(obj);
    console.log("[demo] rewrote response for " + request.url);
    return response;
  } catch (e) {
    // If the body wasn't valid JSON, log and pass it through unchanged.
    console.log("[demo] not JSON / parse failed: " + e);
    return response;
  }
}
