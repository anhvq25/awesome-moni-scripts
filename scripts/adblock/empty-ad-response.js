// empty-ad-response.js
// Instead of blocking outright (which some apps retry forever), return an
// EMPTY 200 for ad/tracking endpoints. The app thinks the ad "loaded" and
// moves on — no banner, no spinner.
//
// URL pattern: *://*/*ads* (or target a specific ad endpoint you saw in the log)

async function onResponse(context, request, response) {
  const url = request.url || '';
  if (/\/(ads?|advert|sponsor|promo)\b/i.test(url)) {
    response.statusCode = 200;
    response.headers = { 'content-type': 'application/json' };
    response.body = '{}';
    console.log('[adblock] emptied ' + url);
  }
  return response;
}
