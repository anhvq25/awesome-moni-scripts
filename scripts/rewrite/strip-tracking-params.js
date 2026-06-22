// strip-tracking-params.js
// Removes common tracking query params (utm_*, fbclid, gclid…) from outgoing
// requests for cleaner URLs and less cross-site tracking.
//
// URL pattern: * (run everywhere)

const STRIP = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'gclsrc', 'dclid', 'msclkid', 'mc_eid', 'igshid',
  'ref', 'ref_src',
];

async function onRequest(context, request) {
  try {
    const u = new URL(request.url);
    let changed = false;
    for (const p of STRIP) {
      if (u.searchParams.has(p)) {
        u.searchParams.delete(p);
        changed = true;
      }
    }
    if (changed) {
      request.url = u.toString();
      console.log('[rewrite] cleaned ' + request.url);
    }
  } catch (e) {
    // non-URL request, ignore
  }
  return request;
}
