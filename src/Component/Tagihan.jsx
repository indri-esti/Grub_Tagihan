import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "/Sidebar";  // Pastikan path ini benar
import classes from "./Tagihan.css";  // Pastikan file CSS ada

const Tagihan = () => {
  // 1. Isi data dummy untuk menghindari error rendering
  const [data, setData] = useState([
    { id: 1, no: 1, nama: 'John Doe', keterangan: 'Tagihan sekolah', nisn: '123456', noHP: '08123456789', deskripsi: 'Deskripsi lengkap tagihan', harga: 'Rp 100.000', tanggal: '01/01/2023', status: 'Belum Lunas' },
    { id: 2, no: 2, nama: 'Jane Smith', keterangan: 'Tagihan lain', nisn: '654321', noHP: '08123456788', deskripsi: 'Deskripsi tagihan kedua', harga: 'Rp 200.000', tanggal: '02/01/2023', status: 'Lunas' },
    // Tambahkan lebih banyak data jika perlu
  ]);

  const [search, setSearch] = useState('');  // Ganti _search dengan search untuk kesederhanaan

  const handleDelete = (id) => {  // Ganti _handleDelete dan _Id dengan nama biasa
    Swal.fire({
      title: 'Apakah Anda yakin ingin menghapus?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Hapus data dari state
        setData(data.filter(item => item.id !== id));
        Swal.fire('Dihapus!', 'Data telah dihapus.', 'success');
      }
    });
  };

  const addData = () => {
    // Logika tambah data: Buat data baru dan tambahkan ke state
    const newData = {
      id: data.length + 1,  // Auto-increment ID sederhana
      no: data.length + 1,
      nama: 'Nama Baru',  // Di dunia nyata, gunakan form input
      keterangan: 'Keterangan baru',
      nisn: 'NISN Baru',
      noHP: 'No HP Baru',
      deskripsi: 'Deskripsi baru',
      harga: 'Rp 0',
      tanggal: '01/01/2023',  // Gunakan date library untuk format yang benar
      status: 'Belum Lunas'
    };
    setData([...data, newData]);  // Tambahkan ke state
    // Untuk "Kirim ke dashboard": Gunakan Context API atau props untuk berbagi data
    // Contoh: Jika menggunakan Context, dispatch ke state global
  };

  // Filter data berdasarkan search (opsional, untuk fungsi pencarian)
  const filteredData = data.filter(item =>
    item.nama.toLowerCase().includes(search.toLowerCase()) ||  // Cari berdasarkan nama
    item.keterangan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={classes.tagihanContainer}>
      <Sidebar />
      <div className={classes.mainContent}>
        <h1 className={classes.pageTitle}>Tagihan</h1>
        <div className={classes.headerActions}>
          <input
            type="text"
            placeholder="Cari..."
            onChange={(e) => setSearch(e.target.value)}  // Update state search
            className={classes.searchInput}
          />
          <button onClick={addData} className={classes.addButton}>
            Tambah Data
          </button>
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
              <th>Tanggal</th>  {/* Format dd/mm/yyyy */}
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (  // Cek jika ada data untuk hindari error
              filteredData.map(item => (
                <tr key={item.id}>
                  <td style={{ textAlign: 'right' }}>{item.no}</td>
                  <td style={{ textAlign: 'left' }}>{item.nama}</td>
                  <td style={{ textAlign: 'left' }}>{item.keterangan}</td>
                  <td style={{ textAlign: 'left' }}>{item.nisn}</td>
                  <td style={{ textAlign: 'left' }}>{item.noHP}</td>
                  <td style={{ textAlign: 'left' }}>{item.deskripsi}</td>
                  <td style={{ textAlign: 'right' }}>{item.harga}</td>
                  <td>{item.tanggal}</td>
                  <td style={{ textAlign: 'center' }}>{item.status}</td>
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
                <td colSpan="10" style={{ textAlign: 'center' }}>Tidak ada data</td>  // Pesan jika data kosong
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tagihan;
