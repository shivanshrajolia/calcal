import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Profile.css';
import { AuthContext } from '../../context/AuthContext';

const BACKEND_URI = 'https://fkt1tpkn-5000.inc1.devtunnels.ms';

const Profile = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get(`${BACKEND_URI}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      let imageUrl = user.image;

      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        const uploadResponse = await axios.post(`${BACKEND_URI}/api/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        imageUrl = uploadResponse.data.url;
      }

      const response = await axios.put(`${BACKEND_URI}/api/user/profile`, { ...user, image: imageUrl }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setError('');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile">
      <h2>Profile</h2>
      {user.image && <img src={`${BACKEND_URI}${user.image}`} alt="Profile" className="profile-image" />}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={user.name || ''}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email || ''}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={user.age || ''}
          onChange={handleChange}
        />
        <select name="sex" value={user.sex || ''} onChange={handleChange}>
          <option value="">Select Sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="number"
          name="height"
          placeholder="Height"
          value={user.height || ''}
          onChange={handleChange}
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight"
          value={user.weight || ''}
          onChange={handleChange}
        />
        <select
          name="activityLevel"
          value={user.activityLevel || ''}
          onChange={handleChange}
        >
          <option value="">Select Activity Level</option>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="very active">Very Active</option>
        </select>
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
        />
        <button type="submit">Update Profile</button>
      </form>
      <button className="logout" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;