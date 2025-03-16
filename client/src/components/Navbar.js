import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { Home, Person, Group, ExitToApp } from '@mui/icons-material';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth); // Add isAuthenticated
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate('/login'); // Redirect to the login page
  };

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          <Button color='inherit' component={Link} to='/' startIcon={<Home />}>
            MERN JWT App
          </Button>
        </Typography>

        {isAuthenticated && user ? ( // Check both isAuthenticated and user
          <>
            <Typography variant='subtitle1' sx={{ marginRight: 2 }}>
              Welcome, {user.username}! ({user.role})
            </Typography>

            <Button
              color='inherit'
              component={Link}
              to='/profile'
              startIcon={<Person />}
            >
              Profile
            </Button>

            {(user.role === 'admin' || user.role === 'moderator') && (
              <Button
                color='inherit'
                component={Link}
                to='/user-management'
                startIcon={<Group />}
              >
                User Management
              </Button>
            )}

            <IconButton color='inherit' onClick={handleLogout}>
              <ExitToApp />
            </IconButton>
          </>
        ) : (
          <>
            <Button color='inherit' component={Link} to='/register'>
              Register
            </Button>
            <Button color='inherit' component={Link} to='/login'>
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
