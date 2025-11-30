import React, { useState } from "react";
import Logo from "./Logo.png";

export default function LoginPage({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // Get stored users from local storage
    const usersData = localStorage.getItem("users");
    const users = usersData ? JSON.parse(usersData) : [];
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Store current logged-in user in localStorage for persistence
      localStorage.setItem("currentUser", JSON.stringify(user));
      // Persist user to registeredUsers so admin can see them later
      try {
        const regKey = 'registeredUsers';
        // prefer localStorage for persistence across browser sessions
        const stored = localStorage.getItem(regKey);
        const regUsers = stored ? JSON.parse(stored) : [];
        const exists = regUsers.some(u => u.email === user.email);
        if (!exists) {
          const newUser = {
            name: user.name || user.email.split('@')[0],
            role: user.role || 'Investor',
            email: user.email,
            registeredOn: new Date().toISOString().slice(0,10),
            status: 'Active'
          };
          regUsers.push(newUser);
          // write to localStorage for persistent admin visibility
          localStorage.setItem(regKey, JSON.stringify(regUsers));
        }
      } catch (err) {
        // non-fatal: ignore storage errors
        console.warn('Could not persist registered user', err);
      }
      onLogin && onLogin(email);
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e3f0fd 0%, #c8e5fa 100%)",
        fontFamily: "Inter,Roboto,sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px 34px 30px 34px",
          borderRadius: 15,
          boxShadow: "0 8px 32px #0077cc33",
          minWidth: 320,
          maxWidth: 360,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "contain",
            borderRadius: "50%",
            margin: "0 auto 10px auto",
            boxShadow: "0 2px 10px #0077cc22",
            display: "block",
          }}
        />
        <h2
          style={{
            color: "#0077cc",
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Welcome Back!
        </h2>
        <div style={{ marginBottom: 18, color: "#444", fontSize: 16 }}>
          Please sign in with your email and password
        </div>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            autoFocus
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button
            type="submit"
            style={{
              ...inputStyle,
              background: "#0077cc",
              color: "white",
              fontWeight: 600,
              fontSize: 18,
              cursor: "pointer",
              marginTop: 12,
              width: "100%",
              border: "none",
              boxShadow: "0 2px 6px #0077cc1a",
            }}
          >
            Login
          </button>
        </form>
        {error && (
          <div style={{ marginTop: 15, color: "#d12c2c", fontSize: 14 }}>
            {error}
          </div>
        )}
        <button
          style={{
            background: "none",
            color: "#0077cc",
            border: "none",
            marginTop: "18px",
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={onBack}
        >
          &larr; Back
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  marginTop: 12,
  marginBottom: 2,
  padding: "11px 12px",
  borderRadius: "8px",
  border: "1.5px solid #c4e1f7",
  fontSize: 17,
  outline: "none",
  background: "#f5fbff",
};
