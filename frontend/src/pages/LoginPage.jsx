import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { Card, Elevation, FormGroup, InputGroup, Button, Callout, Spinner } from '@blueprintjs/core';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form);
      localStorage.setItem('access_token', data.access_token);
      // Decode JWT for role (simple, not secure for prod)
      const payload = JSON.parse(atob(data.access_token.split('.')[1]));
      localStorage.setItem('role', payload.role);
      if (payload.role === 'project_manager') {
        navigate('/dashboard');
      } else if (payload.role === 'team_lead') {
        navigate('/lead/teams');
      } else if (payload.role === 'team_member') {
        navigate('/my-tasks');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f5f8fa' }}>
      <Card elevation={Elevation.TWO} style={{ width: 350, padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup label="Username" labelFor="username-input">
            <InputGroup id="username-input" name="username" value={form.username} onChange={handleChange} placeholder="Enter your username" autoFocus required large />
          </FormGroup>
          <FormGroup label="Password" labelFor="password-input">
            <InputGroup id="password-input" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" required large />
          </FormGroup>
          <Button type="submit" intent="primary" large fill disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <Spinner size={20} /> : 'Login'}
          </Button>
        </form>
        {error && <Callout intent="danger" style={{ marginTop: 16 }}>{error}</Callout>}
      </Card>
    </div>
  );
};

export default LoginPage;
