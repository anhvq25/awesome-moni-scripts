// pretty-print-json.js
// Logs every JSON response body, nicely indented, to the proxy console — so
// you can read API payloads while debugging without an external tool.
//
// URL pattern: https://your-api.example.com/*

async function onResponse(context, request, response) {
  const ct = (response.headers && (response.headers['content-type'] ||
              response.headers['Content-Type'])) || '';
  if (ct.includes('json') && response.body) {
    try {
      const obj = JSON.parse(response.body);
      console.log('[inspect] ' + request.url + '\n' + JSON.stringify(obj, null, 2));
    } catch (e) {
      console.log('[inspect] (non-JSON body) ' + request.url);
    }
  }
  return response;
}
