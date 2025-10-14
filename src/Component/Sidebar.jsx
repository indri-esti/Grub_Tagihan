import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import classes from "./Sidebar.css"; // Import CSS module

const Sidebar = () => {
  const handleLogout = () => {
    Swal.fire({
      title: 'Apakah Anda ingin keluar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Logika logout: Hapus token atau navigasi ke login
        Swal.fire('Keluar!', 'Anda telah logout.', 'success');
        // Navigasi ke halaman login (ganti dengan rute Anda)
        window.location.href = '/login'; // Atau gunakan history.push jika di dalam Router
      }
    });
  };

  return (
    <div className={classes.sidebar}>
      <h2 className={classes.title}>Menu Keuangan</h2>
      <ul className={classes.menuList}>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/tagihan">Tagihan</Link></li>
        <li><Link to="/jenistagihan">Jenis Tagihan</Link></li>
      </ul>
      <button onClick={handleLogout} className={classes.logoutButton}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;