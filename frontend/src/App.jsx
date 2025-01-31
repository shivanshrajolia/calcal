import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import FoodManagement from './pages/FoodManagement/FoodManagement';

const App = () => {
  return (
    <div className='app'>
      <Navbar />




      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/foodm' element={<FoodManagement/>} />
      </Routes>
    </div>
  );
};

export default App;
