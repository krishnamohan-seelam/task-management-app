import React, { useState } from 'react';
import { login as apiLogin } from '../api';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../userSlice';

function Profile() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.user);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiLogin({ username: form.username, password: form.password });
      //localStorage.setItem('access_token', data.access_token);
      const payload = JSON.parse(atob(data.access_token.split('.')[1]));
      dispatch(login({ username: form.username, role: payload.role, access_token: data.access_token }));
      // Redirect based on role
      if (payload.role === 'project_manager') {
        navigate('/tasks');
      } else if (payload.role === 'team_member') {
        navigate('/teams');
      } else if (payload.role === 'team_lead') {
        navigate('/profile');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  if (!isAuthenticated) {
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
      <div>Logged in as: <b>{user?.username}</b></div>
      <div>Role: <b>{user?.role}</b></div>
      <button onClick={() => { dispatch(logout()); setForm({ username: '', password: '' }); localStorage.removeItem('access_token'); }}>Logout</button>
    </div>
  );
}

export default Profile;
