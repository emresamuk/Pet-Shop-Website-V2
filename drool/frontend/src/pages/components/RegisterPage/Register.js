import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './Register.css';

function Register() {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      console.log('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: user.fullName,
          email: user.email,
          password: user.password,
          confirmPassword: user.confirmPassword,
        }),
      });
      const data = await response.json();
      if (response.status === 201) {
        console.log('Registration successful', data);
        navigate('/login');
      } else {
        console.log('Registration failed', data.message);
      }
    } catch (error) {
      console.error('Registration error', error);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h2 className="register-title">Register</h2>
        <div className="input-group">
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            value={user.fullName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            value={user.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={user.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={user.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="register-button">Register</button>
        <p className="switch-form">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
