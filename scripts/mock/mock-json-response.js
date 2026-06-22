// mock-json-response.js
// Return a canned JSON response for an endpoint so you can build/test your
// app's UI before the real backend exists, or simulate edge cases (empty
// list, error state, huge list...).
//
// URL pattern: https://your-api.example.com/v1/items

async function onResponse(context, request, response) {
  // Comment/uncomment a scenario to test different UI states.
  const mock = {
    ok: true,
    items: [
      { id: 1, title: 'Mocked item A', price: 0 },
      { id: 2, title: 'Mocked item B', price: 9.99 },
    ],
  };

  response.statusCode = 200;
  response.headers = { 'content-type': 'application/json' };
  response.body = JSON.stringify(mock);
  console.log('[mock] served canned response for ' + request.url);
  return response;
}
