import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const BACKEND_URI = 'http://localhost:5000';

const Home = () => {
  const [user, setUser] = useState({});
  const [maintenanceCalories, setMaintenanceCalories] = useState(null);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          return;
        }
        setIsAuthenticated(true);
        const response = await axios.get(`${BACKEND_URI}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        calculateMaintenanceCalories(response.data);
      } catch (err) {
        setError('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, [navigate]);

  const calculateMaintenanceCalories = (user) => {
    if (user.height && user.weight && user.age && user.sex && user.activityLevel) {
      let bmr;
      if (user.sex === 'male') {
        bmr = 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age);
      } else if (user.sex === 'female') {
        bmr = 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
      } else {
        bmr = (88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age) +
               447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age)) / 2;
      }

      const activityMultiplier = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        'very active': 1.9,
      };

      const maintenanceCalories = bmr * activityMultiplier[user.activityLevel];
      setMaintenanceCalories(maintenanceCalories);
    }
  };

  return (
    <div className="home">
      {isAuthenticated ? (
        <>
          <h2>Welcome, {user.name}</h2>
          {user.image && <img src={`${BACKEND_URI}${user.image}`} alt="Profile" className="profile-image" />}
          {error && <p className="error">{error}</p>}
          {maintenanceCalories && (
            <div className="calories-info">
              <h3>Your Maintenance Calories</h3>
              <p>{maintenanceCalories.toFixed(2)} kcal/day</p>
            </div>
          )}
        </>
      ) : (
        <p>Please log in to view your profile and maintenance calories.</p>
      )}
    </div>
  );
};

export default Home;