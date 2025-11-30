import React, { useState } from "react";
import Logo from "./Logo.png";

export default function SignUpPage({ onSignUp, onBack }) {
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignUp = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!email || !fullname || !password) {
      setError("Please fill all the fields.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Sanitize fullname input
    const sanitizedFullname = fullname.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

    // Get existing users from session storage
    let users = [];
    try {
      const usersData = sessionStorage.getItem("users");
      users = usersData ? JSON.parse(usersData) : [];
    } catch (err) {
      console.error("Error parsing users from sessionStorage:", err);
      setError("Storage error. Please try again.");
      return;
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      setError("User with this email already exists.");
      return;
    }

    // Create new user (never store plain password in production)
    const newUser = { 
      email: email.trim().toLowerCase(), 
      fullname: sanitizedFullname, 
      password // TODO: Hash password server-side in production
    };

    // Save to storage
    try {
      users.push(newUser);
      sessionStorage.setItem("users", JSON.stringify(users));
      
      setSuccess("Account created successfully! Redirecting to login...");
      
      // Auto-login after 1.5 seconds
      setTimeout(() => {
        sessionStorage.setItem("currentUser", JSON.stringify(newUser));
        onSignUp && onSignUp(email);
      }, 1500);
    } catch (err) {
      console.error("Error saving user to sessionStorage:", err);
      setError("Failed to create account. Please try again.");
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
          alt="Finex Logo"
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
          Sign Up
        </h2>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            style={inputStyle}
            autoFocus
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={!email || !fullname || !password || error}
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
              opacity: (!email || !fullname || !password || error) ? 0.6 : 1,
            }}
          >
            Sign Up
          </button>
        </form>

        {(error || success) && (
          <div
            style={{
              marginTop: 15,
              color: error ? "#d12c2c" : "#058c44",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {error || success}
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
            fontSize: 15,
          }}
          onClick={onBack}
          type="button"
        >
          ← Back
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
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export { inputStyle };
