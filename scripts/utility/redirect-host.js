// redirect-host.js
// Point requests for one host at another — e.g. send a production app's API
// calls to your local dev server (http://localhost:3000) while you build.
//
// URL pattern: https://api.production.example.com/*

const FROM = 'https://api.production.example.com';
const TO = 'http://localhost:3000';

async function onRequest(context, request) {
  if (request.url && request.url.startsWith(FROM)) {
    request.url = TO + request.url.slice(FROM.length);
    console.log('[redirect] -> ' + request.url);
  }
  return request;
}
