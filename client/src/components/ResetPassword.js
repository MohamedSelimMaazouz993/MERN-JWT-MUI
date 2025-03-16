import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Box,
} from '@mui/material';

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/reset-password', {
        token,
        newPassword,
      });
      setMessage(response.data.message);
      setError('');

      // Redirect to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
      setMessage('');
    }
  };

  return (
    <Container maxWidth='sm'>
      <Box sx={{ marginTop: 4 }}>
        <Typography variant='h4' gutterBottom>
          Reset Password
        </Typography>
        {message && <Alert severity='success'>{message}</Alert>}
        {error && <Alert severity='error'>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label='New Password'
            type='password'
            fullWidth
            margin='normal'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Button type='submit' variant='contained' sx={{ marginTop: 2 }}>
            Reset Password
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ResetPassword;
