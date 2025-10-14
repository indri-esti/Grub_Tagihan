import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import Sidebar from "/Sidebar";  // Pastikan path ini benar
import classes from "./Jenistagihan.css";  // Pastikan file CSS ada

const Jenistagihan = () => {
  const [selectedType, setSelectedType] = useState('seragam');  // Hapus underscore
  const [data, setData] = useState({  // Hapus underscore dari _data dan _setData
    seragam: [
      { id: 1, no: 1, deskripsi: 'Deskripsi seragam 1' },
      { id: 2, no: 2, deskripsi: 'Deskripsi seragam 2' },
    ],
    spp: [
      { id: 3, no: 3, deskripsi: 'Deskripsi SPP 1' },
    ],
    uanggedung: [
      { id: 4, no: 4, deskripsi: 'Deskripsi uang gedung 1' },
    ],
  });  // Tambahkan data dummy untuk tiap jenis

  const handleDelete = (id) => {  // Hapus underscore dan implementasikan
    Swal.fire({
      title: 'Apakah Anda yakin ingin menghapus?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Hapus data dari jenis yang dipilih
        const updatedData = { ...data };
        updatedData[selectedType] = updatedData[selectedType].filter(item => item.id !== id);
        setData(updatedData);
        Swal.fire('Dihapus!', 'Data telah dihapus.', 'success');
      }
    });
  };

  const addData = () => {  // Implementasikan fungsi
    const newItem = {
      id: data[selectedType].length + 1 + data.seragam.length + data.spp.length,  // Auto-increment ID sederhana
      no: data[selectedType].length + 1,
      deskripsi: 'Deskripsi baru untuk ' + selectedType,  // Di dunia nyata, gunakan form input
    };

    const updatedData = { ...data };
    updatedData[selectedType].push(newItem);  // Tambahkan ke array yang dipilih
    setData(updatedData);
    // Otomatis update: Data sudah di state, jadi akan re-render
  };

  // Ambil data berdasarkan selectedType
  const currentData = data[selectedType] || [];  // Hindari error jika array kosong

  return (
    <div className={classes.jenisContainer}>
      <Sidebar />
      <div className={classes.mainContent}>
        <h1 className={classes.pageTitle}>Jenis Tagihan</h1>
        <div className={classes.typeButtons}>
          <button onClick={() => setSelectedType('seragam')}>Seragam</button>
          <button onClick={() => setSelectedType('spp')}>SPP</button>
          <button onClick={() => setSelectedType('uanggedung')}>Uang Gedung</button>
          <button onClick={addData} className={classes.addButton}>Tambah Data</button>
        </div>
        <table className={classes.table}>
          <thead>
            <tr>
              <th style={{ textAlign: 'right' }}>No</th>
              <th style={{ textAlign: 'left' }}>Deskripsi</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (  // Cek jika ada data
              currentData.map(item => (
                <tr key={item.id}>
                  <td style={{ textAlign: 'right' }}>{item.no}</td>
                  <td style={{ textAlign: 'left' }}>{item.deskripsi}</td>
                  <td style={{ textAlign: 'center' }}>
                    <Link to={`/edit/${item.id}`} className={classes.actionButton}>
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className={classes.actionButton}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>Tidak ada data untuk {selectedType}</td>  // Pesan jika data kosong
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Jenistagihan;
