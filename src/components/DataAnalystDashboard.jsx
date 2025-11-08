import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', investments: 4000, returns: 2400 },
  { month: 'Feb', investments: 3000, returns: 1398 },
  { month: 'Mar', investments: 2000, returns: 9800 },
  { month: 'Apr', investments: 2780, returns: 3908 },
  { month: 'May', investments: 1890, returns: 4800 },
  { month: 'Jun', investments: 2390, returns: 3800 },
];

function DataAnalystDashboard() {
  return (
    <div>
      <h2 style={{ color: '#004687' }}>Data Analyst Dashboard</h2>
      <p>Visualize investment trends and generate performance reports.</p>
      <div style={{ width: '100%', height: 350, marginTop: '30px' }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="investments" fill="#0077cc" />
            <Bar dataKey="returns" fill="#22a745" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DataAnalystDashboard;
