/**
 * Helper utilities for mutual fund data processing
 * Provides data transformation and synthetic data generation
 */

/**
 * Generate synthetic NAV history for demonstration
 * @param {Object} fund - Fund object with schemeCode
 * @param {number} days - Number of days of history to generate
 * @returns {Array} Array of {date, nav} objects
 */
export function generateSyntheticNavHistory(fund, days = 250) {
  if (!fund) return [];

  const points = [];
  const seed = Number((fund.schemeCode && String(fund.schemeCode).slice(-3)) || 100);
  const base = 100 + (seed % 50);
  const today = new Date();

  // Generate daily points (older -> newer)
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    // Produce a smooth curve with oscillation and gradual growth
    const nav = +(base * (1 + Math.sin(i / 12) * 0.02 + ((i - days / 2) / (days / 2)) * 0.02)).toFixed(2);
    points.push({
      date: d.toISOString().split('T')[0],
      nav: Math.max(nav, 10), // Ensure positive NAV
    });
  }

  return points;
}

/**
 * Extract NAV from API response
 * @param {Object} response - API response object
 * @returns {number|null} NAV value or null
 */
export function navFromLatestResponse(response) {
  if (!response) return null;

  try {
    if (response.latestNav) return Number(response.latestNav);
    if (response.nav) return Number(response.nav);
    if (response.value) return Number(response.value);
    if (response.price) return Number(response.price);

    // Check holdings for value
    if (response.holdings && response.holdings.length > 0) {
      const firstHolding = response.holdings[0];
      if (firstHolding.value && firstHolding.num_shares) {
        return Number((firstHolding.value / firstHolding.num_shares).toFixed(2));
      }
    }

    return null;
  } catch (e) {
    console.warn("Failed to extract NAV:", e);
    return null;
  }
}

/**
 * Format currency value
 * @param {number} value - Numeric value
 * @param {string} currency - Currency symbol (default: ₹)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currency = "₹") {
  if (value === null || value === undefined || isNaN(value)) return `${currency}0`;

  // Format large numbers with K, M, B suffixes
  if (value >= 1e9) {
    return `${currency}${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${currency}${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${currency}${(value / 1e3).toFixed(2)}K`;
  }

  return `${currency}${value.toFixed(2)}`;
}

/**
 * Calculate percentage change
 * @param {number} oldValue - Previous value
 * @param {number} newValue - Current value
 * @returns {string} Percentage change with sign
 */
export function calculatePercentageChange(oldValue, newValue) {
  if (!oldValue || !newValue || isNaN(oldValue) || isNaN(newValue)) return "0.00%";

  const change = ((newValue - oldValue) / oldValue) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}

/**
 * Validate scheme code format
 * @param {string} code - Scheme code to validate
 * @returns {boolean} True if valid
 */
export function isValidSchemeCode(code) {
  if (!code) return false;
  // Accept numeric codes or ticker symbols (3-5 uppercase letters)
  return /^\d+$/.test(code) || /^[A-Z]{3,5}$/.test(code);
}

/**
 * Get fund category color
 * @param {string} category - Fund category
 * @returns {string} Hex color code
 */
export function getCategoryColor(category) {
  const colors = {
    "Equity": "#0077cc",
    "Debt": "#22a745",
    "Hybrid": "#ff9800",
    "Index": "#9c27b0",
    "Large Cap": "#2196f3",
    "Mid Cap": "#ff5722",
    "Small Cap": "#f44336",
  };

  return colors[category] || "#666";
}

/**
 * Mock functions for backward compatibility
 */
export async function fetchAllSchemes() {
  console.warn("fetchAllSchemes is deprecated - use mfninjas.searchFunds instead");
  return [];
}

export async function searchSchemes(query) {
  console.warn("searchSchemes is deprecated - use mfninjas.searchFunds instead");
  return [];
}

export async function fetchLatestNav(schemeCode) {
  console.warn("fetchLatestNav is deprecated - use mfninjas.fetchNav instead");
  return null;
}

export async function fetchLatestNavsBulk(schemeCodes) {
  console.warn("fetchLatestNavsBulk is deprecated - use mfninjas.fetchNavBulk instead");
  return [];
}

export default {
  generateSyntheticNavHistory,
  navFromLatestResponse,
  formatCurrency,
  calculatePercentageChange,
  isValidSchemeCode,
  getCategoryColor,
  fetchAllSchemes,
  searchSchemes,
  fetchLatestNav,
  fetchLatestNavsBulk,
};
