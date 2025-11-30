// API helpers removed. Provide safe local fallbacks.
console.warn("services/mfapi: helpers removed — using local fallbacks.");

export function generateSyntheticNavHistory(fund, days = 250) {
  if (!fund) return [];
  const points = [];
  const seed = Number((fund.schemeCode && String(fund.schemeCode).slice(-3)) || 100);
  const base = 100 + (seed % 50);
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const nav = +(base * (1 + Math.sin(i / 12) * 0.02 + ((i - days / 2) / (days / 2)) * 0.02)).toFixed(2);
    points.push({ date: d.toISOString().split('T')[0], nav: Math.max(nav, 10) });
  }
  return points;
}

export function navFromLatestResponse() { return null; }
export function formatCurrency(v, c = '₹') { return `${c}0`; }
export function calculatePercentageChange() { return '0.00%'; }
export function isValidSchemeCode() { return false; }
export function getCategoryColor() { return '#666'; }

export async function fetchAllSchemes() { return []; }
export async function searchSchemes() { return []; }
export async function fetchLatestNav() { return null; }
export async function fetchLatestNavsBulk() { return []; }

export default { generateSyntheticNavHistory };
