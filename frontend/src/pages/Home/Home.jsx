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
import Calendar from '../../components/Calendar/Calendar';
import Login from '../Login/Login';
import Timebar from '../../components/Timebar/Timebar';

const BACKEND_URI = 'https://fkt1tpkn-5000.inc1.devtunnels.ms';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userImage, setUserImage] = useState('');
  const [calorieSum, setCalorieSum] = useState(null);
  const [proteinSum, setProteinSum] = useState(null);
  const [carbsSum, setCarbsSum] = useState(null);
  const [fatsSum, setFatsSum] = useState(null);
  const [fiberSum, setFiberSum] = useState(null);
  const [calorieTarget, setCalorieTarget] = useState(null);
  const [proteinTarget, setProteinTarget] = useState(null);
  const [carbsTarget, setCarbsTarget] = useState(null);
  const [fatsTarget, setFatsTarget] = useState(null);
  const [fiberTarget, setFiberTarget] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const dateInputRef = useRef(null); // Ref for date input
  const [showCalendar, setShowCalendar] = useState(false);

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
      setProteinTarget(response.data.proteinTarget);
      setCarbsTarget(response.data.carbsTarget);
      setFatsTarget(response.data.fatsTarget);
      setFiberTarget(response.data.fiberTarget);
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
      setProteinSum(response.data.totalProtein);
      setCarbsSum(response.data.totalCarbs);
      setFatsSum(response.data.totalFats);
      setFiberSum(response.data.totalFiber);
    } catch (err) {
      console.error('Failed to fetch calorie data', err);
      setCalorieSum(0);
      setProteinSums(0);
      setCarbsSum(0);
      setFatsSum(0);
      setFiberSum(0);
    }
  };

  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const handleCalendarClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handleCalorieBoxClick = () => navigate('/calorietrack');
  const handleWeightBoxClick = () => navigate('/weight');

  const calculatePercentage = (sum, target) => (target && target > 0 ? Math.min((sum / target) * 100, 100) : 0);

  const percentage = Math.round((calorieSum/calorieTarget)*100);
  const proteinPercent = Math.round((proteinSum/proteinTarget)*100);
  const carbsPercent = Math.round((carbsSum/carbsTarget)*100);
  const fatsPercent = Math.round((fatsSum/fatsTarget)*100);
  const fiberPercent = Math.round((fiberSum/fiberTarget)*100);

  return (
    <div className="home">
      {isAuthenticated ? (
        <>
          <div className="topbar">
            <h2>Intake</h2>

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

          {showCalendar && <Calendar className="Calendar" onChange={setSelectedDate} />}

          <Timebar onChange={setSelectedDate}/>

          <h3 className="title">My Calories</h3>

          <div className="caloriebox">
            <div className="calorieheader" onClick={handleCalorieBoxClick}>
              {calorieSum === null || calorieTarget === null ? (
                <p>Loading...</p>
              ) : (
                <div className="circlechart">
                  <svg key={selectedDate} width="100" height="100">
                    <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" fill="#355347" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="grey"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(percentage / 100) * 252}, 252`}
                      transform="rotate(-90 50 50)"
                      className="progress"
                    />
                    <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="20" fill="white">{`${percentage.toFixed(0)}%`}</text>
                  </svg>
                </div>
              )}
              <div className="calorietext">
                <h3>Track Meals</h3>
                <h4>{calorieSum} kcal / {calorieTarget} kcal</h4>
              </div>
            </div>
            <div className="line-sep">
              <svg width="90%" height="20">
                <line x1="10%" y1="10" x2="99%" y2="10" stroke="#355347" strokeLinecap="round" strokeWidth="5" />
              </svg>
            </div>
            <div className="macro">
              <div className='macro-box'>
                <div className="macro-progress">
                  <h4>Protein - {`${proteinPercent}`}%</h4>
                  <svg key={selectedDate} width="100%" height="20">
                    <line x1="0" y1="10" x2="100" y2="10" stroke="grey" strokeWidth="5" />
                    <line x1="0" y1="10" x2="100" y2="10" stroke="#355347" strokeWidth="5"
                      className="progress-bar"
                      strokeDasharray={`${(proteinPercent)},100`}
                    />
                  </svg>
                </div>
              </div>
              <div className='macro-box'>
                <div className="macro-progress">
                  <h4>Carbs - {`${carbsPercent}`}%</h4>
                  <svg key={selectedDate} width="100%" height="20">
                    <line x1="0" y1="10" x2="100" y2="10" stroke="grey" strokeWidth="5" />
                    <line x1="0" y1="10" x2="100" y2="10" stroke="#355347" strokeWidth="5"
                      className="progress-bar"
                      strokeDasharray={`${(carbsPercent)},100`}
                    />
                  </svg>
                </div>
              </div>
              <div className='macro-box'>
                <div className="macro-progress">
                  <h4>Fats - {`${fatsPercent}`}%</h4>
                  <svg key={selectedDate} width="100%" height="20">
                    <line x1="0" y1="10" x2="100" y2="10" stroke="grey" strokeWidth="5" />
                    <line x1="0" y1="10" x2="100" y2="10" stroke="#355347" strokeWidth="5"
                      className="progress-bar"
                      strokeDasharray={`${(fatsPercent)},100`}
                    />
                  </svg>
                </div>
              </div>
              <div className='macro-box'>
                <div className="macro-progress">
                  <h4>Fiber - {`${fiberPercent}`} %</h4>
                  <svg key={selectedDate} width="100%" height="20">
                    <line x1="0" y1="10" x2="100" y2="10" stroke="grey" strokeWidth="5" />
                    <line x1="0" y1="10" x2="100" y2="10" stroke="#355347" strokeWidth="5"
                      className="progress-bar"
                      strokeDasharray={`${(fiberPercent)},100`}
                    />
                  </svg>
                </div>
              </div>
            </div>
            
          </div>
          <div className="dietbox">
              <div className="dietplanbox">

              </div>
              <div className="dietplanbox">

              </div>
            </div>

          <h3 className="title">Weight</h3>
          <div className="weightbox" onClick={handleWeightBoxClick}>

          </div>


          <div className="trackbox">
          <div className="waterbox">

          </div>
          <div className="sleepbox">

          </div>
          </div>

          <div className="adv">adv</div>



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
