// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AuthLanding from "./components/AuthLanding";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import AdminPanel from "./components/AdminPanel";
import InvestorDashboard from "./components/InvestorDashboard";
import AdvisorSection from "./components/AdvisorSection";
import DataAnalystDashboard from "./components/DataAnalystDashboard";
import ProfilePage from "./components/ProfilePage";
import Logo from "./components/Logo.png"; // Adjust path as needed

function getUserName(user) {
  if (!user) return "";
  const email = typeof user === 'string' ? user : (user.email || user.fullname || user.name || '');
  if (!email) return "";
  const base = (email.includes('@') ? email.split('@')[0] : email).replace(/[^a-zA-Z0-9]/g, ' ');
  return base.charAt(0).toUpperCase() + base.slice(1);
}
function getUserRole(user) {
  if (!user) return "investor";
  const email = typeof user === 'string' ? user : (user.email || '');
  if (!email) return "investor";
  if (email === "rebakameda@gmail.com") return "admin";
  if (email === "userb@example.com") return "advisor";
  if (email === "userc@example.com") return "analyst";
  return "investor";
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("landing");
  const userRole = getUserRole(currentUser);

  // Check for existing session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (typeof parsed === 'string') setCurrentUser(parsed);
        else if (parsed && parsed.email) setCurrentUser(parsed.email);
        else if (parsed && (parsed.fullname || parsed.name)) setCurrentUser(parsed.fullname || parsed.name);
        else setCurrentUser(null);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  // Safe setter: accept either an email string or a user object and normalize to email string
  const safeSetCurrentUser = (val) => {
    if (!val) {
      try { localStorage.removeItem('currentUser'); } catch (e) { }
      setCurrentUser(null);
      return;
    }
    if (typeof val === 'string') {
      setCurrentUser(val);
      return;
    }
    if (typeof val === 'object') {
      if (val.email) { setCurrentUser(val.email); return; }
      if (val.fullname) { setCurrentUser(val.fullname); return; }
      if (val.name) { setCurrentUser(val.name); return; }
      try { setCurrentUser(JSON.stringify(val)); } catch (e) { setCurrentUser(String(val)); }
      return;
    }
    setCurrentUser(String(val));
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setAuthMode("landing");
  };

  // UI states for header widgets
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [themeDark, setThemeDark] = useState(false);
  const [notifications, setNotifications] = useState([]); // array of {id, message, time, type}
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);

  const addNotification = (message, type = 'info') => {
    const n = { id: Date.now(), message, time: new Date().toLocaleString(), type };
    setNotifications(prev => [n, ...prev].slice(0, 50));
  };

  const toggleTheme = () => {
    setThemeDark(d => !d);
    // simple body class toggle for optional theme css hooks
    try {
      if (!themeDark) document.documentElement.classList.add('dark-theme');
      else document.documentElement.classList.remove('dark-theme');
    } catch (e) { }
  };

  return (
    <Router>
      {!currentUser ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={
            authMode === "landing" ? (
              <AuthLanding onLogin={() => setAuthMode("login")} onSignup={() => setAuthMode("signup")} />
            ) : authMode === "login" ? (
              <LoginPage onBack={() => setAuthMode("landing")} onLogin={(v) => safeSetCurrentUser(v)} />
            ) : (
              <SignUpPage onBack={() => setAuthMode("landing")} onSignUp={(v) => safeSetCurrentUser(v)} />
            )
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <div className="app-container">
          <header
            style={{
              background: themeDark ? "#0b1220" : "#0077cc",
              color: "white",
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              justifyContent: "space-between",
              position: 'relative'
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Menu widget button (shows navigation links in a popup) */}
              <button aria-label="Open menu" onClick={() => setMenuOpen(m => !m)} style={{
                background: 'transparent', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer', padding: 8, borderRadius: 8
              }}>☰</button>

              <img
                src={Logo}
                alt="Logo"
                style={{
                  height: 36,
                  width: 36,
                  borderRadius: 8,
                  marginRight: 6,
                  objectFit: "contain",
                  background: "white",
                  boxShadow: themeDark ? '0 2px 8px #00000055' : "0 2px 8px #0077cc"
                }}
              />

              <div>
                <div style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>Mutual Fund Platform</div>
                <div style={{ fontSize: 13, opacity: 0.95 }}>Welcome, {getUserName(currentUser)}{userRole && ` (${userRole})`}</div>
              </div>

              {menuOpen && (
                <div style={{ position: 'absolute', top: '56px', left: 12, background: '#fff', color: '#222', borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: 12, zIndex: 60, minWidth: 220 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {userRole === 'admin' && <Link to="/admin" style={{ textDecoration: 'none', color: '#0b6bd6', fontWeight: 600 }} onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
                    <Link to="/investor" style={{ textDecoration: 'none', color: '#0b6bd6', fontWeight: 600 }} onClick={() => setMenuOpen(false)}>Investor Dashboard</Link>
                    <Link to="/advisor" style={{ textDecoration: 'none', color: '#0b6bd6', fontWeight: 600 }} onClick={() => setMenuOpen(false)}>Advisor Section</Link>
                    <Link to="/analyst" style={{ textDecoration: 'none', color: '#0b6bd6', fontWeight: 600 }} onClick={() => setMenuOpen(false)}>Data Analyst</Link>
                    <button onClick={() => { setMenuOpen(false); handleLogout(); }} style={{ border: 'none', background: '#d12c2c', color: 'white', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', marginTop: 6 }}>Logout</button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Notification widget */}
              <div style={{ position: 'relative' }}>
                <button aria-label="Notifications" onClick={() => setNotifPanelOpen(p => !p)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18 }}>
                  🔔
                </button>
                {notifications.length > 0 && (
                  <div style={{ position: 'absolute', top: -6, right: -6, background: '#ff6b6b', color: 'white', borderRadius: 10, padding: '2px 6px', fontSize: 12, fontWeight: 700 }}>{notifications.length}</div>
                )}

                {notifPanelOpen && (
                  <div style={{ position: 'absolute', right: 0, top: 36, background: '#fff', color: '#222', borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: 12, zIndex: 70, minWidth: 320 }}>
                    <div style={{ fontWeight: 800, marginBottom: 8 }}>Notifications</div>
                    <div style={{ maxHeight: 300, overflow: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ color: '#666', padding: 18, textAlign: 'center' }}>No notifications</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} style={{ padding: '8px 6px', borderBottom: '1px solid #f1f3f5', display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                            <div>
                              <div style={{ fontWeight: 700 }}>{n.message}</div>
                              <div style={{ fontSize: 12, color: '#888' }}>{n.time}</div>
                            </div>
                            <div style={{ alignSelf: 'center', fontSize: 12, color: n.type === 'error' ? '#d12c2c' : '#0b6bd6' }}>{n.type.toUpperCase()}</div>
                          </div>
                        ))
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                      <button onClick={() => setNotifications([])} style={{ border: 'none', background: '#f1f3f5', padding: '8px 10px', borderRadius: 8, cursor: 'pointer' }}>Clear</button>
                      <button onClick={() => setNotifPanelOpen(false)} style={{ border: 'none', background: '#0077cc', color: 'white', padding: '8px 10px', borderRadius: 8, cursor: 'pointer' }}>Close</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme toggle (left of profile) */}
              <button aria-label="Toggle theme" onClick={toggleTheme} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 8px', borderRadius: 8, color: 'white', cursor: 'pointer' }}>
                {themeDark ? '🌙' : '🌤'}
              </button>

              {/* Profile avatar (rightmost) */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setProfileOpen(p => !p)} style={{ background: 'white', borderRadius: '50%', width: 40, height: 40, border: 'none', cursor: 'pointer', overflow: 'hidden', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ display: 'inline-flex', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0b6bd6', fontSize: 16, lineHeight: '40px' }}>{getUserName(currentUser)[0] || 'U'}</span>
                </button>

                {profileOpen && (
                  <div style={{ position: 'absolute', right: 0, top: 48, background: '#fff', color: '#222', borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: 12, zIndex: 80, minWidth: 220 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0b6bd6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{getUserName(currentUser)[0] || 'U'}</div>
                      <div>
                        <div style={{ fontWeight: 800 }}>{getUserName(currentUser)}</div>
                        <div style={{ fontSize: 12, color: '#657786' }}>Member since 2025</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <Link to="/profile" style={{ textDecoration: 'none', color: '#0b6bd6' }} onClick={() => setProfileOpen(false)}>Profile</Link>
                      <Link to="/investor" style={{ textDecoration: 'none', color: '#0b6bd6' }} onClick={() => setProfileOpen(false)}>Investor Dashboard</Link>
                      <Link to="/advisor" style={{ textDecoration: 'none', color: '#0b6bd6' }} onClick={() => setProfileOpen(false)}>Advisor Section</Link>
                      <Link to="/analyst" style={{ textDecoration: 'none', color: '#0b6bd6' }} onClick={() => setProfileOpen(false)}>Data Analyst</Link>
                      <button onClick={() => { setProfileOpen(false); handleLogout(); }} style={{ border: 'none', background: '#d12c2c', color: 'white', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', marginTop: 6 }}>Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
          <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
            <Routes>
              <Route path="/" element={<Navigate to={`/${userRole}`} />} />
              <Route path="/admin" element={<AdminPanel currentUser={currentUser} onNotify={addNotification} />} />
              <Route path="/investor" element={<InvestorDashboard onNotify={addNotification} />} />
              <Route path="/advisor" element={<AdvisorSection onNotify={addNotification} />} />
              <Route path="/analyst" element={<DataAnalystDashboard onNotify={addNotification} />} />
              <Route path="/profile" element={<ProfilePage onNotify={addNotification} />} />
              <Route path="*" element={<Navigate to={`/${userRole}`} />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  );
}

const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  marginLeft: "26px",
  fontWeight: 500,
  fontSize: "18px",
  padding: "7px 14px",
  borderRadius: "7px",
  transition: "background 0.25s"
};

export default App;
