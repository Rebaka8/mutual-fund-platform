import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Logo from "./Logo.png";

// User role check utility function (same as in App.jsx, you can import if centralized)
function getUserRole(email) {
  if (!email) return "investor";
  if (email === "rebakameda@gmail.com") return "admin";
  if (email === "userb@example.com") return "advisor";
  if (email === "userc@example.com") return "analyst";
  return "investor";
}

export default function AdminPanel({ currentUser }) {
  // try to resolve currentUser email from prop or sessionStorage
  const storedCurrent = typeof window !== 'undefined' ? sessionStorage.getItem('currentUser') : null;
  const parsedStored = storedCurrent ? JSON.parse(storedCurrent) : null;
  const currentEmail = typeof currentUser === 'string'
    ? currentUser
    : (currentUser && currentUser.email) || (parsedStored && parsedStored.email) || null;

  // If not admin, redirect out
  const userRole = getUserRole(currentEmail);
  if (userRole !== "admin") {
    return <Navigate to={`/${userRole}`} />;
  }

  // Default demo users (used only if no stored users found)
  const defaultUsers = [
    { name: "Rebaka Meda", role: "Admin", email: "rebakameda@gmail.com", registeredOn: "2023-02-14", status: "Active" },
    { name: "Asha Rao", role: "Investor", email: "asha.rao@example.com", registeredOn: "2024-06-15", status: "Active" },
    { name: "Vikram Singh", role: "Investor", email: "vikram.singh@example.com", registeredOn: "2022-12-10", status: "Active" },
    { name: "Priya Patel", role: "Financial Advisor", email: "priya.patel@example.com", registeredOn: "2023-11-03", status: "Inactive" },
    { name: "Rajesh Kumar", role: "Data Analyst", email: "rajesh.kumar@example.com", registeredOn: "2025-03-27", status: "Active" }
  ];

  const [users, setUsers] = useState(() => {
    try {
      // prefer localStorage for persistent registered users
      const stored = localStorage.getItem('registeredUsers') || sessionStorage.getItem('registeredUsers');
      return stored ? JSON.parse(stored) : defaultUsers;
    } catch (e) {
      return defaultUsers;
    }
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedInvestments, setSelectedInvestments] = useState([]);

  // ensure there is a stored list for persistence across reloads
  useEffect(() => {
    // ensure a persisted list exists (prefer localStorage)
    if (!localStorage.getItem('registeredUsers') && !sessionStorage.getItem('registeredUsers')) {
      localStorage.setItem('registeredUsers', JSON.stringify(defaultUsers));
    }
  }, []);

  const viewInvestments = (user) => {
    setSelectedUser(user);
    const invKey = `investments_${user.email}`;
    const stored = sessionStorage.getItem(invKey);
    try {
      const arr = stored ? JSON.parse(stored) : [];
      setSelectedInvestments(arr);
    } catch (e) {
      setSelectedInvestments([]);
    }
  };

  const toggleStatus = (email) => {
    const updated = users.map(u => {
      if (u.email === email) {
        return { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return u;
    });
    setUsers(updated);
    sessionStorage.setItem('registeredUsers', JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "30px 0", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
        <img src={Logo} alt="Logo" style={{ width: 46, height: 46, borderRadius: 8, marginRight: 14, objectFit: 'contain' }} />
        <div>
          <h1 style={{ color: '#0077cc', fontSize: '2rem', margin: 0 }}>Admin Panel</h1>
          <div style={{ color: '#666', marginTop: 4 }}>Signed in as: <strong>{currentEmail || 'Unknown'}</strong></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 18 }}>
        <div>
          <div style={{ marginBottom: 12, color: '#444', fontSize: 16 }}>Registered users (click a row to view investments)</div>
          <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 16px #0077cc0f', background: '#fff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <thead>
                <tr style={{ background: '#0077cc', color: 'white' }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Registered On</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.email} onClick={() => viewInvestments(u)} style={{ cursor: 'pointer', background: u.status === 'Inactive' ? '#fff5f5' : 'white' }}>
                    <td style={tdStyle}>{u.name}</td>
                    <td style={tdStyle}>{u.role}</td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>{u.registeredOn}</td>
                    <td style={{ ...tdStyle, color: u.status === 'Active' ? '#058c44' : '#d12c2c', fontWeight: 700 }}>{u.status}</td>
                    <td style={tdStyle}>
                      <button onClick={(e) => { e.stopPropagation(); toggleStatus(u.email); }} style={{ background: u.status === 'Inactive' ? '#0077cc' : '#d12c2c', color: 'white', border: 'none', borderRadius: 7, padding: '6px 12px', fontWeight: 600, cursor: 'pointer' }}>{u.status === 'Inactive' ? 'Activate' : 'Deactivate'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 14, boxShadow: '0 2px 14px #0000000f' }}>
            <h3 style={{ marginTop: 0, color: '#0077cc' }}>{selectedUser ? `${selectedUser.name} — Profile` : 'User details'}</h3>
            {selectedUser ? (
              <div>
                <div style={{ marginBottom: 8 }}><strong>Email:</strong> {selectedUser.email}</div>
                <div style={{ marginBottom: 8 }}><strong>Role:</strong> {selectedUser.role}</div>
                <div style={{ marginBottom: 8 }}><strong>Registered:</strong> {selectedUser.registeredOn}</div>
                <div style={{ marginBottom: 12 }}><strong>Status:</strong> <span style={{ color: selectedUser.status === 'Active' ? '#058c44' : '#d12c2c', fontWeight: 700 }}>{selectedUser.status}</span></div>

                <h4 style={{ marginBottom: 8 }}>Investments</h4>
                {selectedInvestments.length > 0 ? (
                  <div style={{ maxHeight: 280, overflow: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f7f9fb' }}>
                          <th style={{ padding: '8px' }}>Fund</th>
                          <th style={{ padding: '8px' }}>Amount</th>
                          <th style={{ padding: '8px' }}>Date</th>
                          <th style={{ padding: '8px' }}>Current NAV</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvestments.map(inv => (
                          <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '8px' }}>{inv.fundName}</td>
                            <td style={{ padding: '8px' }}>₹{inv.amount.toFixed(2)}</td>
                            <td style={{ padding: '8px' }}>{new Date(inv.investmentDate).toLocaleDateString()}</td>
                            <td style={{ padding: '8px' }}>₹{inv.currentNAV ? inv.currentNAV.toFixed(2) : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ color: '#666' }}>No investments found for this user.</div>
                )}
              </div>
            ) : (
              <div style={{ color: '#666' }}>Select a user from the table to see profile and investments.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "13px 8px",
  fontWeight: 600,
  fontSize: 18,
  textAlign: "left"
};

const tdStyle = {
  padding: "11px 8px",
  fontWeight: 400,
  fontSize: 17,
  borderBottom: "1px solid #e7eaef"
};
