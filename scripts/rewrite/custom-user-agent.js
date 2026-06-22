// custom-user-agent.js
// Override the User-Agent header — handy for testing how a site responds to
// different devices/browsers, or forcing a desktop/mobile layout.
//
// URL pattern: https://example.com/*

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/123.0 Safari/537.36';

async function onRequest(context, request) {
  request.headers = request.headers || {};
  request.headers['User-Agent'] = USER_AGENT;
  return request;
}
