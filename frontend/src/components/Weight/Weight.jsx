import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Weight.css';

const BACKEND_URI = 'https://fkt1tpkn-5000.inc1.devtunnels.ms';

const Weight = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [weightData, setWeightData] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [selectedForUpdate, setSelectedForUpdate] = useState(null);
  const [updatedWeight, setUpdatedWeight] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const profileResponse = await axios.get(`${BACKEND_URI}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Profile data:', profileResponse.data);
        setUser(profileResponse.data);
        fetchWeightData(profileResponse.data._id);

      } catch (err) {
        console.error("Error fetching profile:", err);
        setError('Failed to load profile. Please try again later.');
      }
    };

    const fetchWeightData = async (userId) => {
      try {
        const token = Cookies.get('token');
        const weightResponse = await axios.get(`${BACKEND_URI}/api/weightdata/listweight`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { user_id: userId },
        });
        console.log('Weight data:', weightResponse.data);
        setWeightData(weightResponse.data);
      } catch (err) {
        console.error("Error fetching weight data:", err);
        setError('Failed to load weight data. Please try again later.');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleAddWeight = async (e) => {
    e.preventDefault();
    setError(null);

    if (!newWeight) return;

    try {
      const token = Cookies.get('token');
      if (!token || !user) {
        setError('User is not authenticated.');
        return;
      }

      const weightDataPayload = {
        date: new Date().toISOString().split('T')[0],
        weight: newWeight,
        user_id: user._id,
      };

      const response = await axios.post(`${BACKEND_URI}/api/weightdata/addweight`, weightDataPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Added weight data:', response.data);
      setWeightData([...weightData, response.data]);
      setNewWeight('');
    } catch (err) {
      console.error("Error adding weight:", err);
      setError('Failed to add weight data. Please try again.');
    }
  };

  const handleUpdateWeight = async (id) => {
    setError(null);
    if (!updatedWeight) return;

    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('User is not authenticated');
        return;
      }

      const response = await axios.put(`${BACKEND_URI}/api/weightdata/${id}`, {
        weight: updatedWeight,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Updated weight data:', response.data);
      setWeightData(weightData.map(data => data._id === id ? response.data : data));
      setSelectedForUpdate(null);
      setUpdatedWeight('');
    } catch (err) {
      console.error("Error updating weight:", err);
      setError('Failed to update weight data. Please try again.');
    }
  };

  const handleDeleteWeight = async (id) => {
    setError(null);
    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('User is not authenticated');
        return;
      }

      await axios.delete(`${BACKEND_URI}/api/weightdata/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Deleted weight data:', id);
      setWeightData(weightData.filter(data => data._id !== id));
    } catch (err) {
      console.error("Error deleting weight:", err);
      setError('Failed to delete weight data. Please try again.');
    }
  };

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Weight Page</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleAddWeight}>
        <input type="date" value={new Date().toISOString().split('T')[0]} disabled />
        <input
          type="number"
          placeholder="Weight"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <h2>All Weight Data</h2>
      <ul>
        {weightData.map((data) => (
          <li key={data._id}>
            {data.date}: {data.weight} kg
            <button onClick={() => handleDeleteWeight(data._id)}>Delete</button>

            {selectedForUpdate === data._id ? (
              <form onSubmit={() => handleUpdateWeight(data._id)}>
                <input
                  type="number"
                  placeholder="Weight"
                  value={updatedWeight}
                  onChange={(e) => setUpdatedWeight(e.target.value)}
                />
                <button type="submit">Update</button>
                <button onClick={() => setSelectedForUpdate(null)}>Cancel</button>
              </form>
            ) : (
              <button onClick={() => {
                setSelectedForUpdate(data._id);
                setUpdatedWeight(data.weight);
              }}>Update</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Weight;
