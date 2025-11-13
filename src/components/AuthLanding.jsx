import React from "react";
import Logo from "./Logo.png";

export default function AuthLanding({ onLogin, onSignup }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #e3f0fd 0%, #c8e5fa 100%)",
      fontFamily: "Inter,Roboto,sans-serif",
    }}>
      <div style={{
        background: "white",
        padding: "44px 36px 34px 36px",
        borderRadius: 15,
        boxShadow: "0 8px 32px #0077cc33",
        textAlign: "center",
        minWidth: 320,
        maxWidth: 350,
        margin: "0 20px"
      }}>
        <img
          src={Logo}
          alt="Logo"
          style={{
            width: "85px",
            height: "85px",
            objectFit: "contain",
            borderRadius: "50%",
            margin: "0 auto 16px auto",
            boxShadow: "0 2px 12px #0077cc22",
            display: "block"
          }}
        />
        <h1 style={{
          color: "#0077cc",
          fontSize: 26,
          fontWeight: 800,
          marginBottom: 16,
          letterSpacing: 1.5
        }}>
          Mutual Fund Platform
        </h1>
        <div style={{ marginBottom: 22, color: "#444", fontSize: 18 }}>
          Explore, track & invest with ease!
        </div>
        <button
          style={mainButton}
          onClick={onLogin}
        >Login</button>
        <button
          style={{ ...mainButton, background: "#f5faff", color: "#0077cc", border: "1.5px solid #0077cc", marginTop: 16 }}
          onClick={onSignup}
        >Sign Up</button>
      </div>
      <div style={{ color: "#999", fontSize: 13, marginTop: 40 }}>
        © {new Date().getFullYear()} Mutual Fund Platform
      </div>
    </div>
  );
}

const mainButton = {
  width: "100%",
  padding: "11px 0",
  fontSize: 18,
  background: "#0077cc",
  color: "white",
  borderRadius: "7px",
  border: "none",
  boxShadow: "0 2px 8px #0077cc33",
  fontWeight: 600,
  cursor: "pointer",
  marginTop: 2
};
