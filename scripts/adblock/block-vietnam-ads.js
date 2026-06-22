// block-vietnam-ads.js
// Blocks Vietnamese in-app ad / tracking / analytics domains that the global
// ad-block lists usually miss. Domains are curated from the community
// hostsVN project (https://github.com/bigdargon/hostsVN) — the most popular
// Vietnam-focused blocklist — so apps like local news, video & shopping apps
// stop phoning home to VN ad networks (adtima/Zalo, eclick/FPT, admicro, etc).
//
// URL pattern: *  (runs on everything, then filters here by host)
// Tip: this list works fully offline. Want it to auto-update from the live
//      hostsVN feed instead? Use hostsvn-remote-blocklist.js.

// Suffix match: blocks the domain itself and any subdomain of it.
const VN_AD_DOMAINS = [
  // Adtima / Zalo (VNG) ad network
  'adtimaserver.vn',
  'adtima.vn',
  // eClick (FPT) ad network
  'eclick.vn',
  // Admicro / VCCorp ad network
  'admicro.vn',
  'admicro1.vcmedia.vn',
  'admicro2.vcmedia.vn',
  'g.vcmms.vn',
  'adi.admicro.vn',
  'media1.admicro.vn',
  // AdFlex / AdsMedia / other VN networks
  'adflex.vn',
  'adsmedia.vn',
  'mecloud.vn',
  'mms.adlinking.vn',
  // Analytics / tracking commonly bundled in VN apps
  'analytics.vcmms.vn',
  'logging.adtimaserver.vn',
  'apptracking.vn',
];

function hostOf(url) {
  // Pull the hostname out of a URL without needing the URL API.
  const m = /^[a-z]+:\/\/([^/:?#]+)/i.exec(url || '');
  return m ? m[1].toLowerCase() : '';
}

function isBlocked(host) {
  for (const d of VN_AD_DOMAINS) {
    if (host === d || host.endsWith('.' + d)) return true;
  }
  return false;
}

async function onRequest(context, request) {
  const host = hostOf(request.url);
  if (host && isBlocked(host)) {
    console.log('[vn-adblock] blocked ' + host);
    return null; // returning null drops the request
  }
  return request;
}
