// block-ad-hosts.js
// Blocks requests to common in-app ad / analytics / tracker hosts so they
// never leave your device. Lighter battery + data, fewer ads.
//
// URL pattern to match in the proxy: *  (run on everything, then filter here)
// Tip: you can also add these hosts to the proxy's "Block" rule list directly.

const AD_HOSTS = [
  'doubleclick.net',
  'googlesyndication.com',
  'googleadservices.com',
  'google-analytics.com',
  'app-measurement.com',
  'adservice.google.com',
  'graph.facebook.com/.*\\/activities',
  'ads.tiktok.com',
  'analytics.tiktok.com',
  'unityads.unity3d.com',
  'applovin.com',
  'adcolony.com',
  'mopub.com',
  'amplitude.com',
  'mixpanel.com',
  'sentry.io',
];

async function onRequest(context, request) {
  const url = request.url || '';
  for (const host of AD_HOSTS) {
    if (new RegExp(host).test(url)) {
      console.log('[adblock] blocked ' + url);
      return null; // returning null drops the request
    }
  }
  return request;
}
