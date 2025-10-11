import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      Swal.fire({
        title: 'Anda berhasil login!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/dashboard'); // Redirect ke dashboard setelah alert
      });
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Username dan password tidak boleh kosong.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Navigasi ke halaman register
  };

  return (
    <div className="login-container">
      <style jsx>{`
        .login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a0b2e 0%, #4a0e5a 50%, #8b5cf6 100%);
          background-image: 
            radial-gradient(ellipse at bottom, #ff6b6b 0%, transparent 70%),
            linear-gradient(to top, #000 0%, transparent 50%);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }
        .login-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon fill="%23ff6b6b" opacity="0.1" points="0,100 100,80 80,100"/><path fill="%23663d97" opacity="0.05" d="M0 100 Q50 80 100 100 L100 100 Z"/></svg>'); /* Simulasi gunung/matahari */
          background-size: cover;
          z-index: 1;
        }
        .login-form {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          z-index: 2;
          text-align: center;
        }
        .login-form h2 {
          color: white;
          margin-bottom: 30px;
          font-size: 28px;
          font-weight: bold;
        }
        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }
        .form-group label {
          color: rgba(255, 255, 255, 0.8);
          display: block;
          margin-bottom: 5px;
          font-size: 14px;
        }
        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 16px;
          backdrop-filter: blur(5px);
        }
        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        .login-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #8b5cf6, #4a0e5a);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-bottom: 20px;
          transition: transform 0.2s;
        }
        .login-btn:hover {
          transform: translateY(-2px);
        }
        .register-link {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 14px;
          cursor: pointer;
          transition: color 0.2s;
          }
        .register-link:hover {
          color: white;
          text-decoration: underline;
        }
      `}</style>
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label>Akun Email</label>
          <input
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">Login</button>
        <div>
          <span>Belum Punya Akun? </span>
          <a href="#" className="register-link" onClick={handleRegisterClick}>
            Masuk
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;