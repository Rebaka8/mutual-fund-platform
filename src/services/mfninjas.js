/**
 * API Ninjas Mutual Fund API Integration
 * Fetches real mutual fund data including holdings, expense ratios, and AUM
 */

const BASE = import.meta.env.VITE_MF_API_BASE || "https://api.api-ninjas.com/v1";
const API_KEY = import.meta.env.VITE_API_NINJAS_KEY || null;
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes cache

// Mapping of common Indian fund names to US mutual fund tickers for demo purposes
const FUND_TICKER_MAP = {
  "125497": "VFIAX", // SBI Bluechip -> Vanguard 500 Index
  "118297": "FXAIX", // HDFC Equity -> Fidelity 500 Index
  "102885": "VTSAX", // ICICI Prudential -> Vanguard Total Stock Market
  "100208": "VFIAX", // Axis Bluechip -> Vanguard 500 Index
  "120304": "VFIAX", // Mirae Asset Large Cap -> Vanguard 500 Index
  "117717": "FXAIX", // UTI Nifty 50 -> Fidelity 500 Index
  "107647": "VTSAX", // Kotak Standard Multicap -> Vanguard Total Stock
  "105554": "VFIAX", // Aditya Birla Tax Relief -> Vanguard 500 Index
  "120305": "VFIAX", // Franklin India Bluechip -> Vanguard 500 Index
  "118874": "VTSAX", // Mirae Asset Hybrid -> Vanguard Total Stock
  "140006": "VTSMX", // SBI Small Cap -> Vanguard Total Stock Market
};

// Reverse map for ticker to scheme code
const TICKER_TO_SCHEME = Object.fromEntries(
  Object.entries(FUND_TICKER_MAP).map(([k, v]) => [v, k])
);

/**
 * Get cache key for a ticker
 */
function _cacheKey(ticker) {
  return `mfninjas_${ticker}`;
}

/**
 * Check if cached data is still valid
 */
function _isCacheValid(cachedData) {
  if (!cachedData || !cachedData.ts) return false;
  return Date.now() - cachedData.ts < (cachedData.ttl || CACHE_TTL);
}

/**
 * Fetch JSON from API with proper error handling
 */
async function _fetchJson(url, opts = {}) {
  if (!API_KEY) {
    console.warn("⚠️ No API key set. Set VITE_API_NINJAS_KEY in .env.local");
    return null;
  }

  const headers = {
    Accept: "application/json",
    "X-Api-Key": API_KEY,
    ...(opts.headers || {}),
  };

  try {
    const res = await fetch(url, { ...opts, headers });

    if (!res.ok) {
      const txt = await res.text().catch(() => null);
      console.warn(`API Ninjas error (${res.status}):`, txt || res.statusText);
      return null;
    }

    return await res.json();
  } catch (e) {
    console.warn("Failed to fetch from API Ninjas:", e.message);
    return null;
  }
}

/**
 * Transform API response to application format
 */
function _transformFundData(apiData, schemeCode) {
  if (!apiData) return null;

  try {
    // API Ninjas returns a single fund object
    const fund = apiData;
    
    return {
      schemeCode: schemeCode || TICKER_TO_SCHEME[fund.fund_ticker] || fund.fund_ticker,
      ticker: fund.fund_ticker,
      schemeName: fund.fund_name || "Unknown Fund",
      isin: fund.isin,
      cusip: fund.cusip,
      country: fund.country || "US",
      category: _categorizeFromName(fund.fund_name),
      expenseRatio: fund.expense_ratio,
      aum: fund.aum,
      numHoldings: fund.num_holdings,
      holdings: fund.holdings || [],
      latestNav: _extractLatestNav(fund),
      return1yr: _calculateReturn(fund),
      lastUpdated: Date.now(),
    };
  } catch (e) {
    console.warn("Failed to transform fund data:", e);
    return null;
  }
}

/**
 * Extract latest NAV from fund data
 */
function _extractLatestNav(fund) {
  if (!fund.holdings || fund.holdings.length === 0) return null;
  
  // Calculate NAV from first holding if available
  const firstHolding = fund.holdings[0];
  if (firstHolding && firstHolding.value && firstHolding.num_shares) {
    // This is a rough estimate - real NAV would need total portfolio value
    return (firstHolding.value / firstHolding.num_shares).toFixed(2);
  }
  
  return null;
}

/**
 * Calculate approximate 1-year return (placeholder)
 */
function _calculateReturn(fund) {
  // Since API doesn't provide historical returns, we'll use expense ratio as a proxy
  // Lower expense ratio = better return (rough approximation)
  if (fund.expense_ratio !== undefined) {
    const baseReturn = 12; // Base return assumption
    const adjustedReturn = baseReturn - (fund.expense_ratio * 0.5);
    return `${adjustedReturn.toFixed(2)}%`;
  }
  return "12.00%";
}

/**
 * Categorize fund based on name
 */
function _categorizeFromName(name) {
  if (!name) return "Equity";
  const lower = name.toLowerCase();
  
  if (lower.includes("index") || lower.includes("500")) return "Index";
  if (lower.includes("bond") || lower.includes("fixed")) return "Debt";
  if (lower.includes("hybrid") || lower.includes("balanced")) return "Hybrid";
  if (lower.includes("small cap")) return "Small Cap";
  if (lower.includes("mid cap")) return "Mid Cap";
  if (lower.includes("large cap") || lower.includes("bluechip")) return "Large Cap";
  
  return "Equity";
}

/**
 * Fetch mutual fund data by scheme code or ticker
 * @param {string} schemeId - Scheme code or ticker symbol
 * @returns {Promise<Object|null>} Fund data or null
 */
export async function fetchNav(schemeId) {
  if (!schemeId) return null;

  // Map scheme code to ticker if needed
  const ticker = FUND_TICKER_MAP[schemeId] || schemeId;
  const cacheKey = _cacheKey(ticker);

  // Try cache first
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (_isCacheValid(parsed)) {
        return parsed.data;
      }
    }
  } catch (e) {
    console.warn("Cache read failed:", e);
  }

  // Fetch from API
  const url = `${BASE}/mutualfund?ticker=${encodeURIComponent(ticker)}`;
  const apiData = await _fetchJson(url);

  if (!apiData) {
    return null; // Return null to trigger fallback to synthetic data
  }

  // Transform and cache
  const transformed = _transformFundData(apiData, schemeId);
  
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      ts: Date.now(),
      ttl: CACHE_TTL,
      data: transformed,
    }));
  } catch (e) {
    // Ignore cache write errors
  }

  return transformed;
}

/**
 * Fetch multiple funds in bulk
 * @param {string[]} schemeIds - Array of scheme codes or tickers
 * @returns {Promise<Array>} Array of fund data or errors
 */
export async function fetchNavBulk(schemeIds = []) {
  const promises = schemeIds.map((id) =>
    fetchNav(id).catch((err) => ({ error: String(err) }))
  );
  return Promise.all(promises);
}

/**
 * Search funds by name or ticker
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching funds
 */
export async function searchFunds(query) {
  if (!query || query.trim().length < 2) return [];

  const q = query.toLowerCase().trim();
  
  // Search through our mapped tickers
  const results = [];
  
  for (const [schemeCode, ticker] of Object.entries(FUND_TICKER_MAP)) {
    const fundData = await fetchNav(schemeCode);
    if (fundData) {
      const nameMatch = fundData.schemeName.toLowerCase().includes(q);
      const tickerMatch = ticker.toLowerCase().includes(q);
      const codeMatch = schemeCode.includes(q);
      
      if (nameMatch || tickerMatch || codeMatch) {
        results.push(fundData);
      }
    }
  }
  
  return results;
}

/**
 * Get fund holdings details
 * @param {string} schemeId - Scheme code or ticker
 * @returns {Promise<Array>} Array of holdings
 */
export async function getFundHoldings(schemeId) {
  const fundData = await fetchNav(schemeId);
  return fundData?.holdings || [];
}

/**
 * Clear all cached fund data
 */
export function clearCache() {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('mfninjas_')) {
        localStorage.removeItem(key);
      }
    });
    console.log("✅ Cache cleared successfully");
  } catch (e) {
    console.warn("Failed to clear cache:", e);
  }
}

export default {
  fetchNav,
  fetchNavBulk,
  searchFunds,
  getFundHoldings,
  clearCache,
};