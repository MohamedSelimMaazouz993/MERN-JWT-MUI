import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import UserManagement from './components/UserManagement';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Setup2FA from './components/Setup2FA';
import Home from './components/Home';
import { useDispatch } from 'react-redux';
import { fetchUserOnLoad } from './redux/slices/authSlice';
import { Button, Snackbar, Alert } from '@mui/material';

const App = () => {
  const dispatch = useDispatch();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallNotification, setShowInstallNotification] = useState(false);

  useEffect(() => {
    dispatch(fetchUserOnLoad());

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault(); // Prevent the default prompt
      setInstallPrompt(event); // Save the event
      setShowInstallNotification(true); // Show the notification
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, [dispatch]);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt(); // Trigger the install prompt
      installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPrompt(null); // Clear the saved prompt
        setShowInstallNotification(false); // Hide the notification
      });
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/user-management' element={<UserManagement />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/setup-2fa' element={<Setup2FA />} />
      </Routes>

      {/* Install Notification */}
      <Snackbar
        open={showInstallNotification}
        autoHideDuration={6000}
        onClose={() => setShowInstallNotification(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowInstallNotification(false)}
          severity='info'
          action={
            <Button color='inherit' size='small' onClick={handleInstallClick}>
              Install
            </Button>
          }
        >
          Install MyPWA for a better experience!
        </Alert>
      </Snackbar>
    </Router>
  );
};

export default App;
