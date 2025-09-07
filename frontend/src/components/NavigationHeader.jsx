import React from 'react';
import { Navbar, Alignment, Button } from '@blueprintjs/core';
import { LogIn, LogOut } from '@blueprintjs/icons';
import RoleBasedNav from './RoleBasedNav';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // <-- Import useSelector

function NavigationHeader() {
  // const token = localStorage.getItem('access_token');
  const role = useSelector((state) => state.user.role); // <-- Get role from Redux
  const token = useSelector((state) => state.user.access_token); // <-- Get token from Redux
  const navigate = useNavigate();

  return (
    <Navbar>
      <Navbar.Group align={Alignment.START}>
        <Navbar.Heading>Task Management</Navbar.Heading>
        <Navbar.Divider />
        {token && <RoleBasedNav role={role} />}
      </Navbar.Group>
      <Navbar.Group align={Alignment.END}>
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
