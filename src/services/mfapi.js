// MF API integration removed.
// To avoid runtime import errors for any remaining references, this module exports
// no-op functions that return empty values. This keeps the codebase stable
// without making external network requests.

export async function fetchAllSchemes() { return []; }
export async function searchSchemes(_q) { return []; }
export async function fetchLatestNav(_schemeCode) { return null; }
export async function fetchLatestNavsBulk(_schemeCodes) { return []; }
export function navFromLatestResponse(_resp) { return null; }

export default {
  fetchAllSchemes,
  searchSchemes,
  fetchLatestNav,
  fetchLatestNavsBulk,
  navFromLatestResponse
};
