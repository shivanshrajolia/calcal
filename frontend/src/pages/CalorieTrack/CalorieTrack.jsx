import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './CalorieTrack.css';
import Timebar from '../../components/Timebar/Timebar';

const BACKEND_URI = 'https://fkt1tpkn-5000.inc1.devtunnels.ms';

const CalorieTrack = () => {
  const [user, setUser] = useState({});
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
    date: new Date().toISOString().split('T')[0],
    food_id: '',
    quantity: '',
    unit: 'g',
    calories: '',
    protein:'',
    carbs:'',
    fats:'',
    fiber:''
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
        fetchCalorieDataForDate(response.data._id, selectedDate); // Fetch calorie data for the selected date
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
  }, [selectedDate]);

  const fetchCalorieDataForDate = async (userId, date) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('User is not authenticated');
        return;
      }

      console.log(`Fetching calorie data for user: ${userId}, date: ${date}`); // Debug log

      const response = await axios.get(`${BACKEND_URI}/api/caloriedata`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { date, user_id: userId } // Include user_id in the request
      });

      console.log('Calorie data for selected date:', response.data); // Debug log
      setCalorieData(response.data);
    } catch (err) {
      console.error('Failed to fetch calorie data for selected date', err);
      setError('Failed to fetch calorie data');
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
      let totalProtein;
      let totalCarbs;
      let totalFats;
      let totalFiber;
      if (newCalorieData.unit === 'g') {
        totalCalories = (foodDetails.calories / foodDetails.weight) * value;
        totalProtein = (foodDetails.protein / foodDetails.weight) * value;
        totalCarbs = (foodDetails.carbs / foodDetails.weight) * value;
        totalFats = (foodDetails.fats / foodDetails.weight) * value;
        totalFiber = (foodDetails.fiber / foodDetails.weight) * value;
      } else if (newCalorieData.unit === 'serving') {
        totalCalories = foodDetails.calories * value;
        totalProtein = foodDetails.protein * value;
        totalCarbs = foodDetails.carbs * value;
        totalFats = foodDetails.fats * value;
        totalFiber = foodDetails.fiber * value;
      }
      setNewCalorieData((prevData) => ({ ...prevData, calories: totalCalories, protein: totalProtein, carbs: totalCarbs, fats: totalFats, fiber: totalFiber }));
    }

    if (name === 'unit' && foodDetails) {
      let totalCalories;
      let totalProtein;
      let totalCarbs;
      let totalFats;
      let totalFiber;
      if (value === 'g') {
        totalCalories = (foodDetails.calories / foodDetails.weight) * newCalorieData.quantity;
        totalProtein = (foodDetails.protein / foodDetails.weight) * newCalorieData.quantity;
        totalCarbs = (foodDetails.carbs / foodDetails.weight) * newCalorieData.quantity;
        totalFats = (foodDetails.fats / foodDetails.weight) * newCalorieData.quantity;
        totalFiber = (foodDetails.fiber / foodDetails.weight) * newCalorieData.quantity;

      } else if (value === 'serving') {
        totalCalories = foodDetails.calories * newCalorieData.quantity;
        totalProtein = foodDetails.protein * newCalorieData.quantity;
        totalCarbs = foodDetails.carbs * newCalorieData.quantity;
        totalFats = foodDetails.fats * newCalorieData.quantity;
        totalFiber = foodDetails.fiber * newCalorieData.quantity;
      }
      setNewCalorieData((prevData) => ({ ...prevData, calories: totalCalories, protein: totalProtein, carbs: totalCarbs, fats: totalFats, fiber: totalFiber }));
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
        date: selectedDate, // Ensure the date is set to the selected date
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
        date: selectedDate, // Use the globally selected date
        food_id: '',
        quantity: '',
        unit: 'g',
        calories: '',
        protein:'',
        carbs:'',
        fats:'',
        fiber:''
      });
      setFoodDetails(null);
    } catch (err) {
      setError('Failed to add calorie data');
    }
  };

  const handleDeleteCalorieData = async (id, mealType) => {
    const confirmDelete = window.confirm('Do you really want to delete this data?');
    if (!confirmDelete) return;

    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('User is not authenticated');
        return;
      }

      await axios.delete(`${BACKEND_URI}/api/caloriedata/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCalorieData((prevData) => ({
        ...prevData,
        [mealType]: prevData[mealType].filter((data) => data._id !== id)
      }));
    } catch (err) {
      setError('Failed to delete calorie data');
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

      console.log(`Fetching calorie data for user: ${user._id}, date: ${selectedDate}`); // Debug log

      const response = await axios.get(`${BACKEND_URI}/api/caloriedata`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { date: selectedDate, user_id: user._id } // Include user_id in the request
      });

      console.log('Calorie data for selected date:', response.data); // Debug log
      setCalorieData(response.data);
    } catch (err) {
      console.error('Failed to fetch calorie data for selected date', err);
      setError('Failed to fetch calorie data');
    }
  };

  return (
    <div className="calorie-track">
      {isAuthenticated ? (
        <>
          {/* <h2>Calorie Tracking</h2> */}
          {error && <p className="error">{error}</p>}

          <div className="topbar">
            <h2>Intake</h2>

            <div className="date-picker">
              <input
                // type="date"
                // value={selectedDate}
                // onChange={handleDateChange}
                // ref={dateInputRef}
              />
              <img
                // src={Calenderimg}
                // alt="Calendar"
                // className="calendar-icon"
                // onClick={handleCalendarClick}
              />
            </div>
          </div>

          <div className="calorie-data">
            {/* <h3>View and Add Calorie Data</h3> */}
            {/* <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            /> */}
            <Timebar onChange={setSelectedDate}/>
            {['breakfast', 'morningSnacks', 'lunch', 'eveningSnacks', 'dinner'].map((mealType) => (
              <div key={mealType} className="meal-section">
                <h4>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h4>
                <ul>
                  {calorieData[mealType].map((data) => (
                    <li key={data._id}>
                      {new Date(data.date).toLocaleDateString()} - {foodMap[data.food_id]} - {data.quantity} {data.unit} - {data.calories} kcal <br />
                         {data.protein} g - {data.carbs} g - {data.fats} g - {data.fiber} g
                      <button onClick={() => handleDeleteCalorieData(data._id, mealType)}>Delete</button>
                    </li>
                  ))}
                </ul>
                <button onClick={() => toggleAddSection(mealType)}>
                  {showAddSections[mealType] ? `Hide Add ${mealType}` : `Add ${mealType}`}
                </button>
                {showAddSections[mealType] && (
                  <form onSubmit={(e) => handleAddCalorieData(e, mealType)}>
                    <input
                      type="date"
                      name="date"
                      value={selectedDate}
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
        </>
      ) : (
        <p>Please log in to view your profile and maintenance calories.</p>
      )}
    </div>
  );
};

export default CalorieTrack;