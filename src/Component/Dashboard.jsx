import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import Sidebar from "/Sidebar"; // Import sidebar
import classes from "./Dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState([
    { id: 1, no: 1, nama: 'John Doe', keterangan: 'Pendaftaran sekolah', nisn: '123456', noHP: '08123456789', deskripsi: 'Deskripsi lengkap', harga: 'Rp 100.000', tanggal: '01/01/2023', status: 'Lunas' },
    // Tambahkan data dummy lainnya
  ]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin ingin menghapus?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        setData(data.filter(item => item.id !== id));
        Swal.fire('Dihapus!', 'Data telah dihapus.', 'success');
      }
    });
  };

  return (
    <div className={classes.dashboardContainer}>
      <Sidebar />
      <div className={classes.mainContent}>
        <h1 className={classes.pageTitle}>Dashboard</h1>
        <div className={classes.summaryBoxes}>
          <div className={classes.box}>Total Pendaftar: 50</div> {/* Ganti dengan data dinamis */}
          <div className={classes.box}>Total Tagihan: Rp 500.000</div>
          <div className={classes.box}>Dibayarkan: Rp 300.000</div>
        </div>
        <table className={classes.table}>
          <thead>
            <tr>
              <th style={{ textAlign: 'right' }}>No</th>
              <th style={{ textAlign: 'left' }}>Nama</th>
              <th style={{ textAlign: 'left' }}>Keterangan</th>
              <th style={{ textAlign: 'left' }}>NISN</th>
              <th style={{ textAlign: 'left' }}>No. HP</th>
              <th style={{ textAlign: 'left' }}>Deskripsi</th>
              <th style={{ textAlign: 'right' }}>Harga</th>
              <th>Tanggal</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td style={{ textAlign: 'right' }}>{item.no}</td>
                <td style={{ textAlign: 'left' }}>{item.nama}</td>
                <td style={{ textAlign: 'left' }}>{item.keterangan}</td>
                <td style={{ textAlign: 'left' }}>{item.nisn}</td>
                <td style={{ textAlign: 'left' }}>{item.noHP}</td>
                <td style={{ textAlign: 'left' }}>{item.deskripsi}</td>
                <td style={{ textAlign: 'right' }}>{item.harga}</td>
                <td>{item.tanggal}</td> {/* Format dd/mm/yyyy */}
                <td style={{ textAlign: 'center' }}>{item.status}</td>
                <td style={{ textAlign: 'center' }}>
                  <Link to={`/edit/${item.id}`} className={classes.actionButton}>Edit</Link>
                  <button onClick={() => handleDelete(item.id)} className={classes.actionButton}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;