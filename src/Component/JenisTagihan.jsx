import React, { useState } from 'react';
import './JenisTagihan.css';
import Swal from 'sweetalert2';
import { FiMenu, FiEdit, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';

const JenisTagihan = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dataJenis, setDataJenis] = useState([
    { no: 1, jenis: 'SPP Bulanan', deskripsi: 'Biaya sekolah bulanan' },
    { no: 2, jenis: 'Uang Seragam', deskripsi: 'Biaya pembelian seragam' },
    { no: 3, jenis: 'Kegiatan Ekstrakurikuler', deskripsi: 'Biaya les tambahan' }
  ]); // Punya isi dummy

  // Filter data
  const filteredData = dataJenis.filter(item =>
    item.jenis?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle navigasi (sama seperti Tagihan)
  const handleNavClick = (path) => {
    window.location.href = path;
  };

  // Handle logout (sama)
  const handleLogout = () => {
    Swal.fire({
      title: 'Apakah Anda ingin keluar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Keluar!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Berhasil!', 'Anda telah logout.', 'success');
        window.location.href = '/menu';
      }
    });
  };

  // Handle tambah
  const handleTambahData = () => {
    Swal.fire({
      title: 'Tambah Jenis Tagihan',
      html: `
        <input type="text" id="jenis" class="swal2-input" placeholder="Jenis Tagihan">
        <input type="text" id="deskripsi" class="swal2-input" placeholder="Deskripsi">
      `,
      showCancelButton: true,
      confirmButtonText: 'Tambah',
      preConfirm: () => {
        const jenis = document.getElementById('jenis').value;
        const deskripsi = document.getElementById('deskripsi').value;
        if (!jenis || !deskripsi) {
          Swal.showValidationMessage('Mohon isi semua field');
          return false;
        }
        const newData = { no: dataJenis.length + 1, jenis, deskripsi };
        setDataJenis([...dataJenis, newData]);
        Swal.fire('Berhasil!', 'Jenis tagihan ditambahkan.', 'success');
      }
    });
  };

  // Handle edit
  const handleEdit = (item) => {
    Swal.fire({
      title: 'Edit Jenis Tagihan',
      html: `
        <input type="text" id="editJenis" class="swal2-input" value="${item.jenis}">
        <input type="text" id="editDeskripsi" class="swal2-input" value="${item.deskripsi}">
      `,
      showCancelButton: true,
      confirmButtonText: 'Edit',
      preConfirm: () => {
        const jenis = document.getElementById('editJenis').value;
        const deskripsi = document.getElementById('editDeskripsi').value;
        setDataJenis(dataJenis.map(d => d.no === item.no ? { ...d, jenis, deskripsi } : d));
        Swal.fire('Berhasil!', 'Data diedit.', 'success');
      }
    });
  };

  // Handle hapus
  const handleHapus = (item) => {
    Swal.fire({
      title: 'Hapus Jenis Tagihan?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!'
    }).then((result) => {
      if (result.isConfirmed) {
        setDataJenis(dataJenis.filter(d => d.no !== item.no));
        Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
      }
    });
  };

  return (
    <div className="jenistagihan-container">
      {/* Sidenav - Sama seperti Tagihan */}
      <nav className="sidenav">
        <div className="sidenav-header">
          <FiMenu className="menu-icon" />
          <h3>Menu Keuangan</h3>
        </div>
        <ul className="sidenav-menu">
          <li onClick={() => handleNavClick('/dashboard')}>
            <span>Dashboard</span>
          </li>
          <li onClick={() => handleNavClick('/tagihan')}>
            <span>Tagihan</span>
          </li>
          <li onClick={() => handleNavClick('/jenis-tagihan')}>
            <span>Jenis Tagihan</span>
          </li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <h1>Halaman Jenis Tagihan</h1>
        
        {/* Search dan Tambah */}
        <div className="table-header">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Cari data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="tambah-btn" onClick={handleTambahData}>
            <FiPlus /> Tambah Data
          </button>
        </div>

        {/* Tabel */}
        <table className="jenistagihan-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Jenis Tagihan</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.no}>
                <td>{item.no}</td>
                <td>{item.jenis}</td>
                <td>{item.deskripsi}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(item)}>
                    <FiEdit />
                  </button>
                  <button className="hapus-btn" onClick={() => handleHapus(item)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default JenisTagihan;