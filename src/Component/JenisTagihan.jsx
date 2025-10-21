import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Asumsi path Sidebar; sesuaikan jika berbeda
import Swal from 'sweetalert2';
import './JenisTagihan.css'; // Import CSS

const JenisTagihan = () => {
  const [activeTab, setActiveTab] = useState('SPP'); // Default tab: SPP
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({ no: '', deskripsi: '' });
 

  // Dummy data untuk masing-masing tab
  const [dataSPP, setDataSPP] = useState([
    { id: 1, no: 1, deskripsi: 'Biaya sekolah bulanan' }
  ]);
  const [dataSeragam, setDataSeragam] = useState([
    { id: 1, no: 1, deskripsi: 'Pembelian seragam' }
  ]);
  const [dataUangGedung, setDataUangGedung] = useState([
    { id: 1, no: 1, deskripsi: 'Biaya pembangunan gedung' }
  ]);

  const getCurrentData = () => {
    switch (activeTab) {
      case 'SPP': return { data: dataSPP, setter: setDataSPP };
      case 'Seragam': return { data: dataSeragam, setter: setDataSeragam };
      case 'Uang Gedung': return { data: dataUangGedung, setter: setDataUangGedung };
      default: return { data: [], setter: () => {} };
    }
  };

  const handleAddData = () => {
    const { data, setter } = getCurrentData();
    const newItem = { id: Date.now(), no: parseInt(formData.no), deskripsi: formData.deskripsi };
    setter([...data, newItem]);
    setShowAddModal(false);
    setFormData({ no: '', deskripsi: '' });
    Swal.fire('Sukses', 'Data berhasil ditambahkan!', 'success');
  };

  const handleEditData = (item) => {
    setEditData(item);
    setFormData({ no: item.no, deskripsi: item.deskripsi });
    setShowEditModal(true);
  };

  const handleUpdateData = () => {
    const { data, setter } = getCurrentData();
    const updatedData = data.map(item => 
      item.id === editData.id ? { ...item, no: parseInt(formData.no), deskripsi: formData.deskripsi } : item
    );
    setter(updatedData);
    setShowEditModal(false);
    setEditData(null);
    setFormData({ no: '', deskripsi: '' });
    Swal.fire('Sukses', 'Data berhasil diupdate!', 'success');
  };

  const handleDeleteData = (id) => {
    Swal.fire({
      title: 'Apakah anda yakin ingin menghapus?',
      text: 'Data ini tidak bisa dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        const { data, setter } = getCurrentData();
        const filteredData = data.filter(item => item.id !== id);
        setter(filteredData);
        Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
      }
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="jenis-tagihan-container">
      <Sidebar /> {/* Sidebar di kiri, sejajar dengan content */}
      
      <div className="content">
        <h1>Halaman Jenis Tagihan</h1>
        
        {/* Tombol tabs dengan panah di bawah judul */}
        <div className="tabs-container">
          <button 
            className={activeTab === 'SPP' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('SPP')}
          >
            SPP ▼
          </button>
          <button 
            className={activeTab === 'Seragam' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('Seragam')}
          >
            Seragam ▼
          </button>
          <button 
            className={activeTab === 'Uang Gedung' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('Uang Gedung')}
          >
            Uang Gedung ▼
          </button>
        </div>

        {/* Tombol Tambah Data di kanan atas */}
        <div className="header-actions">
          <button className="btn-tambah" onClick={() => setShowAddModal(true)}>
            + Tambah Data
          </button>
        </div>

        {/* Tabel */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th className="no-col">No</th>
                <th className="deskripsi-col">Deskripsi</th>
                <th className="aksi-col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentData().data.map((item) => (
                <tr key={item.id}>
                  <td className="no-cell">{item.no}</td>
                  <td className="deskripsi-cell">{item.deskripsi}</td>
                  <td className="aksi-cell">
                    <button className="" onClick={() => handleEditData(item)}>✏️</button>
                    <button className="" onClick={() => handleDeleteData(item.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Data */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Tambah Data</h2>
            <input 
              type="number" 
              name="no" 
              placeholder="No" 
              value={formData.no} 
              onChange={handleInputChange} 
            />
            <input 
              type="text" 
              name="deskripsi" 
              placeholder="Deskripsi" 
              value={formData.deskripsi} 
              onChange={handleInputChange} 
            />
            <div className="modal-buttons">
              <button onClick={handleAddData}>Simpan</button>
              <button onClick={() => setShowAddModal(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Data */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Data</h2>
            <input 
              type="number" 
              name="no" 
              placeholder="No" 
              value={formData.no} 
              onChange={handleInputChange} 
            />
            <input 
              type="text" 
              name="deskripsi" 
              placeholder="Deskripsi" 
              value={formData.deskripsi} 
              onChange={handleInputChange} 
            />
            <div className="modal-buttons">
              <button onClick={handleUpdateData}>Update</button>
              <button onClick={() => setShowEditModal(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JenisTagihan;
