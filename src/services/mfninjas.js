// simple client-side wrapper for API Ninjas mutual fund endpoint
// WARNING: client-side keys (VITE_...) are visible in the built bundle.
const BASE = import.meta.env.VITE_MF_API_BASE || 'https://api.api-ninjas.com/v1';
const API_KEY = import.meta.env.VITE_API_NINJAS_KEY || import.meta.env.VITE_MF_API_KEY;
const CACHE_TTL = 1000 * 60 * 3; // 3 minutes

function _cacheKey(id) { return `mfninjas_${id}`; }
function _now() { return Date.now(); }

async function _fetchJson(url, opts = {}) {
  if (!API_KEY) throw new Error('No API key set. Set VITE_API_NINJAS_KEY or VITE_MF_API_KEY in .env.local');
  const headers = Object.assign({}, opts.headers || {}, {
    'X-Api-Key': API_KEY,
    'Accept': 'application/json'
  });
  const res = await fetch(url, Object.assign({}, opts, { headers }));
  if (!res.ok) {
    const txt = await res.text().catch(() => null);
    const err = new Error(`API error ${res.status}: ${txt || res.statusText}`);
    err.status = res.status;
    err.raw = txt;
    throw err;
  }
  return res.json();
}

export async function fetchNav(schemeId) {
  if (!schemeId) throw new Error('schemeId required');
  const key = _cacheKey(schemeId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (_now() - (parsed.ts || 0) < (parsed.ttl || CACHE_TTL)) return parsed.data;
    }
  } catch (e) {
    // ignore cache errors
  }

  const url = `${BASE}/mutualfund?scheme=${encodeURIComponent(schemeId)}`;
  const data = await _fetchJson(url);

  try {
    localStorage.setItem(key, JSON.stringify({ ts: _now(), ttl: CACHE_TTL, data }));
  } catch (e) {
    // ignore
  }
  return data;
}

export async function fetchNavBulk(schemeIds = []) {
  const promises = schemeIds.map(id => fetchNav(id).catch(err => ({ error: String(err) })));
  return Promise.all(promises);
}

export default { fetchNav, fetchNavBulk };
