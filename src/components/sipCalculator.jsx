import React, { useState } from "react";
import "./sipCalculator.css";

export default function SipCalculator({
  initialAmount = 1000,
  initialReturn = 12,
  initialYears = 5,
  onCalculate
}) {
  const [monthly, setMonthly] = useState(initialAmount);
  const [annualReturn, setAnnualReturn] = useState(initialReturn);
  const [years, setYears] = useState(initialYears);
  const [result, setResult] = useState(null);
  const [focused, setFocused] = useState('');

  const styles = {
    card: { background: '#fff', borderRadius: 10, padding: 12, boxShadow: '0 6px 18px rgba(3,102,170,0.06)' },
    row: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 },
    label: { fontSize: 13, color: '#334e68', minWidth: 120 },
    small: { fontSize: 12, color: '#7a8a99' },
    resultCard: { background: 'linear-gradient(180deg,#f7fbff,#ffffff)', padding: 12, borderRadius: 8, border: '1px solid #eaf4ff' }
  };

  function formatCurrency(v) {
    try { return '₹' + Number(v).toLocaleString(); } catch (e) { return '₹' + v; }
  }

  function calculate() {
    if (!(monthly > 0) || !(years > 0) || annualReturn < 0) {
      alert('Please enter valid positive values.');
      return;
    }

    const r = annualReturn / 1200;
    const n = years * 12;

    const fv = r === 0
      ? monthly * n
      : monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);

    const totalInvested = monthly * n;
    const gain = fv - totalInvested;
    // approximate CAGR from total gain over years
    const cagr = Math.pow((fv / totalInvested), 1 / years) - 1;

    const res = {
      futureValue: +fv.toFixed(2),
      totalInvested: +totalInvested.toFixed(2),
      gain: +gain.toFixed(2),
      cagr: +((cagr || 0) * 100).toFixed(2)
    };

    setResult(res);
    if (onCalculate) onCalculate(res);
  }

    function reset() {
      setMonthly(initialAmount);
      setAnnualReturn(initialReturn);
      setYears(initialYears);
      setResult(null);
      setFocused('');
    }

  return (
    <div style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 800, color: '#073b4c', fontSize: 16 }}>SIP Calculator</div>
        <div style={styles.small}>Estimate future value of monthly SIPs</div>
      </div>

      <div className="sip-row" style={{ position: 'relative', ...styles.row }}>
        <label className="sip-label">Monthly SIP</label>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#2b5573', fontWeight: 700 }}>₹</span>
          <input
            className={"sip-input " + (focused === 'monthly' ? 'focused' : '')}
            type="number"
            min="0"
            value={monthly}
            onFocus={() => setFocused('monthly')}
            onBlur={() => setFocused('')}
            onChange={(e) => setMonthly(Number(e.target.value || 0))}
          />
        </div>
      </div>

      <div className="sip-quick">
        {[500, 1000, 3000, 5000, 10000].map((amt) => {
          const isActive = Number(monthly) === amt;
          return (
            <button
              key={amt}
              type="button"
              onClick={() => setMonthly(amt)}
              className={"sip-quick-btn" + (isActive ? ' active' : '')}
              aria-pressed={isActive}
            >
              ₹{amt.toLocaleString()}
            </button>
          );
        })}
      </div>

      <div className="sip-row" style={{ position: 'relative', ...styles.row }}>
        <label className="sip-label">Expected Return (%)</label>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            className={"sip-input " + (focused === 'return' ? 'focused' : '')}
            type="number"
            min="0"
            step="0.1"
            value={annualReturn}
            onFocus={() => setFocused('return')}
            onBlur={() => setFocused('')}
            onChange={(e) => setAnnualReturn(Number(e.target.value || 0))}
          />
        </div>
      </div>

      <div className="sip-row" style={{ position: 'relative', ...styles.row }}>
        <label className="sip-label">Years</label>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            className={"sip-input " + (focused === 'years' ? 'focused' : '')}
            type="number"
            min="1"
            value={years}
            onFocus={() => setFocused('years')}
            onBlur={() => setFocused('')}
            onChange={(e) => setYears(Number(e.target.value || 0))}
          />
        </div>
      </div>

      <div className="sip-actions">
        <button className="sip-btn primary" type="button" onClick={calculate}>Calculate</button>
        <button className="sip-btn ghost" type="button" onClick={reset}>Reset</button>
      </div>

      {result && (
        <div style={{ marginTop: 12 }}>
          <div style={styles.resultCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: '#6b8191' }}>Future Value</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#073b4c' }}>{formatCurrency(result.futureValue)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#6b8191' }}>Est. CAGR</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0b9444' }}>{result.cagr}%</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ padding: 8, borderRadius: 8, background: '#fff' }}>
                <div style={{ fontSize: 12, color: '#6b8191' }}>Total Invested</div>
                <div style={{ fontWeight: 700, color: '#073b4c' }}>{formatCurrency(result.totalInvested)}</div>
              </div>
              <div style={{ padding: 8, borderRadius: 8, background: '#fff' }}>
                <div style={{ fontSize: 12, color: '#6b8191' }}>Estimated Gain</div>
                <div style={{ fontWeight: 700, color: result.gain >= 0 ? '#0b9444' : '#d12c2c' }}>{formatCurrency(result.gain)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
