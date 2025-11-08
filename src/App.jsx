import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AdminPanel from "./components/AdminPanel";
import InvestorDashboard from "./components/InvestorDashboard";
import AdvisorSection from "./components/AdvisorSection";
import DataAnalystDashboard from "./components/DataAnalystDashboard";

// Just a helper that gets the user's name from email for the welcome message
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
  const userRole = getUserRole(currentUser);

  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }

  return (
    <Router>
      <div className="app-container">
        <header className="app-header" style={{
          background: "#004687",
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "18px 36px",
          justifyContent: "space-between"
        }}>
          <h3 style={{ margin: 0, fontWeight: 600 }}>
            Welcome, {getUserName(currentUser)}{userRole && ` (${userRole})`}
          </h3>
          <nav className="nav-menu">
            <Link style={navLinkStyle} to="/admin">Admin Panel</Link>
            <Link style={navLinkStyle} to="/investor">Investor Dashboard</Link>
            <Link style={navLinkStyle} to="/advisor">Advisor Section</Link>
            <Link style={navLinkStyle} to="/analyst">Data Analyst</Link>
            <button
              style={{
                marginLeft: "30px", background: "#d12c2c", color: "white", border: "none",
                borderRadius: 8, padding: "8px 22px", fontWeight: 600, cursor: "pointer"
              }}
              onClick={() => setCurrentUser(null)}
            >
              Logout
            </button>
          </nav>
        </header>
        <main className="app-main" style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
          <Routes>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/investor" element={<InvestorDashboard />} />
            <Route path="/advisor" element={<AdvisorSection />} />
            <Route path="/analyst" element={<DataAnalystDashboard />} />
            {/* Default route: send user to main page based on role */}
            <Route path="*" element={<Navigate to={`/${userRole}`} />} />
          </Routes>
        </main>
      </div>
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
