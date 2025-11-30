import React, { useEffect, useState } from "react";

const defaultAdvisors = [
  {
    id: 1,
    name: "Nirav Mehta",
    role: "Certified Mutual Fund Advisor",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    experience: "8 years",
    rating: 4.8,
    expertise: "Equity & Index Funds",
    clients: 150,
  },
  {
    id: 2,
    name: "Pooja Sharma",
    role: "Financial Planner",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    experience: "6 years",
    rating: 4.7,
    expertise: "Debt & Hybrid Funds",
    clients: 110,
  },
];

export default function AdvisorSection() {
  const [advisors, setAdvisors] = useState(defaultAdvisors);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("advisors");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) setAdvisors(parsed);
      }
    } catch (err) {
      // ignore parse errors and keep defaults
    }
  }, []);

  function handleBook(advisor) {
    // simple UX: open mail client if advisor has an email, otherwise copy name to clipboard
    if (advisor.email) {
      window.location.href = `mailto:${advisor.email}?subject=Requesting%20a%20Consultation`;
      return;
    }
    try {
      navigator.clipboard && navigator.clipboard.writeText(advisor.name);
      alert(`${advisor.name} copied to clipboard. Share this with your support team to schedule.`);
    } catch (e) {
      alert("Please contact support to schedule a session.");
    }
  }

  return (
    <div style={sectionBackdrop}>
      <div style={sectionHeader}>
        <h1 className="advisor-zone-title" style={{
          fontWeight: 900,
          letterSpacing: 1.2,
          fontSize: 33,
          margin: 0
        }}>
          Advisor Zone
        </h1>
        <div style={{
          fontSize: 18,
          color: "#333",
          marginTop: 7,
        }}>
          Your trusted advisory panel—get personalized recommendations from certified experts.
        </div>
      </div>
      <div style={advisorListWrapper}>
        {advisors.map(advisor => (
          <div key={advisor.id} style={advisorCard}>
            <img src={advisor.avatar} alt={advisor.name} style={{
              width: 66, height: 66, borderRadius: "50%", marginBottom: 16, boxShadow: "0 2px 10px #b0cff833"
            }} />
            <div style={{ fontSize: 19, fontWeight: 700, color: "#232d3d" }}>{advisor.name}</div>
            <div style={{ fontSize: 14, margin: "3px 0 10px 0", color: "#2a7abe" }}>{advisor.role}</div>
            {advisor.experience && (
              <div style={{ fontSize: 15, color: "#444", marginBottom: 8 }}>
                <strong>Experience:</strong> {advisor.experience}
              </div>
            )}
            {advisor.expertise && (
              <div style={{ fontSize: 15, color: "#444", marginBottom: 8 }}>
                <strong>Expertise:</strong> {advisor.expertise}
              </div>
            )}
            <div style={{
              display: "flex", justifyContent: "center", alignItems: "center", gap: 10
            }}>
              <span style={{
                background: "#edf6ff", color: "#0077cc", borderRadius: 8, padding: "2px 12px", fontWeight: 600, fontSize: 14
              }}>
                {advisor.rating ?? "--"} ★
              </span>
              <span style={{
                background: "#f2f2f2", color: "#2c2c2c", borderRadius: 8, padding: "2px 12px", fontWeight: 500, fontSize: 14
              }}>
                {advisor.clients ?? "--"} Clients
              </span>
            </div>
            <button style={bookBtn} onClick={() => handleBook(advisor)}>Book a Session</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const sectionBackdrop = {
  minHeight: "100vh",
  padding: "38px 0",
  background: "linear-gradient(130deg,#fafdff 70%,#e4f3ff 100%)"
};

const sectionHeader = {
  maxWidth: 670,
  margin: "0 auto 34px auto",
  textAlign: "center",
  padding: "28px 0 5px 0"
};

const advisorListWrapper = {
  display: "flex",
  flexWrap: "wrap",
  gap: 30,
  justifyContent: "center"
};

const advisorCard = {
  background: "#fff",
  borderRadius: 15,
  boxShadow: "0 4px 18px #87bfff18",
  padding: "34px 35px 23px 35px",
  minWidth: 285,
  maxWidth: 295,
  margin: "10px 3vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const bookBtn = {
  marginTop: 16,
  background: "#0077cc",
  color: "white",
  border: "none",
  borderRadius: 7,
  padding: "10px 27px",
  fontSize: 17,
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 2px 8px #0077cc18"
};
