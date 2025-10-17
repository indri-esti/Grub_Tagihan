import React from 'react';
import { Link } from 'react-router-dom'; // Untuk navigasi ke halaman lain
import Swal from 'sweetalert2'; // Untuk konfirmasi logout
import './sidebar.css'; // Import CSS untuk styling

const Sidebar = () => {
  // Fungsi untuk handle logout
  const handleLogout = () => {
    Swal.fire({
      title: 'Apakah anda ingin keluar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Tidak',
    }).then((result) => {
      if (result.isConfirmed) {
        // Lakukan proses logout (contoh: hapus token dari localStorage)
        localStorage.removeItem('token'); // Hapus token (sesuaikan dengan sistem Anda)
        window.location.href = '/login'; // Redirect ke halaman login
        Swal.fire('Keluar!', 'Anda telah logout.', 'success'); // Muncul pesan sukses
      }
    });
  };

  return (
    <div className="sidebar">
      <h2>Menu Keuangan</h2> {/* Judul sidebar */}
      
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link> {/* Link ke halaman dashboard */}
        </li>
        <li>
          <Link to="/tagihan">Tagihan</Link> {/* Link ke halaman tagihan */}
        </li>
        <li>
          <Link to="/jenis-tagihan">Jenis Tagihan</Link> {/* Link ke halaman jenis tagihan */}
        </li>
      </ul>
      
      <button onClick={handleLogout}>Logout</button> {/* Tombol logout */}
    </div>
  );
};

export default Sidebar;