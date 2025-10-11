import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Sidnav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Apakah anda ingin keluar?',
      text: 'Anda akan logout dari sistem.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, keluar!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear session atau token (contoh sederhana)
        localStorage.removeItem('token'); // Asumsikan ada token di localStorage
        // Redirect ke login setelah konfirmasi
        navigate('/login');
        Swal.fire('Logout berhasil!', 'Anda telah keluar.', 'success');
      }
    });
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div style={{
      width: '250px',
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      borderRight: '1px solid #333'
    }}>
      {/* Header BINUS */}
      <div style={{
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '40px',
        color: '#fff'
      }}>
        Menu Keuangan
      </div>

      {/* Menu Dashboard */}
      <div
        onClick={() => handleNavigation('/dashboard')}
        style={{
          padding: '15px 20px',
          cursor: 'pointer',
          backgroundColor: '#333',
          margin: '5px 10px',
          borderRadius: '5px',
          fontSize: '16px'
        }}
      >
        📊Dashboard
      </div>

      {/* Menu Tagihan */}
      <div
        onClick={() => handleNavigation('/tagihan')}
        style={{
          padding: '15px 20px',
          cursor: 'pointer',
          backgroundColor: '#333',
          margin: '5px 10px',
          borderRadius: '5px',
          fontSize: '16px'
        }}
      >
        💸Tagihan
      </div>

      {/* Menu Jenis Tagihan */}
      <div
        onClick={() => handleNavigation('/jenis-tagihan')}
        style={{
          padding: '15px 20px',
          cursor: 'pointer',
          backgroundColor: '#333',
          margin: '5px 10px',
          borderRadius: '5px',
          fontSize: '16px'
        }}
      >
        💵Jenis Tagihan
      </div>

      {/* Tombol Logout */}
      <div
        onClick={handleLogout}
        style={{
          padding: '15px 20px',
          cursor: 'pointer',
          backgroundColor: '#FFFF00',
          color: '#000',
          margin: '5px 10px',
          borderRadius: '5px',
          fontSize: '16px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        Logout
      </div>
    </div>
  );
};

export default Sidnav;