// demo-mock-full-response.js
// ───────────────────────────────────────────────────────────────────────────
// DEMO / LEARNING SCRIPT — teaches how to RETURN A FULL FAKE RESPONSE without
// the request ever reaching a server. Useful when you're building a UI against
// YOUR OWN backend that doesn't exist yet, or you want a deterministic body to
// test against. You set statusCode + headers + body yourself.
//
// This replaces the response for a make-believe endpoint of your own app with
// canned data. Use it to mock YOUR api while building — NOT to fake data from
// services you don't own.
//
// URL pattern: point it at YOUR endpoint, e.g.
//   https://api.myapp.example.com/v1/profile
// ───────────────────────────────────────────────────────────────────────────

async function onResponse(context, request, response) {
  // Only mock the specific endpoint we care about; let everything else pass.
  if (!/\/v1\/profile\b/.test(request.url || "")) return response;

  // TECHNIQUE: build the whole response yourself.
  //   statusCode -> the HTTP status the app will see
  //   headers    -> at minimum set content-type so the app parses it right
  //   body       -> a STRING (stringify your object)
  const mock = {
    user: {
      id: "demo-123",
      name: "Demo User",
      tier: "pro",          // keyX -> example value
      features: {
        newDashboard: true, // keyY -> example value
      },
    },
  };

  response.statusCode = 200;
  response.headers = { "content-type": "application/json" };
  response.body = JSON.stringify(mock);

  console.log("[demo] mocked " + request.url);
  return response;
}
