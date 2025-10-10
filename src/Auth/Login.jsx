import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Email dan password harus diisi.',
      });
      return;
    }

    // Simulate login success
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Anda sudah berhasil login!',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      // Redirect to menu/dashboard page after alert
      navigate('/dashboard'); // Ganti dengan rute halaman menu Anda
    });
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Navigasi ke halaman register
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '300px', 
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0',
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333',
          fontSize: '24px',
          fontWeight: 'bold',
        }}>
          Login
        </h2>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontSize: '14px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                background: 'linear-gradient(to right, #fff, #fff)',
                fontSize: '12px',
              }}
              placeholder="Masukkan email Anda"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontSize: '14px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                background: 'linear-gradient(to right, #fff, #fff)',
                fontSize: '16px',
              }}
              placeholder="Masukkan password Anda"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <label style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Setuju 
            </label>
            <a href="#" style={{ color: '#007bff', fontSize: '14px', textDecoration: 'none' }}>
              Lupa Password?
            </a>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: ' #18e3f1ff', 
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '20px',
            }}
          >
            Login
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '14px',
        }}>
          Belum Punya Akun Ya?{' '}
          <span
            onClick={handleRegisterClick}
            style={{
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: 'bold',
            }}
          >
            Masuk
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;