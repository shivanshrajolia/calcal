import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Home.css';

const BACKEND_URI = 'https://fkt1tpkn-5000.inc1.devtunnels.ms';

const Home = () => {
  const [user, setUser] = useState({});
  const [maintenanceCalories, setMaintenanceCalories] = useState(null);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [calorieData, setCalorieData] = useState({
    breakfast: [],
    morningSnacks: [],
    lunch: [],
    eveningSnacks: [],
    dinner: []
  });
  const [newCalorieData, setNewCalorieData] = useState({
    date: new Date().toISOString().split('T')[0], // Set default date to today
    food_id: '',
    quantity: '',
    unit: 'g',
    calories: ''
  });
  const [foodDetails, setFoodDetails] = useState(null);
  const [foods, setFoods] = useState([]); // State to store all fetched foods
  const [foodMap, setFoodMap] = useState({}); // State to store food ID to food name mapping
  const [showAddSections, setShowAddSections] = useState({
    breakfast: false,
    morningSnacks: false,
    lunch: false,
    eveningSnacks: false,
    dinner: false
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('token');
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
        fetchCalorieDataForToday(response.data._id); // Fetch calorie data for today's date
      } catch (err) {
        setError('Failed to fetch profile');
      }
    };

    const fetchFoods = async () => {
      try {
        const response = await axios.get(`${BACKEND_URI}/api/foods`);
        setFoods(response.data);
        const foodMap = response.data.reduce((map, food) => {
          map[food._id] = food.name;
          return map;
        }, {});
        setFoodMap(foodMap);
      } catch (err) {
        setError('Failed to fetch foods');
      }
    };

    fetchProfile();
    fetchFoods();
  }, [navigate]);

  const fetchCalorieDataForToday = async (userId) => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);

    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('User is not authenticated');
        return;
      }

      const response = await axios.get(`${BACKEND_URI}/api/caloriedata`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { date: today, user_id: userId } // Include user_id in the request
      });

      setCalorieData(response.data);
    } catch (err) {
      setError('Failed to fetch calorie data');
    }
  };

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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setNewCalorieData({ ...newCalorieData, [name]: value });

    if (name === 'food_id') {
      try {
        const response = await axios.get(`${BACKEND_URI}/api/foods/${value}`);
        setFoodDetails(response.data);
      } catch (err) {
        setError('Failed to fetch food details');
        setFoodDetails(null);
      }
    }

    if (name === 'quantity' && foodDetails) {
      let totalCalories;
      if (newCalorieData.unit === 'g') {
        totalCalories = (foodDetails.calories / foodDetails.weight) * value;
      } else if (newCalorieData.unit === 'serving') {
        totalCalories = foodDetails.calories * value;
      }
      setNewCalorieData((prevData) => ({ ...prevData, calories: totalCalories }));
    }

    if (name === 'unit' && foodDetails) {
      let totalCalories;
      if (value === 'g') {
        totalCalories = (foodDetails.calories / foodDetails.weight) * newCalorieData.quantity;
      } else if (value === 'serving') {
        totalCalories = foodDetails.calories * newCalorieData.quantity;
      }
      setNewCalorieData((prevData) => ({ ...prevData, calories: totalCalories }));
    }
  };

  const handleAddCalorieData = async (e, mealType) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('User is not authenticated');
        return;
      }

      const calorieDataPayload = {
        ...newCalorieData,
        user_id: user._id, // Ensure user_id is included in the payload
        meal_type: mealType.charAt(0).toUpperCase() + mealType.slice(1).replace(/([A-Z])/g, ' $1').trim() // Format meal type
      };

      const response = await axios.post(`${BACKEND_URI}/api/caloriedata/add${mealType}`, calorieDataPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCalorieData({
        ...calorieData,
        [mealType]: [...calorieData[mealType], response.data]
      });

      setNewCalorieData({
        date: new Date().toISOString().split('T')[0], // Reset date to today
        food_id: '',
        quantity: '',
        unit: 'g',
        calories: ''
      });
      setFoodDetails(null);
    } catch (err) {
      setError('Failed to add calorie data');
    }
  };

  const toggleAddSection = (mealType) => {
    setShowAddSections((prevState) => ({
      ...prevState,
      [mealType]: !prevState[mealType]
    }));
  };

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setSelectedDate(selectedDate);

    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('User is not authenticated');
        return;
      }

      const response = await axios.get(`${BACKEND_URI}/api/caloriedata`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { date: selectedDate, user_id: user._id } // Include user_id in the request
      });

      setCalorieData(response.data);
    } catch (err) {
      setError('Failed to fetch calorie data');
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
          <div className="calorie-forms">
            <h3>Add Calorie Data</h3>
            {['breakfast', 'morningSnacks', 'lunch', 'eveningSnacks', 'dinner'].map((mealType) => (
              <div key={mealType}>
                <button onClick={() => toggleAddSection(mealType)}>
                  {showAddSections[mealType] ? `Hide ${mealType}` : `Add ${mealType}`}
                </button>
                {showAddSections[mealType] && (
                  <form onSubmit={(e) => handleAddCalorieData(e, mealType)}>
                    <h4>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h4>
                    <input
                      type="date"
                      name="date"
                      value={newCalorieData.date}
                      onChange={handleChange}
                      required
                    />
                    <select
                      name="food_id"
                      value={newCalorieData.food_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Food</option>
                      {foods.map((food) => (
                        <option key={food._id} value={food._id}>
                          {food.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      name="quantity"
                      placeholder="Quantity"
                      value={newCalorieData.quantity}
                      onChange={handleChange}
                      required
                    />
                    <select name="unit" value={newCalorieData.unit} onChange={handleChange}>
                      <option value="g">g</option>
                      <option value="serving">serving</option>
                    </select>
                    <input
                      type="number"
                      name="calories"
                      placeholder="Calories"
                      value={newCalorieData.calories}
                      readOnly
                    />
                    <button type="submit">Add {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</button>
                  </form>
                )}
              </div>
            ))}
          </div>
          <div className="calorie-data">
            <h3>View Calorie Data</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
            {['breakfast', 'morningSnacks', 'lunch', 'eveningSnacks', 'dinner'].map((mealType) => (
              <div key={mealType} className="meal-section">
                <h4>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h4>
                <ul>
                  {calorieData[mealType].map((data) => (
                    <li key={data._id}>
                      {new Date(data.date).toLocaleDateString()} - {foodMap[data.food_id]} - {data.quantity} {data.unit} - {data.calories} kcal
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Please log in to view your profile and maintenance calories.</p>
      )}
    </div>
  );
};

export default Home;