import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import UserManagement from './components/UserManagement';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Setup2FA from './components/Setup2FA';
import { useDispatch } from 'react-redux';
import { fetchUserOnLoad } from './redux/slices/authSlice';
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserOnLoad());
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/user-management' element={<UserManagement />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/setup-2fa' element={<Setup2FA />} />
      </Routes>
    </Router>
  );
};

export default App;
