
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidenav from './Sidnav';
import './Dashboard.css'; // Import CSS

const Dashboard = () => {
  const location = useLocation();
  const activeMenu = location.pathname.split('/')[1] || 'dashboard'; // Deteksi menu aktif

  // Data dummy kosong untuk tabel (nanti ganti dengan data dari sistem tagihan)
  const [tableData, _setTableData] = useState([]);

  // Statistik dummy (ganti dengan data real)
  const stats = {
    totalPendaftar: 0,
    totalTagihan: 0,
    dibayarkan: 0
  };

  const columns = [
    { key: 'no', label: 'No' },
    { key: 'nama', label: 'Nama' },
    { key: 'keterangan', label: 'Keterangan' },
    { key: 'nisn', label: 'NISN' },
    { key: 'noHp', label: 'No. HP' },
    { key: 'deskripsi', label: 'Deskripsi' },
    { key: 'harga', label: 'Harga' },
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <div className="dashboard-container">
      <Sidenav activeMenu={activeMenu} />
      <div className="dashboard-content">
        <header>
          <h1>Dashboard</h1>
        </header>

        {/* Kotak Statistik */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Pendaftar</h3>
            <p>{stats.totalPendaftar}</p>
          </div>
          <div className="stat-card">
            <h3>Tagihan</h3>
            <p>{stats.totalTagihan}</p>
          </div>
          <div className="stat-card">
            <h3>Dibayarkan</h3>
            <p>{stats.dibayarkan}</p>
          </div>
        </div>

        {/* Tabel */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="empty-table">Tabel kosong - Data tagihan akan diisi dari sistem</td>
                </tr>
              ) : (
                tableData.map((row, index) => (
                  <tr key={index}>
                    {columns.map((col) => (
                      <td key={col.key}>{row[col.key] || ''}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;