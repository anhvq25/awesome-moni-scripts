// simulate-slow-network.js
// Adds artificial latency to a response so you can test loading states,
// spinners and timeouts in your own app on a "slow 3G"-like delay.
//
// URL pattern: https://your-api.example.com/*

const DELAY_MS = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function onResponse(context, request, response) {
  await sleep(DELAY_MS);
  console.log('[net] delayed ' + DELAY_MS + 'ms for ' + request.url);
  return response;
}
