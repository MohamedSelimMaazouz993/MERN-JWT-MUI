import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import { TextField, Button, Container, Typography } from '@mui/material';
const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

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
          {loading ? 'Loading...' : 'Login'}
        </Button>
      </form>
    </Container>
  );
};

export default Login;
