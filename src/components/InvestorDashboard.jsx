import React, { useState, useEffect } from "react";
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

const fundsToShow = [
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
      const currentUserData = sessionStorage.getItem("currentUser");
      if (currentUserData) {
        const user = JSON.parse(currentUserData);
        const key = `investments_${user.email}`;
        const stored = sessionStorage.getItem(key);
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
      const res = await fetch(`https://api.mfapi.in/mf/${fund.schemeCode}`);
      const json = await res.json();
      const points = (json.data || [])
        .map((item) => ({ date: item.date, nav: parseFloat(item.nav) }))
        .filter((p) => !isNaN(p.nav))
        .reverse()
        .slice(-250);
      setNavData(points);
    } catch (e) {
      setNavData([]);
    }
    setLoading(false);
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
    const currentUserData = sessionStorage.getItem("currentUser");
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
      sessionStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {}
    alert(`Successfully invested ₹${amount} in ${selectedFund.schemeName}!`);
  };

  const removeInvestment = (id) => {
    const updated = investments.filter((i) => i.id !== id);
    setInvestments(updated);
    try {
      const currentUserData = sessionStorage.getItem("currentUser");
      if (currentUserData) {
        const user = JSON.parse(currentUserData);
        sessionStorage.setItem(`investments_${user.email}`, JSON.stringify(updated));
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
      const currentUserData = sessionStorage.getItem("currentUser");
      if (currentUserData) {
        const user = JSON.parse(currentUserData);
        sessionStorage.setItem(`investments_${user.email}`, JSON.stringify(updated));
      }
    } catch (e) {}
    alert("Sold holdings for this fund (simulated)");
  };

  return (
    <div className={`mf-app ${dark ? "dark" : "light"}`}>
      

      <main className="mf-main" style={{ padding: 20, width: "100%" }}>
        <header style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 18, justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, color: "var(--primary)" }}>Investor Dashboard</h2>
            <div style={{ color: "#666", fontSize: 13 }}>Track funds, view charts and place quick orders</div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
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
              <h4 style={{ margin: 0 }}>Market Watch</h4>
              <button style={{ background: "none", border: "none", color: "#0077cc", cursor: "pointer" }} onClick={() => { setNavData([]); setSelectedFund(null); }}>Reset</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {fundsToShow.map((fund) => (
                <button key={fund.schemeCode} onClick={() => openFund(fund)}
                  style={{ textAlign: "left", padding: "10px 8px", borderRadius: 8, border: "1px solid #f0f0f0", background: selectedFund && selectedFund.schemeCode === fund.schemeCode ? "#f0f8ff" : "transparent", cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 600, color: "#073b4c" }}>{fund.schemeName.split(" - ")[0]}</div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: (typeof fund.return1yr === 'string' && fund.return1yr.startsWith('-')) ? "#d12c2c" : "#22a745", fontWeight: 700 }}>{fund.return1yr}</div>
                      <div style={{ fontSize: 12, color: "#777" }}>{fund.category}</div>
                    </div>
                  </div>
                </button>
              ))}
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
            <h4 style={{ marginTop: 0 }}>Quick Order</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 13, color: "#555" }}>Fund</div>
              <div style={{ fontWeight: 700 }}>{selectedFund ? selectedFund.schemeName.split(" - ")[0] : "—"}</div>

              <input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ ...inputStyle, width: "100%" }} />

              <select value={selectedDuration} onChange={(e) => setSelectedDuration(+e.target.value)} style={{ ...inputStyle, width: "100%" }}>
                {durations.map((d) => (
                  <option key={d.months} value={d.months}>{d.label}</option>
                ))}
              </select>

              <button onClick={calculateReturn} style={{ background: "#0077cc", color: "#fff", border: "none", padding: "10px", borderRadius: 8, cursor: "pointer" }}>Estimate</button>

              {calcResult && (
                <div style={{ background: "#f7fafd", padding: 10, borderRadius: 8 }}>
                  <div style={{ fontSize: 13 }}>Growth: <strong>{calcResult.growthPercent.toFixed(2)}%</strong></div>
                  <div style={{ fontSize: 13 }}>Est. Value: <strong>₹{calcResult.total.toFixed(2)}</strong></div>
                </div>
              )}

              <button onClick={handleInvest} style={{ background: "#22a745", color: "#fff", border: "none", padding: "10px", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>Buy</button>

              <button onClick={sellHoldingsForSelectedFund} style={{ background: "#fff", border: "1px solid #ddd", padding: 10, borderRadius: 8, cursor: "pointer" }}>Sell</button>

            </div>
            <hr style={{ margin: "12px 0" }} />
            <h5 style={{ margin: "6px 0" }}>Positions</h5>
            <div style={{ maxHeight: 220, overflowY: "auto", display: "grid", gap: 8 }}>
              {investments.length === 0 ? (
                <div style={{ color: "#777" }}>No positions yet</div>
              ) : investments.map((inv) => (
                <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 8, borderRadius: 8, border: "1px solid #f0f0f0" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{inv.fundName.split(" - ")[0]}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{new Date(inv.investmentDate).toLocaleDateString()}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700 }}>₹{(inv.amount || 0).toFixed(0)}</div>
                    <div style={{ fontSize: 12, color: "#22a745" }}>{inv.expectedReturn ? `${inv.expectedReturn.toFixed(2)}%` : "—"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginTop: 18 }}>
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
