// dashboard.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Dashboard = () => {
  // Data contoh (seperti data login terdaftar otomatis setelah login)
  const [data, setData] = useState([
    { id: 1, email: 'user1@example.com', password: 'pass123' },
    { id: 2, email: 'user2@example.com', password: 'pass456' },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newData, setNewData] = useState({ email: '', password: '' });
  const [editData, setEditData] = useState({ email: '', password: '' });

  // Fungsi tambah data
  const handleAdd = () => {
    if (newData.email && newData.password) {
      const newId = data.length + 1;
      setData([...data, { id: newId, ...newData }]);
      setNewData({ email: '', password: '' });
      setIsAddModalOpen(false);
      Swal.fire('Sukses!', 'Data berhasil ditambahkan.', 'success');
    } else {
      Swal.fire('Error!', 'Email dan password harus diisi.', 'error');
    }
  };

  // Fungsi edit
  const handleEditClick = (item) => {
    Swal.fire({
      title: 'Apakah Anda ingin mengedit?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        setEditingItem(item);
        setEditData({ email: item.email, password: item.password });
        setIsEditModalOpen(true);
      }
    });
  };

  const handleEditSave = () => {
    if (editData.email && editData.password) {
      setData(data.map((item) => (item.id === editingItem.id ? { ...editData, id: item.id } : item)));
      setIsEditModalOpen(false);
      setEditingItem(null);
      Swal.fire('Sukses!', 'Data berhasil diedit.', 'success');
    } else {
      Swal.fire('Error!', 'Email dan password harus diisi.', 'error');
    }
  };

  // Fungsi hapus
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Apakah yakin ingin menghapus?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        setData(data.filter((item) => item.id !== id));
        Swal.fire('Terhapus!', 'Data telah dihapus permanen.', 'success');
      }
    });
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <button onClick={() => setIsAddModalOpen(true)} className="add-btn">
        Tambah Data
      </button>

      {/* Tabel */}
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Email</th>
            <th>Password</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.email}</td>
              <td>{item.password}</td>
              <td>
                <button onClick={() => handleEditClick(item)} className="edit-btn">📝</button>
                <button onClick={() => handleDelete(item.id)} className="delete-btn">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Tambah */}
      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Tambah Data Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={newData.email}
              onChange={(e) => setNewData({ ...newData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={newData.password}
              onChange={(e) => setNewData({ ...newData, password: e.target.value })}
            />
            <button onClick={handleAdd}>Simpan</button>
            <button onClick={() => setIsAddModalOpen(false)}>Batal</button>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Data Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={editData.password}
              onChange={(e) => setEditData({ ...editData, password: e.target.value })}
            />
            <button onClick={handleEditSave}>OK</button>
            <button onClick={() => setIsEditModalOpen(false)}>Batal</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;