import React, { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login({ username: form.username, password: form.password });
      setToken(data.access_token);
      localStorage.setItem('access_token', data.access_token); // Save token for other pages
      // Decode JWT for user info (simple, not secure for prod)
      const payload = JSON.parse(atob(data.access_token.split('.')[1]));
      setUser({ id: payload.sub, role: payload.role });
      // Redirect based on role
      if (payload.role === 'project_manager') {
        navigate('/tasks');
      } else if (payload.role === 'team_member') {
        navigate('/teams');
      } else if (payload.role === 'team_lead') {
        navigate('/profile'); // Change to your team lead page if exists
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  if (!token) {
    return (
      <div>
        <h1>Profile Page</h1>
        <form onSubmit={handleSubmit} style={{ maxWidth: 300 }}>
          <div>
            <label>Email:</label>
            <input name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div>
            <label>Password (role):</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit">Login</button>
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <div>Logged in as: <b>{form.username}</b></div>
      <div>Role: <b>{user?.role}</b></div>
      <button onClick={() => { setToken(null); setUser(null); setForm({ username: '', password: '' }); localStorage.removeItem('access_token'); }}>Logout</button>
    </div>
  );
}

export default Profile;
