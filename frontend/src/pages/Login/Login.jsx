import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { AuthContext } from '../../context/AuthContext';

const BACKEND_URI = 'https://fkt1tpkn-5000.inc1.devtunnels.ms';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URI}/api/user/login`, { email, password });
      login(response.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
  <div className="login">

    <div className="topbar">
      <h1>Calcal</h1> 

    </div>

    <div className="container">
      <div className="login-container">
        {/* <h2>Login</h2> */}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* <h3>Email</h3> */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* <h3>Password</h3> */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <div className="link"> Do not have an account? <Link to="/register"> Register here.</Link></div>
        </form>
      </div>
    </div>    
    </div>
  );
};

export default Login;