import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import './Home.css';
import Calenderimg from '../../assets/Calendar.png';
import Homeimg from '../../assets/Home.png';
import Insightimg from '../../assets/Insight.png';
import Searchimg from '../../assets/Search.png';
import Menuimg from '../../assets/Menu.png';

const BACKEND_URI = 'https://fkt1tpkn-5000.inc1.devtunnels.ms';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userImage, setUserImage] = useState('');
  const [calorieSum, setCalorieSum] = useState(null);
  const [calorieTarget, setCalorieTarget] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const dateInputRef = useRef(null); // Ref for date input

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
      fetchUserProfile(token);
    }
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      const token = Cookies.get('token');
      fetchCalorieSumForDate(token, selectedDate, userId);
    }
  }, [selectedDate, userId]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(`${BACKEND_URI}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserImage(response.data.image);
      setUserId(response.data._id);
      setCalorieTarget(response.data.calorieTarget);
    } catch (err) {
      console.error('Failed to fetch user profile', err);
      if (err.response?.status === 401) navigate('/login');
    }
  };

  const fetchCalorieSumForDate = async (token, date, userId) => {
    try {
      const response = await axios.get(`${BACKEND_URI}/api/caloriedata/sum`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { date, user_id: userId },
      });
      setCalorieSum(response.data.totalCalories);
    } catch (err) {
      console.error('Failed to fetch calorie data', err);
      setCalorieSum(0);
    }
  };

  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleCalorieBoxClick = () => navigate('/calorietrack');

  const calculatePercentage = (sum, target) => (target && target > 0 ? Math.min((sum / target) * 100, 100) : 0);

  const percentage = calculatePercentage(calorieSum, calorieTarget);

  return (
    <div className="home">
      {isAuthenticated ? (
        <>
          <div className="topbar">
            <h2>Calcal</h2>
            <div className="date-picker">
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                ref={dateInputRef}
              />
              <img
                src={Calenderimg}
                alt="Calendar"
                className="calendar-icon"
                onClick={handleCalendarClick}
              />
            </div>
          </div>

          <div className="adv">adv</div>

          <h3 className="title">Calories</h3>

          <div className="caloriebox" onClick={handleCalorieBoxClick}>
            {calorieSum === null || calorieTarget === null ? (
              <p>Loading...</p>
            ) : (
              <div className="circlechart">
                <svg key={selectedDate} width="100" height="100">
                  <circle cx="50" cy="50" r="30" stroke="grey" strokeWidth="6" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="30"
                    stroke="green"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(percentage / 100) * 190}, 190`}
                    transform="rotate(-90 50 50)"
                    className="progress"
                  />
                  <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="20">{`${percentage.toFixed(0)}%`}</text>
                </svg>
              </div>
            )}
            <div className="calorietext">
              <h4>{calorieSum} kcal / {calorieTarget} kcal</h4>
            </div>
          </div>

          <div className="menubar">
            <Link to="#"><img src={Homeimg} alt="Home" /></Link>
            <Link to="#"><img src={Insightimg} alt="Insight" /></Link>
            <Link to="/profile">
              <img
                src={userImage ? (userImage.startsWith('http') ? userImage : `${BACKEND_URI}${userImage}`) : ''}
                alt="Profile"
                className="profileimg"
              />
            </Link>
            <Link to="#"><img src={Searchimg} alt="Search" /></Link>
            <Link to="/calorietrack"><img src={Menuimg} alt="Menu" /></Link>
          </div>
        </>
      ) : (
        <p>Redirecting to login...</p>
      )}
    </div>
  );
};

export default Home;
