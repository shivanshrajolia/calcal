import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import FoodManagement from './pages/FoodManagement/FoodManagement';
import CalorieTrack from './pages/CalorieTrack/CalorieTrack';
import Weight from './components/Weight/Weight';
import Calendar from './components/Calendar/Calendar';

const App = () => {
  return (
    <div className='app'>
      {/* <Navbar /> */}
      {/* <Calendar selectedDate={selectedDate} onChange={setSelectedDate}/> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/foodm' element={<FoodManagement />} />
        <Route path='/calorietrack' element={<CalorieTrack />} />
        <Route path='/weight' element={<Weight/>}/>
      </Routes>
    </div>
  );
};

export default App;
