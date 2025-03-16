import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../redux/slices/authSlice';
import {
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import Setup2FA from './Setup2FA'; // Import the Setup2FA component

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [open2FAModal, setOpen2FAModal] = useState(false); // State to control the modal

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Open the 2FA setup modal
  const handleOpen2FAModal = () => {
    setOpen2FAModal(true);
  };

  // Close the 2FA setup modal
  const handleClose2FAModal = () => {
    setOpen2FAModal(false);
  };

  if (loading) {
    return (
      <Container
        maxWidth='sm'
        sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth='sm' sx={{ marginTop: 3 }}>
        <Alert severity='error'>{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth='sm' sx={{ marginTop: 3 }}>
        <Alert severity='warning'>No user data found.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth='sm'>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
        <Typography variant='h4'>Profile</Typography>
        <Typography variant='body1'>Username: {user.username}</Typography>
        <Typography variant='body1'>Email: {user.email}</Typography>
        <Typography variant='body1'>Role: {user.role}</Typography>

        {/* Display 2FA Activation Status */}
        <Typography variant='body1' sx={{ marginTop: 2 }}>
          2FA Status:{' '}
          <Typography
            component='span'
            sx={{ fontWeight: 'bold', color: user.secret ? 'green' : 'red' }}
          >
            {user.secret ? 'Activated' : 'Not Activated'}
          </Typography>
        </Typography>

        {/* Add a button to open the 2FA setup modal */}
        <Button
          variant='contained'
          onClick={handleOpen2FAModal}
          sx={{ marginTop: 2 }}
        >
          {user.secret
            ? 'Reconfigure 2FA'
            : 'Setup Two-Factor Authentication (2FA)'}
        </Button>
      </Paper>

      {/* 2FA Setup Modal */}
      <Dialog open={open2FAModal} onClose={handleClose2FAModal}>
        <DialogTitle>Setup Two-Factor Authentication (2FA)</DialogTitle>
        <DialogContent>
          <Setup2FA onClose={handleClose2FAModal} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Profile;
