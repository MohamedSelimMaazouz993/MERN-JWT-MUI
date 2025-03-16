import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import { TextField, Button, Container, Typography, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { loading, error, isAuthenticated, requires2FA } = useSelector(
    (state) => state.auth
  ); // Add requires2FA
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [token, setToken] = useState(''); // State for 2FA code

  const handleSubmit = (e) => {
    e.preventDefault();
    // Include the 2FA code in the login request if required
    const payload = requires2FA ? { ...formData, token } : formData;
    dispatch(loginUser(payload));
  };

  // Redirect to /profile after successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile'); // Redirect to /profile
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container maxWidth='sm'>
      <Typography variant='h4' gutterBottom>
        Login
      </Typography>
      {error && <Typography color='error'>{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label='Email'
          fullWidth
          margin='normal'
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <TextField
          label='Password'
          type='password'
          fullWidth
          margin='normal'
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        {/* Conditionally render the 2FA code input field */}
        {requires2FA && (
          <TextField
            label='2FA Code'
            fullWidth
            margin='normal'
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        )}

        <Button type='submit' variant='contained' disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </Button>
      </form>

      {/* Forgot Password Link */}
      <Typography sx={{ marginTop: 2 }}>
        <Link component={RouterLink} to='/forgot-password'>
          Forgot Password?
        </Link>
      </Typography>
    </Container>
  );
};

export default Login;
