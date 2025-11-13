import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={pageContainer}>
      {/* Hero Section */}
      <section style={heroSection}>
        <div style={heroContent}>
          <img src={Logo} alt="Logo" style={heroLogo} />
          <h1 style={heroTitle}>Mutual Fund Platform</h1>
          <p style={heroSubtitle}>
            Your gateway to smart investing. Explore, track, and grow your wealth with confidence.
          </p>
          <div style={ctaButtons}>
            <button style={primaryButton} onClick={() => navigate("/auth")}>
              Get Started
            </button>
            <button style={secondaryButton} onClick={() => navigate("/auth")}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={featuresSection}>
        <h2 style={sectionTitle}>Why Choose Us?</h2>
        <div style={featuresGrid}>
          <div style={featureCard}>
            <div style={featureIcon}>📊</div>
            <h3 style={featureTitle}>Real-Time Data</h3>
            <p style={featureDescription}>
              Access live mutual fund NAV data and track performance in real-time with interactive charts.
            </p>
          </div>
          
          <div style={featureCard}>
            <div style={featureIcon}>💰</div>
            <h3 style={featureTitle}>Smart Investment</h3>
            <p style={featureDescription}>
              Calculate returns, compare funds, and make informed decisions with our powerful tools.
            </p>
          </div>
          
          <div style={featureCard}>
            <div style={featureIcon}>🎯</div>
            <h3 style={featureTitle}>Portfolio Tracking</h3>
            <p style={featureDescription}>
              Monitor your investments, track growth, and manage your portfolio all in one place.
            </p>
          </div>
          
          <div style={featureCard}>
            <div style={featureIcon}>👥</div>
            <h3 style={featureTitle}>Expert Advisors</h3>
            <p style={featureDescription}>
              Connect with certified financial advisors to get personalized investment guidance.
            </p>
          </div>
          
          <div style={featureCard}>
            <div style={featureIcon}>📈</div>
            <h3 style={featureTitle}>Analytics Dashboard</h3>
            <p style={featureDescription}>
              Visualize trends, analyze performance, and generate comprehensive reports.
            </p>
          </div>
          
          <div style={featureCard}>
            <div style={featureIcon}>🔒</div>
            <h3 style={featureTitle}>Secure & Private</h3>
            <p style={featureDescription}>
              Your data is stored locally with session-based security. No server, no worries.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={howItWorksSection}>
        <h2 style={sectionTitle}>How It Works</h2>
        <div style={stepsContainer}>
          <div style={stepCard}>
            <div style={stepNumber}>1</div>
            <h3 style={stepTitle}>Sign Up</h3>
            <p style={stepDescription}>
              Create your free account in seconds. No credit card required.
            </p>
          </div>
          
          <div style={stepArrow}>→</div>
          
          <div style={stepCard}>
            <div style={stepNumber}>2</div>
            <h3 style={stepTitle}>Explore Funds</h3>
            <p style={stepDescription}>
              Browse through our curated list of top-performing mutual funds.
            </p>
          </div>
          
          <div style={stepArrow}>→</div>
          
          <div style={stepCard}>
            <div style={stepNumber}>3</div>
            <h3 style={stepTitle}>Invest Smart</h3>
            <p style={stepDescription}>
              Track your investments and watch your portfolio grow over time.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={statsSection}>
        <div style={statsGrid}>
          <div style={statItem}>
            <div style={statValue}>11+</div>
            <div style={statLabel}>Mutual Funds</div>
          </div>
          <div style={statItem}>
            <div style={statValue}>100%</div>
            <div style={statLabel}>Free to Use</div>
          </div>
          <div style={statItem}>
            <div style={statValue}>4</div>
            <div style={statLabel}>User Roles</div>
          </div>
          <div style={statItem}>
            <div style={statValue}>24/7</div>
            <div style={statLabel}>Access</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={ctaSection}>
        <h2 style={ctaTitle}>Ready to Start Your Investment Journey?</h2>
        <p style={ctaSubtitle}>
          Join thousands of smart investors who trust our platform for their financial growth.
        </p>
        <button style={ctaPrimaryButton} onClick={() => navigate("/auth")}>
          Get Started Now
        </button>
      </section>

      {/* Footer */}
      <footer style={footer}>
        <p style={footerText}>© {new Date().getFullYear()} Mutual Fund Platform. All rights reserved.</p>
        <p style={footerLinks}>
          <span style={footerLink}>Privacy Policy</span> • 
          <span style={footerLink}> Terms of Service</span> • 
          <span style={footerLink}> Contact Us</span>
        </p>
      </footer>
    </div>
  );
}

// Styles
const pageContainer = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f5f9ff 0%, #e3f0fd 100%)",
  fontFamily: "Inter, Roboto, sans-serif",
};

const heroSection = {
  padding: "80px 20px 120px",
  textAlign: "center",
  background: "linear-gradient(135deg, #0077cc 0%, #005fa3 100%)",
  color: "white",
};

const heroContent = {
  maxWidth: "800px",
  margin: "0 auto",
};

const heroLogo = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  marginBottom: "30px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
  background: "white",
  padding: "10px",
};

const heroTitle = {
  fontSize: "48px",
  fontWeight: "800",
  marginBottom: "20px",
  letterSpacing: "1px",
};

const heroSubtitle = {
  fontSize: "20px",
  marginBottom: "40px",
  opacity: 0.95,
  lineHeight: "1.6",
};

const ctaButtons = {
  display: "flex",
  gap: "20px",
  justifyContent: "center",
  flexWrap: "wrap",
};

const primaryButton = {
  padding: "16px 40px",
  fontSize: "18px",
  fontWeight: "600",
  background: "white",
  color: "#0077cc",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
  transition: "transform 0.2s ease",
};

const secondaryButton = {
  padding: "16px 40px",
  fontSize: "18px",
  fontWeight: "600",
  background: "transparent",
  color: "white",
  border: "2px solid white",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "background 0.3s ease",
};

const featuresSection = {
  padding: "80px 20px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const sectionTitle = {
  fontSize: "36px",
  fontWeight: "700",
  textAlign: "center",
  color: "#0077cc",
  marginBottom: "60px",
};

const featuresGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "30px",
};

const featureCard = {
  background: "white",
  padding: "40px 30px",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 119, 204, 0.1)",
  textAlign: "center",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const featureIcon = {
  fontSize: "48px",
  marginBottom: "20px",
};

const featureTitle = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#333",
  marginBottom: "15px",
};

const featureDescription = {
  fontSize: "16px",
  color: "#666",
  lineHeight: "1.6",
};

const howItWorksSection = {
  padding: "80px 20px",
  background: "white",
};

const stepsContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "20px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const stepCard = {
  background: "linear-gradient(135deg, #f5f9ff 0%, #e3f0fd 100%)",
  padding: "40px 30px",
  borderRadius: "16px",
  textAlign: "center",
  flex: "1",
  minWidth: "250px",
  maxWidth: "300px",
};

const stepNumber = {
  width: "60px",
  height: "60px",
  background: "#0077cc",
  color: "white",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 auto 20px",
};

const stepTitle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#333",
  marginBottom: "10px",
};

const stepDescription = {
  fontSize: "15px",
  color: "#666",
  lineHeight: "1.5",
};

const stepArrow = {
  fontSize: "40px",
  color: "#0077cc",
  fontWeight: "700",
};

const statsSection = {
  padding: "60px 20px",
  background: "linear-gradient(135deg, #0077cc 0%, #005fa3 100%)",
  color: "white",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "40px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const statItem = {
  textAlign: "center",
};

const statValue = {
  fontSize: "48px",
  fontWeight: "800",
  marginBottom: "10px",
};

const statLabel = {
  fontSize: "18px",
  opacity: 0.9,
};

const ctaSection = {
  padding: "80px 20px",
  textAlign: "center",
  maxWidth: "800px",
  margin: "0 auto",
};

const ctaTitle = {
  fontSize: "36px",
  fontWeight: "700",
  color: "#0077cc",
  marginBottom: "20px",
};

const ctaSubtitle = {
  fontSize: "18px",
  color: "#666",
  marginBottom: "40px",
  lineHeight: "1.6",
};

const ctaPrimaryButton = {
  padding: "18px 50px",
  fontSize: "20px",
  fontWeight: "700",
  background: "#0077cc",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  boxShadow: "0 4px 20px rgba(0, 119, 204, 0.3)",
  transition: "transform 0.2s ease",
};

const footer = {
  padding: "40px 20px",
  background: "#f8f8f8",
  textAlign: "center",
  borderTop: "1px solid #e0e0e0",
};

const footerText = {
  color: "#666",
  fontSize: "14px",
  marginBottom: "10px",
};

const footerLinks = {
  color: "#666",
  fontSize: "14px",
};

const footerLink = {
  cursor: "pointer",
  transition: "color 0.3s ease",
};
