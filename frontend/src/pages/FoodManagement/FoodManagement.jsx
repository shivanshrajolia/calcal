import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from '../../context/AuthContext';
import './FoodManagement.css';

const BACKEND_URI = 'https://fkt1tpkn-5000.inc1.devtunnels.ms';

const FoodManagement = () => {
  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState({
    image: '',
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    fiber:'',
    weight: ''
  });
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get(`${BACKEND_URI}/api/foods`);
        setFoods(response.data);
      } catch (err) {
        setError('Failed to fetch foods');
      }
    };

    fetchFoods();
  }, []);

  const handleChange = (e) => {
    setNewFood({ ...newFood, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewFood({ ...newFood, image: e.target.files[0] });
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('User is not authenticated');
        return;
      }

      let imageUrl = '';

      if (newFood.image) {
        const formData = new FormData();
        formData.append('image', newFood.image);
        const uploadResponse = await axios.post(`${BACKEND_URI}/api/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        imageUrl = uploadResponse.data.url;
      }

      const foodData = {
        name: newFood.name,
        calories: newFood.calories,
        protein: newFood.protein,
        carbs: newFood.carbs,
        fats: newFood.fats,
        fiber: newFood.fiber,
        weight: newFood.weight,
        image: imageUrl
      };

      const response = await axios.post(`${BACKEND_URI}/api/foods`, foodData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFoods([...foods, response.data]);
      setNewFood({
        image: '',
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        fiber:'',
        weight: ''
      });
    } catch (err) {
      setError('Failed to add food');
    }
  };

  const handleDeleteFood = async (id) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('User is not authenticated');
        return;
      }

      await axios.delete(`${BACKEND_URI}/api/foods/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFoods(foods.filter(food => food._id !== id));
    } catch (err) {
      setError('Failed to delete food');
    }
  };

  return (
    <div className="food-management">
      <h2>Food Management</h2>
      {error && <p className="error">{error}</p>}
      <div className="food-list">
        {foods.map(food => (
          <div key={food._id} className="food-item">
            <img src={`${BACKEND_URI}${food.image}`} alt={food.name} className="food-image" />
            <div className="food-details">
              <h3>{food.name}</h3>
              <p>Calories: {food.calories}</p>
              <p>Protein: {food.protein}g</p>
              <p>Carbs: {food.carbs}g</p>
              <p>Fats: {food.fats}g</p>
              <p>Fiber: {food.fiber}g</p>
              <p>Weight: {food.weight}g</p>
              {isAuthenticated && (
                <button onClick={() => handleDeleteFood(food._id)} className="delete-button">Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
      {isAuthenticated && (
        <form onSubmit={handleAddFood} className="add-food-form">
          <h3>Add New Food</h3>
          <input type="file" name="image" onChange={handleImageChange} />
          <input type="text" name="name" placeholder="Name" value={newFood.name} onChange={handleChange} required />
          <input type="number" name="calories" placeholder="Calories" value={newFood.calories} onChange={handleChange} />
          <input type="number" name="protein" placeholder="Protein" value={newFood.protein} onChange={handleChange} />
          <input type="number" name="carbs" placeholder="Carbs" value={newFood.carbs} onChange={handleChange} />
          <input type="number" name="fats" placeholder="Fats" value={newFood.fats} onChange={handleChange} />
          <input type="number" name="fiber" placeholder="Fiber" value={newFood.fiber} onChange={handleChange} />
          <input type="number" name="weight" placeholder="Weight" value={newFood.weight} onChange={handleChange} />
          <button type="submit">Add Food</button>
        </form>
      )}
    </div>
  );
};

export default FoodManagement;
