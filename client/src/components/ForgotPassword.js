import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the email to the backend
      const response = await axios.post('/api/forgot-password', { email });
      setMessage(response.data.message); // Set success message
      setError(''); // Clear any previous errors
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset link'); // Set error message
      setMessage(''); // Clear any previous success messages
    }
  };

  return (
    <Container maxWidth='sm'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component='h1' variant='h5'>
          Forgot Password
        </Typography>
        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Send Reset Link
          </Button>

          {/* Display success message */}
          {message && (
            <Alert severity='success' sx={{ mt: 3 }}>
              {message}
            </Alert>
          )}

          {/* Display error message */}
          {error && (
            <Alert severity='error' sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
