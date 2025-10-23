import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Register.css';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation (add real auth later)
    if (fullName && email && password) {
      Swal.fire({
        title: 'Akun anda telah buat!',
        text: 'Selamat, akun berhasil dibuat.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/dashboard');
      });
    } else {
      Swal.fire('Error', 'Mohon isi semua field', 'error');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Masuk</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}

              required
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}

              required
            />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <button type="submit" className="register-btn">Masuk</button>
        </form>
        <p>
          Sudah punya akun? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;