// hostsvn-remote-blocklist.js
// Auto-updating ad-block using the live community hostsVN domain list
// (https://github.com/bigdargon/hostsVN). On the first request it fetches the
// full Vietnam-focused blocklist, caches it in session state, then blocks any
// request whose host appears in the list. No manual domain maintenance.
//
// URL pattern: *  (runs on everything, then filters here by host)
//
// Pick a feed:
//   domain-VN.txt  -> Vietnam ad/tracker domains only (lighter)
//   domain.txt     -> full hostsVN list (VN + global, heavier)
const BLOCKLIST_URL =
  'https://raw.githubusercontent.com/bigdargon/hostsVN/master/option/domain-VN.txt';

// Re-fetch the list at most once per this many ms (default: 12h).
const TTL_MS = 12 * 60 * 60 * 1000;

function hostOf(url) {
  const m = /^[a-z]+:\/\/([^/:?#]+)/i.exec(url || '');
  return m ? m[1].toLowerCase() : '';
}

function parseDomains(text) {
  // The file is one domain per line; ignore comments and blanks.
  const set = new Set();
  for (let line of text.split('\n')) {
    line = line.trim();
    if (!line || line[0] === '#') continue;
    set.add(line.toLowerCase());
  }
  return set;
}

async function getBlockSet(context) {
  const state = context.session;
  const now = Date.now();
  if (state.vnBlockSet && now - state.vnFetchedAt < TTL_MS) {
    return state.vnBlockSet;
  }
  try {
    const res = await fetch(BLOCKLIST_URL);
    const text = await res.text();
    state.vnBlockSet = parseDomains(text);
    state.vnFetchedAt = now;
    console.log('[hostsVN] loaded ' + state.vnBlockSet.size + ' domains');
  } catch (e) {
    console.log('[hostsVN] fetch failed, using previous list: ' + e);
    state.vnBlockSet = state.vnBlockSet || new Set();
  }
  return state.vnBlockSet;
}

function isBlocked(host, set) {
  // Match the host or any parent domain (sub.ads.example.com -> ads.example.com).
  let h = host;
  while (h.includes('.')) {
    if (set.has(h)) return true;
    h = h.slice(h.indexOf('.') + 1);
  }
  return false;
}

async function onRequest(context, request) {
  const host = hostOf(request.url);
  if (!host) return request;
  const set = await getBlockSet(context);
  if (isBlocked(host, set)) {
    console.log('[hostsVN] blocked ' + host);
    return null;
  }
  return request;
}
