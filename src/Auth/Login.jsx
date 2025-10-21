import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation (add real auth later)
    if (email && password) {
      Swal.fire({
        title: 'Login Berhasil!',
        text: 'Selamat, Login Berhasil.',
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
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
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
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p>
          Belum Punya akun? <Link to="/Register">Masuk</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;