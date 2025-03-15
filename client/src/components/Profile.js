import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../redux/slices/authSlice';
import {
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

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
      </Paper>
    </Container>
  );
};

export default Profile;
