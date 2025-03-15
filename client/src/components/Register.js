import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData))
      .unwrap()
      .then(() => navigate('/profile'))
      .catch((err) => console.log(err));
  };

  return (
    <Container maxWidth='sm'>
      <Typography variant='h4' gutterBottom>
        Register
      </Typography>
      {error && <Typography color='error'>{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label='Username'
          fullWidth
          margin='normal'
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <TextField
          label='Email'
          fullWidth
          margin='normal'
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
        />
        <Button type='submit' variant='contained' disabled={loading}>
          {loading ? 'Loading...' : 'Register'}
        </Button>
      </form>
    </Container>
  );
};

export default Register;
