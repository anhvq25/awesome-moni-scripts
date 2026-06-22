// simulate-error.js
// Force an endpoint to return an error so you can test how your app handles
// 500s / 429s / timeouts without breaking the real server.
//
// URL pattern: https://your-api.example.com/*

async function onResponse(context, request, response) {
  // Pick the failure you want to test:
  response.statusCode = 503; // try 429 (rate limit), 401 (auth), 500…
  response.headers = { 'content-type': 'application/json', 'retry-after': '5' };
  response.body = JSON.stringify({ error: 'service_unavailable', simulated: true });
  console.log('[mock] simulated ' + response.statusCode + ' for ' + request.url);
  return response;
}
