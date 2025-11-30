// API integration removed: provide harmless stubs to avoid import errors
console.warn("services/mfninjas: API integration removed — using local fallbacks.");

export async function fetchNav() {
  // No-op: external API removed. Return null to indicate no live data.
  return null;
}

export async function fetchNavBulk() {
  return [];
}

export async function searchFunds() {
  return [];
}

export async function getFundHoldings() {
  return [];
}

export function clearCache() {
  // nothing to clear
}

export default {
  fetchNav,
  fetchNavBulk,
  searchFunds,
  getFundHoldings,
  clearCache,
};