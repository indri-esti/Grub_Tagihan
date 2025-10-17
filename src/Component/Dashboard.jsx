import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Asumsi path Sidebar sesuai lokasi file Anda
import Swal from 'sweetalert2';
import './Dashboard.css'; // Import CSS untuk styling

const Dashboard = () => {
  // Data dummy untuk tabel (bisa diganti dengan API/fetch)
  const [data, setData] = useState([
    {
      id: 1,
      no: 1,
      nama: 'John Doe',
      keterangan: 'SPP',
      nisn: '1234567890',
      noHP: '08123456789',
      deskripsi: 'Membayar SPP',
      harga: 200000,
      tanggal: '01/10/2025',
      status: 'Dibayar'
    },
    {
      id: 2,
      no: 2,
      nama: 'Jane Smith',
      keterangan: 'Uang Gedung',
      nisn: '0987654321',
      noHP: '08987654321',
      deskripsi: 'Membayar Uang Gedung',
      harga: 500000,
      tanggal: '02/10/2025',
      status: 'Belum Dibayar'
    },
    {
      id: 3,
      no: 3,
      nama: 'Bob Johnson',
      keterangan: 'Seragam',
      nisn: '1122334455',
      noHP: '08765432109',
      deskripsi: 'Membayar Seragam',
      harga: 900000,
      tanggal: '03/10/2025',
      status: 'Dibayar'
    }
  ]);

  // State untuk edit modal
  const [editModal, setEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Fungsi hitung total otomatis
  const totalPendaftar = data.length;
  const totalTagihan = data.reduce((sum, item) => sum + item.harga, 0);
  const totalDibayarkan = data.filter(item => item.status === 'Dibayar').length;

  // Fungsi format tanggal ke dd/mm/yyyy (sudah dalam state, tapi jika dari Date object)
  const formatTanggal = (dateString) => {
    // Asumsi dateString adalah string, jika Date: new Date(dateString).toLocaleDateString('id-ID')
    return dateString; 
  };

  // Fungsi edit
  const handleEdit = (item) => {
    setEditItem(item);
    setEditModal(true);
  };

  // Fungsi save edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editItem) {
      setData(data.map(item => item.id === '_editItem.id' ? editItem : item));
      setEditModal(false);
      setEditItem(null);
      Swal.fire('Berhasil!', 'Data berhasil diupdate.', 'success');
    }
  };

  // Fungsi hapus dengan SweetAlert
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Apakah anda yakin ingin menghapus?',
      text: 'Data akan terhapus permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        setData(data.filter(item => item.id !== id));
        Swal.fire('Dihapus!', 'Data berhasil dihapus.', 'success');
      }
    });
  };

  // Handle change input edit
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditItem({ ...editItem, [name]: value });
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Dashboard</h1>
        
        {/* Kotak Statistik */}
        <div className="stats-container">
          <div className="stat-box">
            <h3>Total Pendaftar</h3>
            <p>{totalPendaftar}</p>
          </div>
          <div className="stat-box">
            <h3>Total Tagihan</h3>
        <p>Rp {totalTagihan.toLocaleString('id-ID')}</p>
          </div>
          <div className="stat-box">
            <h3>Dibayarkan</h3>
            <p>{totalDibayarkan}</p>
          </div>
        </div>

        {/* Tabel */}
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>No</th>
                <th style={{ textAlign: 'left' }}>Nama</th>
                <th style={{ textAlign: 'left' }}>Keterangan</th>
                <th style={{ textAlign: 'left' }}>NISN</th>
                <th style={{ textAlign: 'left' }}>No. HP</th>
                <th style={{ textAlign: 'left' }}>Deskripsi</th>
                <th style={{ textAlign: 'right' }}>Harga</th>
                <th style={{ textAlign: 'left' }}>Tanggal</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td style={{ textAlign: 'right' }}>{item.no}</td>
                  <td style={{ textAlign: 'left' }}>{item.nama}</td>
                  <td style={{ textAlign: 'left' }}>{item.keterangan}</td>
                  <td style={{ textAlign: 'left' }}>{item.nisn}</td>
                  <td style={{ textAlign: 'left' }}>{item.noHP}</td>
                  <td style={{ textAlign: 'left' }}>{item.deskripsi}</td>
                  <td style={{ textAlign: 'right' }}>Rp {item.harga.toLocaleString('id-ID')}</td>
                  <td style={{ textAlign: 'left' }}>{formatTanggal(item.tanggal)}</td>
                  <td style={{ textAlign: 'center' }}>{item.status}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="action-btn edit-btn" onClick={() => handleEdit(item)}>🖊</button>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(item.id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Edit */}
        {editModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Data</h2>
              <form onSubmit={handleSaveEdit}>
                <input type="text" name="nama" placeholder="Nama" value={editItem?.nama || ''} onChange={handleInputChange} required />
                <input type="text" name="keterangan" placeholder="Keterangan" value={editItem?.keterangan || ''} onChange={handleInputChange} required />
                <input type="text" name="nisn" placeholder="NISN" value={editItem?.nisn || ''} onChange={handleInputChange} required />
                <input type="text" name="noHP" placeholder="No. HP" value={editItem?.noHP || ''} onChange={handleInputChange} required />
                <textarea name="deskripsi" placeholder="Deskripsi" value={editItem?.deskripsi || ''} onChange={handleInputChange} required />
                <input type="number" name="harga" placeholder="Harga" value={editItem?.harga || ''} onChange={handleInputChange} required />
                <input type="date" name="tanggal" value={editItem?.tanggal ? editItem.tanggal.split('/').reverse().join('-') : ''} onChange={handleInputChange} required />
                <select name="status" value={editItem?.status || ''} onChange={handleInputChange} required>
                  <option value="Dibayar">Dibayar</option>
                  <option value="Belum Dibayar">Belum Dibayar</option>
                </select>
                <div className="modal-actions">
                  <button type="submit">Simpan</button>
                  <button type="button" onClick={() => { setEditModal(false); setEditItem(null); }}>Batal</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;