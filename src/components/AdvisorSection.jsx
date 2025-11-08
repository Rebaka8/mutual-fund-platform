import React, { useState } from 'react';

const articles = [
  {
    id: 1,
    title: 'Mutual Fund Risks Explained',
    content: (
      <>
        <b>Key risks every investor should know:</b>
        <ul style={{ marginTop: 12 }}>
          <li><b>Market Risk:</b> The value of fund holdings can fluctuate due to overall market movements or economic changes. Equity funds are most exposed to this.</li>
          <li><b>Interest Rate Risk:</b> Changes in interest rates impact bond prices in debt funds. When rates go up, bond prices — and debt fund NAVs — usually fall.</li>
          <li><b>Credit Risk:</b> If the companies/institutions in a debt fund default on payments, the fund loses value. Check past defaults and credit ratings.</li>
          <li><b>Liquidity Risk:</b> In volatile markets, redeeming your fund units might not be immediately possible at the desirable price.</li>
          <li><b>Inflation Risk:</b> If your fund’s returns don’t beat inflation, your purchasing power is reduced in real terms.</li>
        </ul>
        <p>
          <span style={{ fontWeight: 500, color: "#0077cc" }}>
            Tip: Diversifying your mutual funds and matching your choices with your risk appetite helps balance rewards and risks.
          </span>
        </p>
      </>
    ),
  },
  {
    id: 2,
    title: 'Selecting the Right Fund',
    content: (
      <>
        <b>Steps to choose your best-fit mutual fund:</b>
        <ul style={{ marginTop: 12 }}>
          <li><b>Define Goals:</b> Are you investing for retirement, buying a home, or a child’s education? Match fund types to goal duration.</li>
          <li><b>Assess Risk Tolerance:</b> If you prefer safety, look for debt or balanced funds. Comfortable with ups and downs? Equity funds may be better long-term performers.</li>
          <li><b>Check Investment Horizon:</b> Short-term goals fit liquid/ultra-short funds. For long-term (5+ years), equity mutual funds have higher growth potential.</li>
          <li><b>Examine Fund Performance:</b> Past performance isn’t a guarantee, but it helps review how funds weathered different markets. Compare with benchmark and peers.</li>
          <li><b>Expense Ratio:</b> Lower expense ratios equal better net returns over time. Always check this number when comparing funds.</li>
        </ul>
        <p>
          <span style={{ fontWeight: 500, color: "#0077cc" }}>
            Tip: Read the "riskometer" and scheme details in the fund fact sheet.
          </span>
        </p>
      </>
    ),
  },
  {
    id: 3,
    title: 'Beginner Investment Strategies',
    content: (
      <>
        <b>Simple strategies for beginners:</b>
        <ul style={{ marginTop: 12 }}>
          <li><b>Start with SIPs:</b> Systematic Investment Plans (SIP) let you invest small amounts regularly. This builds discipline and leverages rupee cost averaging.</li>
          <li><b>Diversify Your Portfolio:</b> Don’t put all your money in one fund type. Mix equity, debt, and hybrid funds for balanced growth and safety.</li>
          <li><b>Avoid Chasing Past Performance:</b> Just because a fund performed well last year doesn’t guarantee future success. Research consistency, not just top returns.</li>
          <li><b>Keep Costs Low:</b> Prefer funds with lower expense ratios to maximize real returns.</li>
          <li><b>Review and Rebalance:</b> Track your portfolio’s progress. Adjust if a fund consistently underperforms or if your financial goals change.</li>
        </ul>
        <p>
          <span style={{ fontWeight: 500, color: "#0077cc" }}>
            Tip: Stay invested for at least 5+ years to benefit from compounding and ignore short-term market noise.
          </span>
        </p>
      </>
    ),
  },
];

function AdvisorSection() {
  const [selectedArticle, setSelectedArticle] = useState(articles[0]);

  return (
    <div>
      <h2 style={{ color: '#004687' }}>Financial Advisor Section</h2>
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginTop: '16px' }}>
        <div style={{
          flex: '1 1 230px',
          padding: '16px',
          border: '1px solid #0077cc',
          borderRadius: '10px',
          background: '#f9fbff',
          maxHeight: '320px',
          overflowY: 'auto'
        }}>
          {articles.map(article => (
            <div
              key={article.id}
              style={{
                marginBottom: '18px',
                cursor: 'pointer',
                color: selectedArticle?.id === article.id ? '#0077cc' : '#004687'
              }}
              onClick={() => setSelectedArticle(article)}
            >
              <h4 style={{ margin: 0 }}>{article.title}</h4>
            </div>
          ))}
        </div>
        <div style={{
          flex: '2 1 400px',
          border: '1px solid #0077cc',
          borderRadius: '10px',
          padding: '20px',
          backgroundColor: 'white',
          boxShadow: '0 0 10px rgba(0,119,204,0.12)'
        }}>
          <h3>{selectedArticle.title}</h3>
          <div>{selectedArticle.content}</div>
        </div>
      </div>
    </div>
  );
}

export default AdvisorSection;
