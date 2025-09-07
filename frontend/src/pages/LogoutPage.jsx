import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Elevation, Spinner } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';
import { logout } from '../userSlice';

const LogoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    dispatch(logout());
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  }, [navigate, dispatch]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f5f8fa' }}>
      <Card elevation={Elevation.TWO} style={{ width: 350, padding: 32, textAlign: 'center' }}>
        <Spinner />
        <div style={{ marginTop: 16 }}>Logging out...</div>
      </Card>
    </div>
  );
};

export default LogoutPage;
