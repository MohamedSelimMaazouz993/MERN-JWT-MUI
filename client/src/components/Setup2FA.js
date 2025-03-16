import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setup2FA, verify2FA } from '../redux/slices/authSlice';
import axios from 'axios';
import { TextField, Button, Typography, Alert, Box } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

const Setup2FA = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading, error, secret, qrCode, message } = useSelector(
    (state) => state.auth
  );
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetch2FASetup = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const response = await axios.get('/api/setup-2fa', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setup2FA.fulfilled(response.data)); // Dispatch the response data
      } catch (err) {
        dispatch(
          setup2FA.rejected(err.response?.data || 'Failed to fetch 2FA setup')
        );
      }
    };

    fetch2FASetup();
  }, [dispatch]);

  const handleVerify = (e) => {
    e.preventDefault();
    dispatch(verify2FA({ token })).then((action) => {
      if (verify2FA.fulfilled.match(action)) {
        if (onClose) onClose();
      }
    });
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant='h4' gutterBottom>
        Setup Two-Factor Authentication (2FA)
      </Typography>
      {error && <Alert severity='error'>{error}</Alert>}
      {message && <Alert severity='success'>{message}</Alert>}
      {secret && (
        <>
          <Typography variant='body1' gutterBottom>
            Scan the QR code below using Google Authenticator:
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 2,
            }}
          >
            <QRCodeSVG value={qrCode} size={200} />{' '}
            {/* Use QRCodeSVG with a size */}
          </Box>
          <Typography variant='body1' gutterBottom>
            Or manually enter this secret key: <strong>{secret}</strong>
          </Typography>
          <form onSubmit={handleVerify}>
            <TextField
              label='2FA Code'
              fullWidth
              margin='normal'
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <Button
              type='submit'
              variant='contained'
              disabled={loading}
              sx={{ marginTop: 2 }}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>
          </form>
        </>
      )}
    </Box>
  );
};

export default Setup2FA;
