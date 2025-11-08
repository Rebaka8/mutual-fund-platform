import React, { useState } from 'react';

function getUserName(email) {
  if (!email) return "";
  return email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/^./, s => s.toUpperCase());
}

function LoginPage({ onLogin }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [error, setError] = useState('');

  const generateOtp = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    alert(`Your OTP is: ${newOtp}`);
    setError('');
    setStep(2);
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      onLogin(email);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0077cc 55%, #f4f6f8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '36px 32px 32px 32px',
        borderRadius: "18px",
        boxShadow: '0 8px 32px #0077cc22',
        width: 360,
        maxWidth: '95vw'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="https://img.icons8.com/color/96/000000/lock-2.png" style={{ width: 54, height: 54 }} alt="" />
          <h2 style={{ color: "#0077cc", margin: "10px 0 0" }}>
            {step === 1 ? "Welcome Back!" : "OTP Verification"}
          </h2>
          <p style={{ color: '#555', marginTop: 10 }}>
            {step === 1 ? "Sign in to your Mutual Fund Platform" : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '12px', marginBottom: 28, borderRadius: '8px',
                border: '1px solid #ccc', fontSize: '17px', outline: 'none'
              }}
            />
            {error && <div style={{ color: 'red', marginBottom: 13 }}>{error}</div>}
            <button
              onClick={generateOtp}
              style={{
                width: '100%',
                padding: 13,
                border: 'none',
                borderRadius: 8,
                background: "#0077cc",
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
                boxShadow: "0 1px 8px #0077cc33",
                cursor: 'pointer'
              }}>
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              maxLength={6}
              style={{
                width: '100%', padding: '12px', marginBottom: 28, borderRadius: '8px',
                border: '1px solid #ccc', fontSize: '20px', letterSpacing: '5px', outline: 'none', textAlign: 'center'
              }}
            />
            {error && <div style={{ color: 'red', marginBottom: 13 }}>{error}</div>}
            <button
              onClick={verifyOtp}
              style={{
                width: '100%',
                padding: 13,
                border: 'none',
                borderRadius: 8,
                background: "#0077cc",
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
                boxShadow: "0 1px 8px #0077cc33",
                cursor: 'pointer'
              }}>
              Verify OTP
            </button>
            <div style={{ marginTop: 17 }}>
              <span style={{ color: '#0077cc', cursor: 'pointer' }} onClick={() => setStep(1)}>
                Resend OTP
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
