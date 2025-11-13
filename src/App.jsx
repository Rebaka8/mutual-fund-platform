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

function getUserName(email) {
  if (!email) return "";
  return email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/^./, s => s.toUpperCase());
}
function getUserRole(email) {
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
    const storedUser = sessionStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user.email);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        sessionStorage.removeItem("currentUser");
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    setCurrentUser(null);
    setAuthMode("landing");
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
              <LoginPage onBack={() => setAuthMode("landing")} onLogin={setCurrentUser} />
            ) : (
              <SignUpPage onBack={() => setAuthMode("landing")} onSignUp={setCurrentUser} />
            )
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
      <div className="app-container">
        <header
          style={{
            background: "#0077cc",
            color: "white",
            display: "flex",
            alignItems: "center",
            padding: "12px 36px",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={Logo}
              alt="Logo"
              style={{
                height: 38,
                width: 38,
                borderRadius: 8,
                marginRight: 14,
                objectFit: "contain",
                background: "white",
                boxShadow: "0 2px 8px #0077cc"
              }}
            />
            <span style={{ fontWeight: 800, fontSize: 24, color: "white" }}>
              Mutual Fund Platform
            </span>
            <h3 style={{ margin: "0 0 0 18px", fontWeight: 600 }}>
              | Welcome, {getUserName(currentUser)}{userRole && ` (${userRole})`}
            </h3>
          </div>
          <nav style={{ display: "flex", alignItems: "center" }}>
            {userRole === "admin" && (
              <Link style={navLinkStyle} to="/admin">Admin Panel</Link>
            )}
            <Link style={navLinkStyle} to="/investor">Investor Dashboard</Link>
            <Link style={navLinkStyle} to="/advisor">Advisor Section</Link>
            <Link style={navLinkStyle} to="/analyst">Data Analyst</Link>
            <Link style={navLinkStyle} to="/profile">Profile</Link>
            <button
              style={{
                marginLeft: "30px",
                background: "#d12c2c",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "8px 22px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </nav>
        </header>
        <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
          <Routes>
            <Route path="/" element={<Navigate to={`/${userRole}`} />} />
            <Route path="/admin" element={<AdminPanel currentUser={currentUser} />} />
            <Route path="/investor" element={<InvestorDashboard />} />
            <Route path="/advisor" element={<AdvisorSection />} />
            <Route path="/analyst" element={<DataAnalystDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
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
