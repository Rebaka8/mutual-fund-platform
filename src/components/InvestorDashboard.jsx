import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const fundsToShow = [
  {
    schemeCode: "118297",
    schemeName: "HDFC Equity Fund - Direct Plan - Growth",
    category: "Equity",
    return1yr: "13.17%",
  },
  {
    schemeCode: "125497",
    schemeName: "SBI Bluechip Fund - Direct Plan - Growth",
    category: "Equity",
    return1yr: "12.80%",
  },
  {
    schemeCode: "102885",
    schemeName: "ICICI Prudential Bluechip Fund - Direct Plan - Growth",
    category: "Equity",
    return1yr: "11.98%",
  },
  {
    schemeCode: "100208",
    schemeName: "Axis Bluechip Fund - Direct Plan - Growth",
    category: "Equity",
    return1yr: "14.45%",
  },
  {
    schemeCode: "120304",
    schemeName: "Mirae Asset Large Cap Fund - Direct Plan - Growth",
    category: "Equity",
    return1yr: "15.12%",
  },
  {
    schemeCode: "117717",
    schemeName: "UTI Nifty 50 Index Fund - Direct Plan - Growth",
    category: "Index",
    return1yr: "13.00%",
  },
  {
    schemeCode: "107647",
    schemeName: "Kotak Standard Multicap Fund - Direct Plan - Growth",
    category: "Hybrid",
    return1yr: "10.75%",
  },
  {
    schemeCode: "105554",
    schemeName: "Aditya Birla Sun Life Tax Relief 96 - Direct Plan - Growth",
    category: "Equity",
    return1yr: "14.30%",
  },
  {
    schemeCode: "120305",
    schemeName: "Franklin India Bluechip Fund - Direct Plan - Growth",
    category: "Equity",
    return1yr: "11.03%",
  },
  {
    schemeCode: "118874",
    schemeName: "Mirae Asset Hybrid Equity Fund - Direct Plan - Growth",
    category: "Hybrid",
    return1yr: "10.75%",
  },
  {
    schemeCode: "140006",
    schemeName: "SBI Small Cap Fund - Direct Plan - Growth",
    category: "Equity",
    return1yr: "21.54%",
  },
];

const durations = [
  { label: "1 Year", months: 12 },
  { label: "3 Years", months: 36 },
  { label: "5 Years", months: 60 },
  {label: "10 Years", months: 120 },
];

function InvestorDashboard() {
  const [selectedFund, setSelectedFund] = useState(null);
  const [navData, setNavData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Calculator state
  const [amount, setAmount] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(durations[0].months);
  const [calcResult, setCalcResult] = useState(null);

  const openFund = async (fund) => {
    setSelectedFund(fund);
    setLoading(true);
    setCalcResult(null);
    setAmount("");
    try {
      const response = await fetch(`https://api.mfapi.in/mf/${fund.schemeCode}`);
      const json = await response.json();
      const points = json.data
        .map((item) => ({
          date: item.date,
          nav: parseFloat(item.nav),
        }))
        .filter((item) => !isNaN(item.nav))
        .reverse()
        .slice(0, 60);
      setNavData(points);
    } catch {
      setNavData([]);
    }
    setLoading(false);
  };

  const calculateReturn = () => {
    if (!amount) {
      alert("Please enter investment amount.");
      return;
    }
    if (navData.length === 0) {
      alert("NAV data not loaded yet.");
      return;
    }

    // End date is latest NAV date
    const endDate = new Date(navData[navData.length - 1].date);
    // Start date calculated by subtracting months from endDate
    const startDate = new Date(endDate);
    startDate.setMonth(endDate.getMonth() - selectedDuration);

    // Find closest NAV on or after start date
    const startNavObj = navData.find(
      (d) => new Date(d.date) >= startDate
    );
    const endNavObj = navData[navData.length - 1];

    if (!startNavObj) {
      alert("Not enough NAV data for selected duration.");
      return;
    }

    const growthPercent =
      ((endNavObj.nav - startNavObj.nav) / startNavObj.nav) * 100;
    const total = (parseFloat(amount) * (growthPercent / 100)) + parseFloat(amount);

    setCalcResult({ growthPercent, total });
  };

  const closeModal = () => {
    setSelectedFund(null);
    setNavData([]);
    setAmount("");
    setCalcResult(null);
  };

  return (
    <div style={{ maxWidth: 950, margin: "auto" }}>
      <h2 style={{ color: "#004687" }}>Investor Dashboard</h2>
      <table
        style={{
          width: "100%",
          marginTop: 36,
          borderCollapse: "collapse",
          boxShadow: "0 4px 16px #eee",
          borderRadius: 14,
        }}
      >
        <thead style={{ background: "#0077cc", color: "white" }}>
          <tr>
            <th style={{ padding: 14 }}>Fund Name</th>
            <th>Category</th>
            <th>1 Year Return</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {fundsToShow.map((fund) => (
            <tr
              key={fund.schemeCode}
              style={{ cursor: "pointer", background: "#fafcff" }}
            >
              <td
                style={{ padding: "16px 12px", color: "#0077cc", fontWeight: 600 }}
              >
                {fund.schemeName}
              </td>
              <td style={{ padding: "16px 12px" }}>{fund.category}</td>
              <td
                style={{
                  padding: "16px 12px",
                  color: fund.return1yr.startsWith("-") ? "red" : "green",
                }}
              >
                {fund.return1yr}
              </td>
              <td style={{ padding: "16px 12px" }}>
                <button
                  style={{
                    background: "#0077cc",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 20px",
                    cursor: "pointer",
                  }}
                  onClick={() => openFund(fund)}
                >
                  View & Invest
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedFund && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 26,
              borderRadius: 15,
              maxWidth: 600,
              width: "97%",
              boxShadow: "0 0 22px #0077cc44",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#0077cc", marginBottom: 9 }}>
              {selectedFund.schemeName}
            </h3>
            {loading ? (
              <p>Loading chart...</p>
            ) : navData.length > 0 ? (
              <ResponsiveContainer width={"99%"} height={270}>
                <LineChart data={navData}>
                  <CartesianGrid strokeDasharray="4 2" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="nav"
                    stroke="#0077cc"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>No NAV data available for this fund.</p>
            )}

            <div style={{ margin: "30px 0 0", textAlign: "left" }}>
              <h4>Calculate Returns</h4>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <input
                  type="number"
                  min="100"
                  placeholder="Investment Amount (₹)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={inputStyle}
                />
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(+e.target.value)}
                  style={inputStyle}
                >
                  {durations.map((d) => (
                    <option key={d.months} value={d.months}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <button
                  style={{
                    ...inputStyle,
                    background: "#0077cc",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                  onClick={calculateReturn}
                >
                  Calculate
                </button>
              </div>
              {calcResult && (
                <div style={{ marginTop: 15 }}>
                  <b>Return: {calcResult.growthPercent.toFixed(2)}%</b>
                  <br />
                  <b>Total Value: ₹{calcResult.total.toFixed(2)}</b>
                </div>
              )}
            </div>

            <button
              style={{
                marginTop: 22,
                padding: "11px 40px",
                background: "#22a745",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
              }}
              onClick={() =>
                alert(`You have invested in ${selectedFund.schemeName} successfully!`)
              }
            >
              Invest Now
            </button>
            <br />
            <button
              style={{
                marginTop: 13,
                color: "#777",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "9px",
  borderRadius: "7px",
  border: "1px solid #ccc",
  minWidth: "120px",
};

export default InvestorDashboard;
