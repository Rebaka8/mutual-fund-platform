import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Logo from "./Logo.png";

// User role check utility function (fixed stray syntax error)
function getUserRole(email) {
  if (!email) return "investor";
  if (email === "rebakameda@gmail.com") return "admin";
  if (email === "userb@example.com") return "advisor";
  if (email === "userc@example.com") return "analyst";
  return "investor";
}

export default function AdminPanel({ currentUser }) {
  const storedCurrent = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
  const parsedStored = storedCurrent ? JSON.parse(storedCurrent) : null;
  const currentEmail = typeof currentUser === 'string'
    ? currentUser
    : (currentUser && currentUser.email) || (parsedStored && parsedStored.email) || null;

  const userRole = getUserRole(currentEmail);
  if (userRole !== "admin") {
    return <Navigate to={`/${userRole}`} />;
  }

  // Users: load from localStorage only (no fake demo users)
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem('registeredUsers');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedInvestments, setSelectedInvestments] = useState([]);

  useEffect(() => {
    // no-op: we keep registeredUsers only if explicitly created by signups
  }, []);

  const viewInvestments = (user) => {
    setSelectedUser(user);
    const invKey = `investments_${user.email}`;
    const stored = localStorage.getItem(invKey);
    try {
      const arr = stored ? JSON.parse(stored) : [];
      setSelectedInvestments(arr);
    } catch (e) {
      setSelectedInvestments([]);
    }
  };

  const toggleStatus = (email) => {
    const updated = users.map(u => (u.email === email ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
    setUsers(updated);
    localStorage.setItem('registeredUsers', JSON.stringify(updated));
  };
  // Market watch: derive a small list of scheme codes to show latest NAVs
  const [marketWatch, setMarketWatch] = useState([]);
  useEffect(() => {
    // No external API: show popular scheme codes with local fallback values
    const popular = ['117717','125497','140006','120304'];
    const mw = popular.map((code) => ({ symbol: code, price: null, change: null }));
    setMarketWatch(mw);
    return () => {};
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, system-ui, Arial', background: '#f4f7fb' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: '#07122b', color: 'white', padding: 20, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <img src={Logo} alt="logo" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'contain', background: 'white' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Mutual Fund</div>
            <div style={{ opacity: 0.8, fontSize: 12 }}>Admin Console</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['Dashboard', 'Orders', 'Funds', 'Users', 'Reports', 'Settings'].map((item) => (
            <div key={item} style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer', color: '#cfe6ff' }}>
              {item}
            </div>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', fontSize: 13, opacity: 0.85 }}>
          <div style={{ marginBottom: 6 }}>Signed in as</div>
          <div style={{ fontWeight: 700 }}>{currentEmail || 'admin@demo'}</div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: 20, overflow: 'auto' }}>
        {/* Topbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 style={{ margin: 0, color: '#07122b' }}>Dashboard</h2>
            <div style={{ color: '#657786' }}>Overview of platform performance</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input placeholder="Search users, funds or orders" style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #e6eef8', minWidth: 320 }} />
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>🔔</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', background: '#fff', borderRadius: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e7f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>RM</div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          <div style={{ background: 'linear-gradient(90deg,#0b6bd6,#0b9bd6)', color: 'white', padding: 16, borderRadius: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Portfolio Value</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>₹ 12,34,567</div>
            <div style={{ marginTop: 6, opacity: 0.9 }}>AUM across investors</div>
          </div>

          <div style={{ background: '#fff', padding: 16, borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: '#657786' }}>Today</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>+₹ 12,345</div>
            <div style={{ marginTop: 6, color: '#9aa9b8' }}>Net inflows</div>
          </div>

          <div style={{ background: '#fff', padding: 16, borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: '#657786' }}>Funds</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>128</div>
            <div style={{ marginTop: 6, color: '#9aa9b8' }}>Active schemes</div>
          </div>

          <div style={{ background: '#fff', padding: 16, borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: '#657786' }}>New Signups</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>54</div>
            <div style={{ marginTop: 6, color: '#9aa9b8' }}>Last 7 days</div>
          </div>
        </div>

        {/* Market watch */}
        <div style={{ background: '#07122b', color: 'white', padding: 10, borderRadius: 8, marginBottom: 18, display: 'flex', gap: 14, alignItems: 'center' }}>
          {marketWatch.map((m) => (
            <div key={m.symbol} style={{ minWidth: 120 }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{m.symbol}</div>
              <div style={{ fontWeight: 700 }}>{m.price != null ? m.price.toLocaleString() : "--"}</div>
              <div style={{ fontSize: 12, color: m.change != null && m.change >= 0 ? '#00c48c' : '#ff6b6b' }}>
                {m.change != null ? `${m.change >= 0 ? '+' : ''}${m.change}%` : "--"}
              </div>
            </div>
          ))}
        </div>

        {/* Main grid: left = users/funds table, right = user details / charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>Users</h3>
              <div style={{ color: '#657786' }}>Manage registered accounts</div>
            </div>

            <div style={{ background: '#fff', borderRadius: 10, padding: 12 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#657786', fontSize: 13 }}>
                    <th style={{ padding: 10 }}>Name</th>
                    <th style={{ padding: 10 }}>Role</th>
                    <th style={{ padding: 10 }}>Status</th>
                    <th style={{ padding: 10 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.email} onClick={() => viewInvestments(u)} style={{ cursor: 'pointer', borderTop: '1px solid #f0f3f7' }}>
                      <td style={{ padding: 12 }}>{u.name}</td>
                      <td style={{ padding: 12 }}>{u.role}</td>
                      <td style={{ padding: 12, color: u.status === 'Active' ? '#058c44' : '#d12c2c', fontWeight: 700 }}>{u.status}</td>
                      <td style={{ padding: 12 }}>
                        <button onClick={(e) => { e.stopPropagation(); toggleStatus(u.email); }} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: u.status === 'Active' ? '#ffdede' : '#0b6bd6', color: u.status === 'Active' ? '#d12c2c' : 'white', cursor: 'pointer' }}>{u.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside>
            <div style={{ background: '#fff', borderRadius: 10, padding: 14, marginBottom: 12 }}>
              <h4 style={{ margin: 0, color: '#07122b' }}>{selectedUser ? `${selectedUser.name}` : 'User Details'}</h4>
              {selectedUser ? (
                <div style={{ marginTop: 10 }}>
                  <div style={{ marginBottom: 6 }}><strong>Email:</strong> {selectedUser.email}</div>
                  <div style={{ marginBottom: 6 }}><strong>Role:</strong> {selectedUser.role}</div>
                  <div style={{ marginBottom: 6 }}><strong>Registered:</strong> {selectedUser.registeredOn}</div>
                  <div style={{ marginBottom: 8 }}><strong>Status:</strong> <span style={{ color: selectedUser.status === 'Active' ? '#058c44' : '#d12c2c', fontWeight: 700 }}>{selectedUser.status}</span></div>

                  <div style={{ height: 120, borderRadius: 8, background: '#f6f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#657786' }}>Chart placeholder</div>
                </div>
              ) : (
                <div style={{ marginTop: 10, color: '#657786' }}>Select a user to inspect investments and profile.</div>
              )}
            </div>

            <div style={{ background: '#fff', borderRadius: 10, padding: 12 }}>
              <h4 style={{ marginTop: 0 }}>Quick Actions</h4>
              <button style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: 'none', background: '#0b6bd6', color: 'white', marginBottom: 8 }}>Create Fund</button>
              <button style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e6eef8', background: 'white' }}>Export CSV</button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
