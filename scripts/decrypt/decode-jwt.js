// decode-jwt.js
// Finds a Bearer JWT in the Authorization header and logs its decoded header +
// payload (NOT the signature) so you can see claims/expiry while debugging.
// Read-only: it never modifies the token.
//
// URL pattern: https://your-api.example.com/*

function b64urlDecode(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  // atob may not exist in all engines; fall back to manual decode.
  try { return decodeURIComponent(escape(atob(s))); } catch (e) { return atob(s); }
}

async function onRequest(context, request) {
  const h = request.headers || {};
  const auth = h['Authorization'] || h['authorization'] || '';
  const m = auth.match(/Bearer\s+([\w-]+)\.([\w-]+)\.([\w-]+)/);
  if (m) {
    try {
      const header = JSON.parse(b64urlDecode(m[1]));
      const payload = JSON.parse(b64urlDecode(m[2]));
      console.log('[jwt] header ' + JSON.stringify(header));
      console.log('[jwt] payload ' + JSON.stringify(payload));
      if (payload.exp) {
        console.log('[jwt] expires ' + new Date(payload.exp * 1000).toISOString());
      }
    } catch (e) {
      console.log('[jwt] could not decode token');
    }
  }
  return request;
}
