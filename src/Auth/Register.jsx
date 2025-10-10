import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Register.css'; 


const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    agreeTerms: false
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      Swal.fire('Error', 'Anda harus setuju dengan syarat dan ketentuan.', 'error');
      return;
    }
    // Simulate successful registration (no real API)
    Swal.fire({
      title: 'Success!',
      text: 'Anda sudah berhasil mendaftar!',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      navigate('/dashboard'); // Navigate to dashboard after success
    });
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>Masuk</h2>
        
      </div>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>
        <div className="terms-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            Remember 
          </label>
        </div>
        <button type="submit" className="register-btn">Masuk</button>
      </form>
      <div className="login-link">
        <p>Sudah punya akun? </p>
        <button type="button" onClick={handleLoginClick} className="login-btn">
          Login
        </button>
      </div>
      {/* Bottom navigation hint - matches image, but full in Dashboard */}
      <div className="bottom-nav-placeholder">
        <p>Agak laen</p>
      </div>
    </div>
  );
};

export default Register;