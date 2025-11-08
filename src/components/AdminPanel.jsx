import React, { useState } from 'react';

// src/components/AdminPanel.jsx

// Paste mockUsers here
const mockUsers = [
  { 
    id: 1, 
    name: 'User A', 
    role: 'Investor', 
    status: 'Active',
    email: 'usera@example.com',
    registeredOn: '2024-06-15',
    otpVerified: true
  },
  { 
    id: 2, 
    name: 'User B', 
    role: 'Financial Advisor', 
    status: 'Inactive',
    email: 'userb@example.com',
    registeredOn: '2023-11-03',
    otpVerified: false
  },
  { 
    id: 3, 
    name: 'User C', 
    role: 'Admin', 
    status: 'Active',
    email: 'userc@example.com',
    registeredOn: '2025-03-27',
    otpVerified: true
  },
  { 
    id: 4, 
    name: 'User D', 
    role: 'Investor', 
    status: 'Active',
    email: 'userd@example.com',
    registeredOn: '2022-12-10',
    otpVerified: false
  }
];




function AdminPanel() {
  const [users, setUsers] = useState(mockUsers);

  function toggleStatus(id) {
    setUsers(users.map(user => user.id === id ? {
      ...user,
      status: user.status === 'Active' ? 'Inactive' : 'Active',
    } : user));
  }

  return (
    <div style={{ padding: '20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1 style={{ color: '#004687', marginBottom: '20px' }}>Admin Panel</h1>
      <p>Manage users and platform settings here.</p>
<table className="admin-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Role</th>
      <th>Email</th>
      <th>Registered On</th>
      <th>OTP</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {users.map(user => (
      <tr key={user.id} className={user.status === 'Inactive' ? 'inactive-row' : ''}>
        <td>{user.name}</td>
        <td>{user.role}</td>
        <td>{user.email}</td>
        <td>{user.registeredOn}</td>
        <td className={user.otpVerified ? 'status-verified' : 'status-pending'}>
          {user.otpVerified ? 'Verified' : 'Pending'}
        </td>
        <td className={user.status === 'Active' ? 'status-active' : 'status-inactive'}>
          {user.status}
        </td>
        <td>
          <button onClick={() => toggleStatus(user.id)}>
            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      
    </div>
  );
}

export default AdminPanel;
