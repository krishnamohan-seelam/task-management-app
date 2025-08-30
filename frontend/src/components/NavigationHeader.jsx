import React from 'react';
import { Navbar, Alignment, Button } from '@blueprintjs/core';
import { LogIn, LogOut } from '@blueprintjs/icons';
import RoleBasedNav from './RoleBasedNav';
import { useNavigate } from 'react-router-dom';

const getUserRole = () => {
  return localStorage.getItem('role');
};

function NavigationHeader() {
  const token = localStorage.getItem('access_token');
  const role = getUserRole();
  const navigate = useNavigate();

  return (
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>Task Management</Navbar.Heading>
        <Navbar.Divider />
        {token && <RoleBasedNav role={role} />}
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        {!token ? (
          <Button intent="text" icon={<LogIn />} onClick={() => navigate('/login')}>
            Login
          </Button>
        ) : (
          <Button intent="text" icon={<LogOut />} onClick={() => navigate('/logout')}>
            Logout
          </Button>
        )}
      </Navbar.Group>
    </Navbar>
  );
}

export default NavigationHeader;
