import React, { _useState } from 'react';
import './tambahtagihan.css'; // Import stylesheet

const _TambahTagihan = () => {
  const [formData, setFormData] = '_useState'({
    namaTagihan: '',
    jumlah: '',
    tanggal: '',
    jenis: '' // Untuk Jenis Tagihan jika relevan
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logika submit: Kirim data ke API atau simpan lokal
    console.log('Data baru ditambahkan:', formData);
    alert('Data berhasil ditambahkan!'); // Placeholder untuk feedback
    // Reset form
    setFormData({
      namaTagihan: '',
      jumlah: '',
      tanggal: '',
      jenis: ''
    });
  };

  return (
    <div className="tambah-data-container">
      <h2 className="title">Tambah Data Tagihan</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label htmlFor="namaTagihan">Nama Tagihan:</label>
          <input
            type="text"
            id="namaTagihan"
            name="namaTagihan"
            value={formData.namaTagihan}
            onChange={handleInputChange}
            required
            placeholder="Masukkan nama tagihan"
          />
        </div>
        <div className="input-group">
          <label htmlFor="jumlah">Jumlah (Rp):</label>
          <input
            type="number"
            id="jumlah"
            name="jumlah"
            value={formData.jumlah}
            onChange={handleInputChange}
            required
            placeholder="0"
          />
        </div>
        <div className="input-group">
          <label htmlFor="tanggal">Tanggal:</label>
          <input
            type="date"
            id="tanggal"
            name="tanggal"
            value={formData.tanggal}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="jenis">Jenis Tagihan:</label>
          <select
            id="jenis"
            name="jenis"
            value={formData.jenis}
            onChange={handleInputChange}
            required
          >
            <option value="">Pilih Jenis</option>
            <option value="Listrik">Listrik</option>
            <option value="Air">Air</option>
            <option value="Internet">Internet</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Tambah Data</button>
      </form>
      <button className="back-btn" onClick={() => window.history.back()}>
        Kembali ke Menu
      </button>
    </div>
  );
};

export default '_TambahTagihan';