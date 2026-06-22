// force-feature-flag.js
// Flip a feature flag in the response YOUR OWN client receives, to preview a
// UI variant you're building before the backend rolls it out. This only
// changes what your device renders locally — it does not change the server.
//
// URL pattern: https://your-api.example.com/config

async function onResponse(context, request, response) {
  try {
    const cfg = JSON.parse(response.body);
    // Example: turn on a new UI you're developing.
    cfg.flags = cfg.flags || {};
    cfg.flags.newHomeScreen = true;
    cfg.flags.darkModeBeta = true;
    response.body = JSON.stringify(cfg);
    console.log('[ui] forced local feature flags for ' + request.url);
  } catch (e) {
    // not JSON, leave as-is
  }
  return response;
}
