import React, { useState, useEffect, useMemo } from "react";
import Logo from "./Logo.png";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function ProfilePage({ onNotify }) {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    const currentUserData = localStorage.getItem("currentUser");
    if (currentUserData) {
      const userData = JSON.parse(currentUserData);
      setUser(userData);
      setEditedName(userData.fullname || "");
      const userInvestmentsKey = `investments_${userData.email}`;
      const storedInvestments = localStorage.getItem(userInvestmentsKey);
      if (storedInvestments) setInvestments(JSON.parse(storedInvestments));
    }
  }, []);

  const portfolioSeries = useMemo(() => {
    if (investments && investments.length > 0) {
      const sorted = [...investments].sort((a,b)=> new Date(a.investmentDate) - new Date(b.investmentDate));
      const series = [];
      let cum = 0;
      sorted.forEach(inv => { cum += inv.amount; series.push({ date: new Date(inv.investmentDate).toLocaleDateString(), value: Math.round(cum + (inv.currentNAV||0)) }); });
      while (series.length < 8) { const last = series[series.length-1] ? series[series.length-1].value : 10000; series.push({ date: `+${series.length}`, value: Math.round(last * (1 + (Math.random()-0.45)*0.06)) }); }
      return series;
    }
    const base = 85000; const arr = []; for (let i=0;i<12;i++) arr.push({ date: `M${i+1}`, value: Math.round(base*(1 + (i*0.02))) }); return arr;
  }, [investments]);

  const getUserRole = (email) => {
    if (email === "rebakameda@gmail.com") return "Administrator";
    if(email === "vijayshreeparakh7@gmail.com") return "Administrator";
    if (email === "userb@example.com") return "Financial Advisor";
    if (email === "userc@example.com") return "Data Analyst";
    return "Investor";
  };

  const role = user ? getUserRole(user.email) : "Investor";

  const handleSaveChanges = () => {
    setError(""); setMessage("");
    if (!editedName.trim()) { setError("Full name cannot be empty."); return; }
    if (editedPassword && editedPassword.length < 6) { setError("Password must be at least 6 characters long."); return; }
    if (editedPassword && editedPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    const updatedUser = { ...user, fullname: editedName, ...(editedPassword && { password: editedPassword }) };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    const usersData = localStorage.getItem("users"); const users = usersData ? JSON.parse(usersData) : [];
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) { users[userIndex] = updatedUser; localStorage.setItem("users", JSON.stringify(users)); }
    setUser(updatedUser); setIsEditing(false); setEditedPassword(""); setConfirmPassword(""); setMessage("Profile updated successfully!"); setTimeout(()=>setMessage(""),3000);
  };

  if (!user) return (<div style={containerStyle}><p>Loading profile...</p></div>);

  return (
    <div style={containerStyle}>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        <div>
          <div style={{ ...profileCardStyle, paddingBottom: 18 }}>
            <div style={headerSectionStyle}>
              <img src={Logo} alt="Profile" style={profileImageStyle} />
              <h2 style={{ color: 'white', margin: 0, fontSize: 22 }}>{user.fullname || 'User'}</h2>
              <div style={roleTagStyle}>{role}</div>
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ marginBottom: 8, color: '#666' }}>Email</div>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>{user.email}</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button style={quickActionStyle} onClick={async () => {
                  const amt = window.prompt('Enter amount to add (₹):', '1000');
                  if (!amt) return;
                  const a = parseFloat(amt.replace(/[^0-9\.]/g, ''));
                  if (isNaN(a) || a <= 0) { window.alert('Invalid amount'); return; }
                  const userData = JSON.parse(localStorage.getItem('currentUser'));
                  const key = `investments_${userData.email}`;
                  const newInv = { id: Date.now(), fundName: 'Wallet Top-up', amount: a, investmentDate: new Date().toISOString(), currentNAV: 0 };
                  const stored = localStorage.getItem(key);
                  const arr = stored ? JSON.parse(stored) : [];
                  arr.push(newInv);
                  localStorage.setItem(key, JSON.stringify(arr));
                  setInvestments(arr);
                  if (typeof onNotify === 'function') onNotify(`Added ₹${a.toLocaleString()} to account`);
                }}>Add Funds</button>
                <button style={{ ...quickActionStyle, background: '#6c757d' }} onClick={() => {
                  const amt = window.prompt('Enter amount to withdraw (₹):', '500');
                  if (!amt) return;
                  const a = parseFloat(amt.replace(/[^0-9\.]/g, ''));
                  if (isNaN(a) || a <= 0) { window.alert('Invalid amount'); return; }
                  const userData = JSON.parse(localStorage.getItem('currentUser'));
                  const key = `investments_${userData.email}`;
                  const newInv = { id: Date.now(), fundName: 'Withdrawal', amount: -a, investmentDate: new Date().toISOString(), currentNAV: 0 };
                  const stored = localStorage.getItem(key);
                  const arr = stored ? JSON.parse(stored) : [];
                  arr.push(newInv);
                  localStorage.setItem(key, JSON.stringify(arr));
                  setInvestments(arr);
                  if (typeof onNotify === 'function') onNotify(`Withdrew ₹${a.toLocaleString()} from account`, 'info');
                }}>Withdraw</button>
              </div>
              <div style={{ color: '#666', fontSize: 13, marginBottom: 6 }}>Connected Accounts</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={smallBadge}>UPI</div>
                <div style={smallBadge}>Bank</div>
                <div style={smallBadge}>PAN</div>
              </div>
            </div>
          </div>

          <div style={{ ...profileCardStyle, marginTop: 12, padding: 14 }}>
            <h4 style={{ marginTop: 0, color: '#0077cc' }}>Quick Actions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button style={actionBtnStyle} onClick={() => {
                const amt = window.prompt('Enter amount to top up (₹):', '1000');
                if (!amt) return;
                const a = parseFloat(amt.replace(/[^0-9\.]/g, ''));
                if (isNaN(a) || a <= 0) { window.alert('Invalid amount'); return; }
                const userData = JSON.parse(localStorage.getItem('currentUser'));
                const key = `investments_${userData.email}`;
                const newInv = { id: Date.now(), fundName: 'Top-up', amount: a, investmentDate: new Date().toISOString(), currentNAV: 0 };
                const stored = localStorage.getItem(key);
                const arr = stored ? JSON.parse(stored) : [];
                arr.push(newInv);
                localStorage.setItem(key, JSON.stringify(arr));
                setInvestments(arr);
                if (typeof onNotify === 'function') onNotify(`Top-up: ₹${a.toLocaleString()}`);
              }}>Top up</button>
              <button style={actionBtnStyle} onClick={() => {
                const amt = window.prompt('Enter amount to withdraw (₹):', '500');
                if (!amt) return;
                const a = parseFloat(amt.replace(/[^0-9\.]/g, ''));
                if (isNaN(a) || a <= 0) { window.alert('Invalid amount'); return; }
                const userData = JSON.parse(localStorage.getItem('currentUser'));
                const key = `investments_${userData.email}`;
                const newInv = { id: Date.now(), fundName: 'Withdraw', amount: -a, investmentDate: new Date().toISOString(), currentNAV: 0 };
                const stored = localStorage.getItem(key);
                const arr = stored ? JSON.parse(stored) : [];
                arr.push(newInv);
                localStorage.setItem(key, JSON.stringify(arr));
                setInvestments(arr);
                if (typeof onNotify === 'function') onNotify(`Withdrawn: ₹${a.toLocaleString()}`);
              }}>Withdraw</button>
              <button style={actionBtnStyle} onClick={() => window.alert('Feature not implemented: Download Statement')}>Download Statement</button>
            </div>
          </div>
        </div>

        <div>
          <div style={{ ...profileCardStyle, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#889aa5', fontSize: 13 }}>Portfolio Value</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>₹{(investments.reduce((s,i)=>s + (i.amount || 0),0)).toLocaleString()}</div>
                <div style={{ color: '#0b6b3d', fontWeight: 700 }}>+{( (portfolioSeries[portfolioSeries.length-1].value - investments.reduce((s,i)=>s + (i.amount||0),0)) ).toLocaleString()} </div>
              </div>
              <div style={{ width: 420, height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={portfolioSeries}>
                    <defs>
                      <linearGradient id="pgrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0077cc" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#0077cc" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#f5f7fa" />
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <Tooltip formatter={(v)=>`₹${v.toLocaleString()}`} />
                    <Area type="monotone" dataKey="value" stroke="#0077cc" fill="url(#pgrad)" />
                    <Line type="monotone" dataKey="value" stroke="#005fa3" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={{ ...profileCardStyle, marginTop: 12, padding: 14 }}>
            <h4 style={{ marginTop: 0, color: '#073b4c' }}>Holdings</h4>
            <HoldingsTable investments={investments} />
          </div>

          <div style={{ ...profileCardStyle, marginTop: 12, padding: 14 }}>
            <h4 style={{ marginTop: 0, color: '#073b4c' }}>Recent Activity</h4>
            {investments.length > 0 ? (
              investments.slice(-6).reverse().map(inv => (
                <div key={inv.id} style={investmentItemStyle}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{inv.fundName}</div>
                    <div style={{ color: '#888', fontSize: 13 }}>{new Date(inv.investmentDate).toLocaleString()}</div>
                  </div>
                  <div style={{ fontWeight: 800 }}>₹{inv.amount.toFixed(2)}</div>
                </div>
              ))
            ) : (
              <div style={{ color: '#666' }}>No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HoldingsTable({ investments }) {
  const aggregated = useMemo(() => {
    const map = {};
    (investments || []).forEach(inv => {
      const key = inv.fundName || inv.fundCode || 'Unknown';
      if (!map[key]) map[key] = { fundName: key, amount: 0, count: 0, currentNAV: 0 };
      map[key].amount += inv.amount || 0;
      map[key].count += 1;
      map[key].currentNAV = inv.currentNAV || map[key].currentNAV;
    });
    return Object.values(map);
  }, [investments]);

  if (!investments || investments.length === 0) return <div style={{ color: '#666' }}>No holdings</div>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#666' }}>
            <th style={{ padding: '8px' }}>Fund</th>
            <th style={{ padding: '8px' }}>Amount</th>
            <th style={{ padding: '8px' }}>Units</th>
            <th style={{ padding: '8px' }}>Current NAV</th>
          </tr>
        </thead>
        <tbody>
          {aggregated.map(a => (
            <tr key={a.fundName} style={{ borderBottom: '1px solid #f1f3f5' }}>
              <td style={{ padding: '10px' }}>{a.fundName}</td>
              <td style={{ padding: '10px', fontWeight: 700 }}>₹{a.amount.toFixed(2)}</td>
              <td style={{ padding: '10px' }}>{a.count}</td>
              <td style={{ padding: '10px' }}>₹{a.currentNAV ? a.currentNAV.toFixed(2) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// (duplicate HoldingsTable removed)
// Styles
const containerStyle = {
  padding: "40px 20px",
  maxWidth: "1000px",
  margin: "0 auto",
  minHeight: "calc(100vh - 100px)",
};

const profileCardStyle = {
  background: "white",
  borderRadius: "14px",
  boxShadow: "0 6px 20px rgba(2,45,100,0.04)",
  overflow: "hidden",
};

const headerSectionStyle = {
  background: "linear-gradient(135deg, #0077cc 0%, #005fa3 100%)",
  padding: "36px 24px",
  textAlign: "center",
  color: "white",
};

const profileImageStyle = {
  width: "96px",
  height: "96px",
  borderRadius: "50%",
  border: "4px solid white",
  objectFit: "contain",
  background: "white",
  padding: "8px",
  marginBottom: "12px",
};

const roleTagStyle = {
  display: "inline-block",
  background: "rgba(255, 255, 255, 0.18)",
  padding: "6px 18px",
  borderRadius: "18px",
  fontSize: "14px",
  fontWeight: "600",
  marginTop: "8px",
};

const quickActionStyle = {
  padding: '8px 12px',
  borderRadius: 8,
  background: '#0077cc',
  color: 'white',
  border: 'none',
  cursor: 'pointer'
};

const smallBadge = {
  background: '#f1f6fb',
  padding: '6px 8px',
  borderRadius: 8,
  fontSize: 13,
  color: '#3b5460'
};

const actionBtnStyle = { padding: '10px 12px', borderRadius: 8, border: 'none', background: '#0077cc', color: 'white', cursor: 'pointer' };

const investmentItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px",
  background: "white",
  borderRadius: "8px",
  marginBottom: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};

const errorMessageStyle = {
  background: "#f8d7da",
  color: "#721c24",
  padding: "14px 20px",
  borderRadius: "8px",
  marginBottom: "20px",
  fontSize: "15px",
  fontWeight: "500",
  border: "1px solid #f5c6cb",
};

const statsSectionStyle = {
  padding: "40px",
  background: "#f8fbff",
  borderTop: "1px solid #e3f0fd",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
};

const statBoxStyle = {
  background: "white",
  padding: "24px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0, 119, 204, 0.08)",
};

const statValueStyle = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#0077cc",
  marginBottom: "8px",
};

const statLabelStyle = {
  fontSize: "14px",
  color: "#666",
  fontWeight: "500",
};

// (no duplicate investmentItemStyle)
