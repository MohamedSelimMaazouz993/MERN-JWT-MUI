import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import UserManagement from './components/UserManagement';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/user-management' element={<UserManagement />} />
      </Routes>
    </Router>
  );
};

export default App;
