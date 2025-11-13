import React, { useEffect, useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

// helper: generate small timeseries around a base value
const makeSeries = (base, points = 20) => {
  const arr = [];
  let val = base;
  for (let i = 0; i < points; i++) {
    val = +(val * (1 + (Math.random() - 0.48) * 0.02)).toFixed(2);
    arr.push({ idx: i, value: val });
  }
  return arr;
};

function DataAnalystDashboard() {
  // simulated market tickers
  const initialTickers = useMemo(() => ([
    { symbol: 'NIFTY 50', price: 24200.5, change: 0.6 },
    { symbol: 'RELIANCE', price: 2675.2, change: -0.4 },
    { symbol: 'TCS', price: 3570.0, change: 0.2 },
    { symbol: 'INFY', price: 1580.3, change: 0.9 },
    { symbol: 'HDFCBANK', price: 1502.4, change: -0.1 },
  ]), []);

  const [tickers, setTickers] = useState(() => initialTickers.map(t => ({ ...t, series: makeSeries(t.price, 18) })));

  // portfolio series (to display main chart)
  const [portfolioSeries, setPortfolioSeries] = useState(() => {
    const base = 125000;
    const arr = [];
    let v = base;
    for (let i = 0; i < 36; i++) {
      v = +(v * (1 + (Math.random() - 0.45) * 0.03));
      arr.push({ date: `M${i+1}`, value: Math.round(v) });
    }
    return arr;
  });

  // watchlist (popular stocks/funds) using the tickers above as example
  const [watchlist, setWatchlist] = useState(() => ([
    { symbol: 'RELIANCE', price: 2675.2, change: -0.4, series: makeSeries(2675.2) },
    { symbol: 'TCS', price: 3570.0, change: 0.2, series: makeSeries(3570) },
    { symbol: 'INFY', price: 1580.3, change: 0.9, series: makeSeries(1580.3) },
    { symbol: 'HDFCBANK', price: 1502.4, change: -0.1, series: makeSeries(1502.4) },
  ]));

  // simulate live updates for tickers and watchlist every 3s
  useEffect(() => {
    const id = setInterval(() => {
      setTickers(prev => prev.map(t => {
        const last = t.series[t.series.length - 1].value;
        const next = +(last * (1 + (Math.random() - 0.5) * 0.006)).toFixed(2);
        const delta = +((next - last) / last * 100).toFixed(2);
        return { ...t, price: next, change: delta, series: [...t.series.slice(-17), { idx: t.series.length, value: next }] };
      }));

      setWatchlist(prev => prev.map(w => {
        const last = w.series[w.series.length - 1].value;
        const next = +(last * (1 + (Math.random() - 0.5) * 0.012)).toFixed(2);
        const delta = +((next - last) / last * 100).toFixed(2);
        return { ...w, price: next, change: delta, series: [...w.series.slice(-17), { idx: w.series.length, value: next }] };
      }));

      // nudge portfolio series slightly
      setPortfolioSeries(prev => {
        const last = prev[prev.length - 1].value;
        const next = Math.round(last * (1 + (Math.random() - 0.48) * 0.01));
        return [...prev.slice(-34), { date: `M${prev.length+1}`, value: next }];
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // quick computed portfolio stats
  const totalInvested = 98000;
  const currentValue = portfolioSeries[portfolioSeries.length - 1].value;
  const todayPnL = Math.round((currentValue - totalInvested) * 100) / 100;

  return (
    <div style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#0b3954', margin: 0 }}>Analytics</h2>
          <div style={{ color: '#576470' }}>Market insights & portfolio overview</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* small summary cards */}
          <div style={{ background: '#fff', padding: 12, borderRadius: 10, boxShadow: '0 6px 18px rgba(2,45,100,0.04)', minWidth: 220 }}>
            <div style={{ color: '#889aa5', fontSize: 13 }}>Portfolio Value</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#073b4c' }}>₹{currentValue.toLocaleString()}</div>
            <div style={{ color: todayPnL >= 0 ? '#0b6b3d' : '#cc2b2b', fontWeight: 700 }}>{todayPnL >= 0 ? '+' : ''}{todayPnL.toLocaleString()} (since invested)</div>
          </div>
          <div style={{ background: '#fff', padding: 12, borderRadius: 10, boxShadow: '0 6px 18px rgba(2,45,100,0.04)', minWidth: 160 }}>
            <div style={{ color: '#889aa5', fontSize: 13 }}>Invested</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>₹{totalInvested.toLocaleString()}</div>
            <div style={{ color: '#889aa5', fontSize: 12 }}>Return: {(currentValue/totalInvested - 1).toFixed(2) * 100}%</div>
          </div>
        </div>
      </div>

      {/* market ticker */}
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '12px 0', marginTop: 18 }}>
        {tickers.map(t => (
          <div key={t.symbol} style={{ minWidth: 160, background: '#fff', borderRadius: 10, padding: 10, boxShadow: '0 6px 18px rgba(2,45,100,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>{t.symbol}</div>
              <div style={{ color: t.change >= 0 ? '#0b6b3d' : '#cc2b2b', fontWeight: 700 }}>{t.change >= 0 ? '+' : ''}{t.change}%</div>
            </div>
            <div style={{ fontSize: 18, color: '#073b4c', fontWeight: 800 }}>₹{t.price.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 18, marginTop: 18 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 6px 24px rgba(2,45,100,0.04)' }}>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioSeries} margin={{ top: 8, right: 18, left: -6, bottom: 0 }}>
                <defs>
                  <linearGradient id="pv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0077cc" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#0077cc" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => '₹' + (v / 1000) + 'k'} />
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                <Area type="monotone" dataKey="value" stroke="#0077cc" fill="url(#pv)" />
                <Line type="monotone" dataKey="value" stroke="#005fa3" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 6px 18px rgba(2,45,100,0.04)' }}>
            <h4 style={{ marginTop: 0, color: '#073b4c' }}>Watchlist</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {watchlist.map(w => (
                <div key={w.symbol} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <div style={{ minWidth: 100 }}>
                    <div style={{ fontWeight: 700 }}>{w.symbol}</div>
                    <div style={{ color: '#889aa5', fontSize: 13 }}>₹{w.price}</div>
                  </div>
                  <div style={{ width: 120, height: 40 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={w.series} margin={{ top: 0, right: 6, left: 0, bottom: 0 }}>
                        <Line dataKey="value" stroke={w.series[w.series.length-1].value >= w.series[0].value ? '#0b6b3d' : '#cc2b2b'} dot={false} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ minWidth: 60, textAlign: 'right', fontWeight: 700, color: w.change >= 0 ? '#0b6b3d' : '#cc2b2b' }}>{w.change >= 0 ? '+' : ''}{w.change}%</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 12, background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 6px 18px rgba(2,45,100,0.04)' }}>
            <h4 style={{ marginTop: 0, color: '#073b4c' }}>Holdings</h4>
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ color: '#889aa5' }}>Total Invested</div>
                <div>₹{totalInvested.toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ color: '#889aa5' }}>Current Value</div>
                <div>₹{currentValue.toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: todayPnL >= 0 ? '#0b6b3d' : '#cc2b2b' }}>
                <div>Unrealised P&L</div>
                <div>₹{(currentValue - totalInvested).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataAnalystDashboard;
