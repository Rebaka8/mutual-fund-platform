import React, { useState, useEffect } from "react";
import SipCalculator from './sipCalculator';
import { fetchNav } from '../services/mfninjas';
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const initialFundsToShow = [
  { schemeCode: "125497", schemeName: "SBI Bluechip Fund - Direct (Growth)", category: "Equity", return1yr: "12.80%" },
  { schemeCode: "118297", schemeName: "HDFC Equity Fund - Direct (Growth)", category: "Equity", return1yr: "13.17%" },
  { schemeCode: "102885", schemeName: "ICICI Prudential Bluechip - Direct (Growth)", category: "Equity", return1yr: "11.98%" },
  { schemeCode: "100208", schemeName: "Axis Bluechip Fund - Direct (Growth)", category: "Equity", return1yr: "14.45%" },
  { schemeCode: "120304", schemeName: "Mirae Asset Large Cap - Direct (Growth)", category: "Equity", return1yr: "15.12%" },
  { schemeCode: "117717", schemeName: "UTI Nifty 50 Index Fund - Direct (Growth)", category: "Index", return1yr: "13.00%" },
  { schemeCode: "107647", schemeName: "Kotak Standard Multicap - Direct (Growth)", category: "Hybrid", return1yr: "10.75%" },
  { schemeCode: "105554", schemeName: "Aditya Birla Tax Relief 96 - Direct (Growth)", category: "Equity", return1yr: "14.30%" },
  { schemeCode: "120305", schemeName: "Franklin India Bluechip - Direct (Growth)", category: "Equity", return1yr: "11.03%" },
  { schemeCode: "118874", schemeName: "Mirae Asset Hybrid Equity - Direct (Growth)", category: "Hybrid", return1yr: "10.75%" },
  { schemeCode: "140006", schemeName: "SBI Small Cap Fund - Direct (Growth)", category: "Equity", return1yr: "21.54%" },
];

const durations = [
  { label: "1 Year", months: 12 },
  { label: "3 Years", months: 36 },
  { label: "5 Years", months: 60 },
  { label: "10 Years", months: 120 },
];

// Shared inline styles
const inputStyle = {
  padding: "9px",
  borderRadius: "7px",
  border: "1px solid #ccc",
  minWidth: "120px",
};

const portfolioCard = {
  background: "white",
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 2px 12px rgba(0, 119, 204, 0.1)",
  textAlign: "center",
};

const portfolioLabel = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "8px",
  fontWeight: "500",
};

const portfolioValue = {
  fontSize: "28px",
  color: "#0077cc",
  fontWeight: "700",
};

function InvestorDashboard() {
  // funds list (start with bundled sample list, then attempt to enrich with live API data)
  const [fundsToShowState, setFundsToShowState] = useState(initialFundsToShow);

  useEffect(() => {
    // attempt to fetch latest NAV for each fund to enrich UI (non-blocking)
    const loadLatestNavs = async () => {
      try {
        const codes = initialFundsToShow.map(f => f.schemeCode).filter(Boolean);
        if (codes.length === 0) return;
        // Use fetchNavBulk if available (returns array of responses or errors)
        if (typeof fetchNav === 'function') {
          const results = await Promise.all(codes.map(code => fetchNav(code).catch(e => ({ error: String(e) }))));
          const updated = initialFundsToShow.map((f, idx) => {
            const res = results[idx];
            let latestNav = null;
            try {
              if (res) {
                if (Array.isArray(res) && res.length) {
                  // choose last element or object containing nav
                  const s = res[res.length - 1];
                  latestNav = Number(s.nav || s.value || s.price || s.latest_nav || 0) || null;
                } else if (res.latest_nav || res.nav) {
                  latestNav = Number(res.latest_nav || res.nav || res.value || 0) || null;
                }
              }
            } catch (e) { latestNav = null; }
            return Object.assign({}, f, latestNav ? { latestNav } : {});
          });
          setFundsToShowState(updated);
        }
      } catch (e) {
        // ignore — UI will keep showing fallback static list
        console.warn('Failed to enrich funds list from API', e);
      }
    };
    loadLatestNavs();
  }, []);
  // Search UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceRef = React.useRef(null);

  const runFilter = (category, query) => {
    const q = (query || searchQuery || '').toLowerCase().trim();
    const cat = (category || searchCategory || '').trim();
    // Combine funds and holdings for suggestions
    const funds = fundsToShowState.filter(f => (
      (q === '' || f.schemeName.toLowerCase().includes(q) || f.schemeCode.includes(q) || f.category.toLowerCase().includes(q))
      && (cat === '' || f.category === cat)
    ));
    const holdings = investments.filter(h => (
      q === '' || (h.fundName && h.fundName.toLowerCase().includes(q)) || (h.fundCode && String(h.fundCode).includes(q))
    ));
    const results = [...funds.slice(0,8), ...holdings.slice(0,8)];
    setSearchResults(results);
    setShowSuggestions(true);
    setSelectedIndex(results.length > 0 ? 0 : -1);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    // debounce the runFilter so we don't run on every keystroke
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!val) {
        setSearchResults([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        return;
      }
      runFilter(searchCategory, val);
    }, 220);
  };

  const selectSearchResult = (index) => {
    const idx = typeof index === 'number' ? index : selectedIndex;
    const item = searchResults[idx];
    if (!item) return;
    // If it's a fund (has schemeCode), open it; else if it's a holding, 
    // attempt to open by fundCode
    if (item.schemeCode) {
      openFund(item);
      setSelectedFund(item);
    } else if (item.fundCode) {
      const f = fundsToShowState.find(ff => ff.schemeCode === item.fundCode) || fundsToShowState[0];
      if (f) openFund(f);
    }
    setSearchQuery(''); setSearchResults([]); setShowSuggestions(false); setSelectedIndex(-1);
  };

  // keyboard navigation handler for the input
  const handleInputKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min((searchResults.length - 1), Math.max(0, (i === -1 ? 0 : i + 1))));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(0, (i <= 0 ? 0 : i - 1)));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) selectSearchResult(selectedIndex);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  // Portfolio cards mapping and handler
  const portfolios = [
    { key: 'Large Cap', title: 'Large Cap Funds' },
    { key: 'High Return', title: 'High Return' },
    { key: 'Best SIP', title: 'Best SIP Funds' },
    { key: 'Gold Funds', title: 'Gold Funds' },
    { key: 'Mid Cap', title: 'Mid Cap' },
    { key: 'Small Cap', title: 'Small Cap' },
  ];

  const portfolioMap = {
    'Large Cap': ['125497','118297','102885','100208','120304'],
    'High Return': ['140006','120304','118297','105554'],
    'Best SIP': ['117717','118297','120304','102885'],
    'Gold Funds': ['120304','105554'],
    'Mid Cap': ['120305','118874','102885'],
    'Small Cap': ['140006','105554'],
  };

  const showPortfolio = (key) => {
    // mark which portfolio is selected and open its lead fund
    try { setSelectedPortfolio && setSelectedPortfolio(key); } catch (e) {}
    const codes = portfolioMap[key] || [];
    const code = codes[0];
    const fund = fundsToShowState.find(f => f.schemeCode === code) || fundsToShowState[0];
    if (fund) {
      setSelectedFund(fund);
      openFund(fund);
    }
  };
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [quickSearchQuery, setQuickSearchQuery] = useState("");
  const handleQuickSearchKeyDown = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13 || e.code === 'Enter') {
      e.preventDefault();
      const q = quickSearchQuery.trim().toLowerCase();
      if (!q) return;

      // portfolio keyword detection (match common phrases)
      const portfolioKeywords = {
        'large cap': 'Large Cap',
        'largecap': 'Large Cap',
        'large': 'Large Cap',
        'mid cap': 'Mid Cap',
        'midcap': 'Mid Cap',
        'mid': 'Mid Cap',
        'small cap': 'Small Cap',
        'smallcap': 'Small Cap',
        'small': 'Small Cap',
        'best sip': 'Best SIP',
        'sip': 'Best SIP',
        'high return': 'High Return',
        'high': 'High Return',
        'gold': 'Gold Funds',
      };

      // try to find a portfolio key from query tokens
      let matchedPortfolio = null;
      Object.keys(portfolioKeywords).forEach((k) => {
        if (q.includes(k) && !matchedPortfolio) matchedPortfolio = portfolioKeywords[k];
      });

      if (matchedPortfolio) {
        // show portfolio funds and open first representative fund
        setSelectedPortfolio(matchedPortfolio);
        const codes = portfolioMap[matchedPortfolio] || [];
        const fund = fundsToShowState.find(f => f.schemeCode === codes[0]) || fundsToShowState[0];
        if (fund) openFund(fund);
        setQuickSearchQuery('');
        return;
      }

      // otherwise try to find a single fund by name or code
      const f = fundsToShowState.find(f => (f.schemeName && f.schemeName.toLowerCase().includes(q)) || (f.schemeCode && f.schemeCode.includes(q)));
      if (f) {
        setSelectedFund(f);
        openFund(f);
        setQuickSearchQuery('');
        return;
      }

      // fallback: tokenized name matching
      const parts = q.split(/\s+/).filter(Boolean);
      const f2 = fundsToShowState.find(ff => parts.every(p => (ff.schemeName || '').toLowerCase().includes(p)));
      if (f2) {
        setSelectedFund(f2);
        openFund(f2);
        setQuickSearchQuery('');
        return;
      }

      alert('No fund or portfolio found for "' + quickSearchQuery + '"');
    }
  };

  const [selectedFund, setSelectedFund] = useState(null);
  const [navData, setNavData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [investments, setInvestments] = useState([]);
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("mf_theme") === "dark";
    } catch (e) {
      return false;
    }
  });

  const [amount, setAmount] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(durations[0].months);
  const [calcResult, setCalcResult] = useState(null);

  // Load investments for logged in user (if any)
  useEffect(() => {
    try {
      const currentUserData = localStorage.getItem("currentUser");
      if (currentUserData) {
        const user = JSON.parse(currentUserData);
        const key = `investments_${user.email}`;
        const stored = localStorage.getItem(key);
        if (stored) setInvestments(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist theme
  useEffect(() => {
    try {
      localStorage.setItem("mf_theme", dark ? "dark" : "light");
    } catch (e) {}
  }, [dark]);

  const openFund = async (fund) => {
    setSelectedFund(fund);
    setLoading(true);
    setCalcResult(null);
    setAmount("");
    try {
      // Try to fetch real NAVs from the API service first
      let data = null;
      try {
        data = await fetchNav(fund.schemeCode);
      } catch (apiErr) {
        // log and fall back to synthetic
        console.warn('MF API fetch failed, falling back to synthetic data:', apiErr && apiErr.message ? apiErr.message : apiErr);
        data = null;
      }

      // normalize API response if present
      if (data) {
        let series = [];
        try {
          // common shapes: array of {date, nav} or {nav_date, nav} or wrapper like {data: [...]}
          const arr = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : null);
          if (arr && arr.length > 0) {
            // detect keys
            const sample = arr[0];
            const dateKey = Object.keys(sample).find(k => /date|time|nav_date/i.test(k)) || Object.keys(sample).find(k => k.toLowerCase().includes('date'));
            const navKey = Object.keys(sample).find(k => /nav|value|price|close/i.test(k)) || Object.keys(sample).find(k => k.toLowerCase().includes('nav'));
            series = arr.map(item => {
              const rawDate = item[dateKey] || item.date || item.timestamp || item.nav_date || item.time;
              const d = rawDate ? new Date(rawDate) : null;
              const dateStr = d && !isNaN(d) ? d.toISOString().split('T')[0] : (item.date || item.nav_date || String(Date.now()));
              const nav = Number(item[navKey] || item.nav || item.value || item.price || 0);
              return { date: dateStr, nav };
            }).filter(p => p && !isNaN(p.nav));
          } else if (data.latest_nav || data.nav) {
            const v = Number(data.latest_nav || data.nav || data.value || 0);
            series = [{ date: new Date().toISOString().split('T')[0], nav: v }];
          }
        } catch (normErr) {
          console.warn('Failed to normalize API response', normErr);
          series = [];
        }

        if (series && series.length > 1) {
          setNavData(series);
          setLoading(false);
          return;
        }
      }

      // Fallback: generate synthetic NAV history for offline/demo use
      const points = [];
      const seed = Number((fund && fund.schemeCode && String(fund.schemeCode).slice(-3)) || 100);
      const base = 100 + (seed % 50);
      const today = new Date();
      // generate 250 daily points (older -> newer)
      for (let i = 249; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        // produce a smooth curve with small oscillation and gradual growth/decay
        const nav = +(base * (1 + Math.sin(i / 12) * 0.02 + ((i - 125) / 125) * 0.02)).toFixed(2);
        points.push({ date: d.toISOString().split('T')[0], nav });
      }
      setNavData(points);
    } catch (e) {
      setNavData([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateReturn = () => {
    if (!amount) return alert("Please enter investment amount.");
    if (navData.length === 0) return alert("NAV data not loaded yet.");
    const endNavObj = navData[navData.length - 1];
    const endDate = new Date(endNavObj.date);
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - selectedDuration);
    const startNavObj = navData.find((d) => new Date(d.date) >= startDate);
    if (!startNavObj) return alert("Not enough NAV data for selected duration.");
    const growthPercent = ((endNavObj.nav - startNavObj.nav) / startNavObj.nav) * 100;
    const total = parseFloat(amount) * (1 + growthPercent / 100);
    setCalcResult({ growthPercent, total });
  };

  const handleInvest = () => {
    if (!amount || parseFloat(amount) <= 0) return alert("Please enter a valid investment amount.");
    if (!selectedFund) return alert("Select a fund first.");
    const currentUserData = localStorage.getItem("currentUser");
    if (!currentUserData) return alert("Please login to invest.");
    const user = JSON.parse(currentUserData);
    const key = `investments_${user.email}`;
    const newInvestment = {
      id: Date.now(),
      fundName: selectedFund.schemeName,
      fundCode: selectedFund.schemeCode,
      category: selectedFund.category,
      amount: parseFloat(amount),
      investmentDate: new Date().toISOString(),
      currentNAV: navData.length > 0 ? navData[navData.length - 1].nav : 0,
      expectedReturn: calcResult ? calcResult.growthPercent : 0,
      duration: selectedDuration,
    };
    const updated = [...investments, newInvestment];
    setInvestments(updated);
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {}
    alert(`Successfully invested ₹${amount} in ${selectedFund.schemeName}!`);
  };

  const removeInvestment = (id) => {
    const updated = investments.filter((i) => i.id !== id);
    setInvestments(updated);
    try {
      const currentUserData = localStorage.getItem("currentUser");
      if (currentUserData) {
        const user = JSON.parse(currentUserData);
        localStorage.setItem(`investments_${user.email}`, JSON.stringify(updated));
      }
    } catch (e) {}
  };

  const sellHoldingsForSelectedFund = () => {
    if (!selectedFund) return alert("Select a fund to sell");
    const sells = investments.filter((i) => i.fundCode === selectedFund.schemeCode);
    if (sells.length === 0) return alert("No holdings for this fund");
    const updated = investments.filter((i) => i.fundCode !== selectedFund.schemeCode);
    setInvestments(updated);
    try {
      const currentUserData = localStorage.getItem("currentUser");
      if (currentUserData) {
        const user = JSON.parse(currentUserData);
        localStorage.setItem(`investments_${user.email}`, JSON.stringify(updated));
      }
    } catch (e) {}
    alert("Sold holdings for this fund (simulated)");
  };

  return (
    <div className={`mf-app ${dark ? "dark" : "light"}`}>
      

      <main className="mf-main" style={{ padding: 20, width: "100%" }}>
        <header style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16, alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ margin: 0, color: 'var(--primary)' }}>Investor Dashboard</h2>
              <div style={{ color: '#666', fontSize: 13 }}>Track funds, view charts and place quick orders</div>
            </div>
            
          </div>

          <div style={{ margin: '0 16px' }} />

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ minWidth: 260, display: 'flex', alignItems: 'center' }}>
              <input
                aria-label="Quick search funds"
                placeholder="Search funds (press Enter)"
                value={quickSearchQuery}
                onChange={(e) => setQuickSearchQuery(e.target.value)}
                onKeyDown={handleQuickSearchKeyDown}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e6f0fb', boxShadow: '0 2px 6px rgba(3,102,170,0.04)' }}
              />
            </div>

            <div style={{ ...portfolioCard, padding: 12, minWidth: 140 }}>
              <div style={portfolioLabel}>Invested</div>
              <div style={{ ...portfolioValue, fontSize: 18 }}>₹{investments.reduce((sum, inv) => sum + (inv.amount || 0), 0).toFixed(0)}</div>
            </div>

            <div style={{ ...portfolioCard, padding: 12, minWidth: 140 }}>
              <div style={portfolioLabel}>Value</div>
              <div style={{ ...portfolioValue, fontSize: 18 }}>₹{investments.reduce((sum, inv) => sum + ((inv.amount || 0) * (1 + (inv.expectedReturn || 0) / 100)), 0).toFixed(0)}</div>
            </div>
            <div style={{ ...portfolioCard, padding: 12, minWidth: 140 }}>
              <div style={portfolioLabel}>Holdings</div>
              <div style={{ ...portfolioValue, fontSize: 18 }}>{investments.length}</div>
            </div>
          </div>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "280px 1fr 320px", gap: 18, alignItems: "start" }}>
          <div style={{ background: "var(--card-bg, #fff)", borderRadius: 12, padding: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h4 style={{ margin: 0 }}>Portfolios</h4>
              <button style={{ background: "none", border: "none", color: "#0077cc", cursor: "pointer" }} onClick={() => { setNavData([]); setSelectedFund(null); setSelectedPortfolio(null); }}>Reset</button>
            </div>

            <div style={{ maxHeight: 520, overflowY: 'auto', paddingBottom: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {portfolios.map((p) => {
                  const codes = portfolioMap[p.key] || [];
                  const sample = fundsToShowState.find(f => f.schemeCode === codes[0]) || fundsToShowState[0];
                  return (
                    <button key={p.key} onClick={() => showPortfolio(p.key)} style={{ width: '100%', borderRadius: 10, padding: '12px', textAlign: 'left', border: selectedPortfolio === p.key ? '2px solid #0077cc' : '1px solid #eef6fb', background: '#fff', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#073b4c' }}>{p.title}</div>
                          <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>{sample.schemeName.split(' - ')[0]}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ marginTop: 8, fontSize: 12, color: '#22a745', fontWeight: 800 }}>
                            {sample.latestNav ? `₹${Number(sample.latestNav).toFixed(2)}` : sample.return1yr}
                          </div>
                          <div style={{ fontSize: 11, color: '#999' }}>{sample.category}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: 12 }}>
                {selectedPortfolio ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(portfolioMap[selectedPortfolio] || []).map((code) => {
                      const fund = fundsToShowState.find(f => f.schemeCode === code);
                      if (!fund) return null;
                      return (
                        <button key={code} onClick={() => openFund(fund)} style={{ textAlign: 'left', padding: '10px 8px', borderRadius: 8, border: '1px solid #f0f0f0', background: selectedFund && selectedFund.schemeCode === fund.schemeCode ? '#f0f8ff' : 'transparent', cursor: 'pointer' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 600, color: '#073b4c' }}>{fund.schemeName.split(' - ')[0]}</div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ color: (typeof fund.return1yr === 'string' && fund.return1yr.startsWith('-')) ? '#d12c2c' : '#22a745', fontWeight: 700 }}>
                                {fund.latestNav ? `₹${Number(fund.latestNav).toFixed(2)}` : fund.return1yr}
                              </div>
                              <div style={{ fontSize: 12, color: '#777' }}>{fund.category}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ color: '#777' }}>Select a portfolio above to view its funds.</div>
                )}
              </div>
            </div>
          </div>

          <div style={{ background: "var(--card-bg, #fff)", borderRadius: 12, padding: 14, boxShadow: "0 6px 20px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <h3 style={{ margin: "4px 0", color: "#005fa3" }}>{selectedFund ? selectedFund.schemeName : "Select a fund"}</h3>
                <div style={{ color: "#666", fontSize: 13 }}>{selectedFund ? selectedFund.category : "Click a fund from Market Watch to load NAV & chart"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "#777" }}>Latest NAV</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: "#073b4c" }}>{navData.length > 0 ? `₹${navData[navData.length - 1].nav.toFixed(2)}` : "--"}</div>
                <div style={{ fontSize: 12, color: navData.length > 1 && ((navData[navData.length - 1].nav - navData[navData.length - 2].nav) >= 0) ? "#22a745" : "#d12c2c" }}>{navData.length > 1 ? `${((navData[navData.length - 1].nav - navData[navData.length - 2].nav) / navData[navData.length - 2].nav * 100).toFixed(2)}%` : ""}</div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              {loading ? (
                <div style={{ padding: 20 }}>Loading chart...</div>
              ) : selectedFund && navData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={navData} margin={{ top: 10, right: 12, left: 0, bottom: 6 }}>
                    <defs>
                      <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0077cc" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#0077cc" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 2" />
                    <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: "short" })} interval={Math.max(0, Math.floor(navData.length / 8) - 1)} />
                    <YAxis />
                    <Tooltip labelFormatter={(label) => `Date: ${label}`} formatter={(value) => [`₹${Number(value).toFixed(2)}`, "NAV"]} />
                    <Area type="monotone" dataKey="nav" stroke="#0077cc" fill="url(#navGradient)" strokeWidth={2} />
                    <Line type="monotone" dataKey="nav" stroke="#005fa3" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ padding: 40, textAlign: "center", color: "#777" }}>Pick a fund on the left to view NAV and quick analytics.</div>
              )}
            </div>
          </div>

          <div style={{ background: "var(--card-bg, #fff)", borderRadius: 12, padding: 14, boxShadow: "0 6px 20px rgba(0,0,0,0.04)" }}>
            <div style={{ marginTop: 4 }}>
              <SipCalculator
                initialAmount={5000}
                initialReturn={12}
                initialYears={10}
                onCalculate={(res) => {
                  console.log('SIP result', res);
                }}
              />
            </div>
          </div>
        </section>

        {/* Full-width Quick Order card placed before Holdings (horizontal layout) */}
        <section style={{ marginTop: 18 }}>
          <div style={{ background: "var(--card-bg, #fff)", borderRadius: 12, padding: 14, boxShadow: "0 6px 20px rgba(0,0,0,0.04)", marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ minWidth: 260, flex: '1 1 260px' }}>
                <div style={{ fontSize: 13, color: '#555' }}>Fund</div>
                <div style={{ fontWeight: 700, color: '#073b4c', marginTop: 6 }}>{selectedFund ? selectedFund.schemeName.split(' - ')[0] : '—'}</div>
              </div>

              <div style={{ flex: '1 1 180px', minWidth: 160 }}>
                <input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ ...inputStyle, width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #c4e1f7', background: '#f5fbff' }} />
              </div>

              <div style={{ flex: '0 0 140px' }}>
                <select value={selectedDuration} onChange={(e) => setSelectedDuration(+e.target.value)} style={{ ...inputStyle, width: '140px', padding: '10px 12px', borderRadius: 10, border: '1px solid #c4e1f7', background: '#f5fbff' }}>
                  {durations.map((d) => (
                    <option key={d.months} value={d.months}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginLeft: 'auto', flexWrap: 'wrap' }}>
                <button onClick={calculateReturn} style={{ background: '#0077cc', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 10, cursor: 'pointer', boxShadow: '0 6px 18px #0077cc22', fontWeight: 700 }}>Estimate</button>
                <button onClick={handleInvest} style={{ background: '#22a745', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 10, cursor: 'pointer', boxShadow: '0 6px 18px #22a74522', fontWeight: 700 }}>Buy</button>
                <button onClick={sellHoldingsForSelectedFund} style={{ background: '#fff', border: '1px solid #ddd', padding: '10px 16px', borderRadius: 10, cursor: 'pointer' }}>Sell</button>
              </div>
            </div>

            {/* Quick preset buttons row */}
            <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[500,1000,3000,5000,10000].map((amt) => {
                const active = Number(amount) === amt;
                return (
                  <button key={amt} onClick={() => setAmount(String(amt))} style={{ minWidth: 96, padding: '8px 10px', borderRadius: 999, border: active ? '1px solid #57b0ff' : '1px solid #e6eef8', background: active ? '#eaf6ff' : '#fff', color: active ? '#054a72' : '#0b4f6c', fontWeight: 700, boxShadow: active ? '0 6px 18px rgba(11,155,214,0.08)' : '0 2px 6px rgba(12,40,62,0.03)', cursor: 'pointer' }}>
                    ₹{amt.toLocaleString()}
                  </button>
                );
              })}
            </div>
          </div>

          <h4 style={{ marginBottom: 10 }}>Holdings</h4>
          <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.04)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f8fafc" }}>
                <tr>
                  <th style={{ textAlign: "left", padding: 12 }}>Name</th>
                  <th style={{ padding: 12 }}>Amount</th>
                  <th style={{ padding: 12 }}>Date</th>
                  <th style={{ padding: 12 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {investments.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: 20, color: "#777" }}>No holdings. Use Quick Order to buy.</td></tr>
                ) : investments.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                    <td style={{ padding: 12 }}>{inv.fundName}</td>
                    <td style={{ padding: 12 }}>₹{(inv.amount || 0).toFixed(2)}</td>
                    <td style={{ padding: 12 }}>{new Date(inv.investmentDate).toLocaleDateString()}</td>
                    <td style={{ padding: 12 }}>
                      <button onClick={() => { if (window.confirm("Remove this investment?")) removeInvestment(inv.id); }} style={{ background: "#d12c2c", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 6 }}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default InvestorDashboard;
