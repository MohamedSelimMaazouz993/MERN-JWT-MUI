import React, { useEffect, useState } from 'react';
import {
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Modal,
  Box,
  TextField,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleOpenModal = (user = null) => {
    setCurrentUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      username: formData.get('username'),
      email: formData.get('email'),
      role: formData.get('role'),
      password: formData.get('password'),
    };

    try {
      const token = localStorage.getItem('token');
      if (currentUser) {
        await axios.put(
          `/api/users/${currentUser._id}`,
          userData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post('/api/register', userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchUsers();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  return (
    <Container maxWidth='md'>
      <Typography variant='h4' gutterBottom>
        User Management
      </Typography>
      <Button
        variant='contained'
        startIcon={<Add />}
        onClick={() => handleOpenModal()}
      >
        Add User
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenModal(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant='h6'>
            {currentUser ? 'Edit User' : 'Add User'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin='normal'
              label='Username'
              name='username'
              defaultValue={currentUser?.username}
              required
            />
            <TextField
              fullWidth
              margin='normal'
              label='Email'
              name='email'
              defaultValue={currentUser?.email}
              required
            />
            <TextField
              fullWidth
              margin='normal'
              label='Password'
              name='password'
              defaultValue={currentUser?.password}
              required
            />
            <TextField
              fullWidth
              margin='normal'
              label='Role'
              name='role'
              defaultValue={currentUser?.role}
              required
            />
            <Button type='submit' variant='contained' sx={{ marginTop: 2 }}>
              Save
            </Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default UserManagement;
