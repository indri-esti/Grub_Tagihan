import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Asumsikan path import Sidebar Anda
import Swal from 'sweetalert2';
import './Tagihan.css'; // Import CSS khusus

const Tagihan = () => {
  // Data dummy tabel (bisa diganti dengan API fetch)
  const [dataTagihan, setDataTagihan] = useState([
    {
      id: 1,
      no: 1,
      nama: 'John Doe',
      keterangan: 'SPP',
      nisn: '123456',
      noHp: '08123456789',
      deskripsi: 'Pembayaran SPP',
      harga: 500000,
      tanggal: new Date('2025-10-16'),
      status: 'Lunas'
    },
    // Tambahkan data dummy lain jika diperlukan
  ]);

  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data berdasarkan search (pencarian global)
  const filteredData = dataTagihan.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nisn.includes(searchTerm) ||
    item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format tanggal Indonesia dd/mm/yyyy
  const formatTanggal = (date) => {
    return date.toLocaleDateString('id-ID');
  };

  // Fungsi tambah data
  const handleTambah = () => {
    setCurrentData({
      id: Date.now(),
      no: dataTagihan.length + 1,
      nama: '',
      keterangan: '',
      nisn: '',
      noHp: '',
      deskripsi: '',
      harga: 0,
      tanggal: new Date(),
      status: 'Belum Lunas'
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // Fungsi edit data
  const handleEdit = (item) => {
    setCurrentData({ ...item });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Fungsi hapus data dengan SweetAlert
  const handleHapus = (id) => {
    Swal.fire({
      title: 'Apakah anda yakin ingin menghapus?',
      text: 'Data ini tidak bisa dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        setDataTagihan(prev => prev.filter(item => item.id !== id));
        // Kirim ke dashboard: Asumsikan dispatch action atau props callback
        console.log('Data terhapus dan dikirim ke dashboard');
        Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
      }
    });
  };

  // Fungsi simpan data (tambah/edit)
  const handleSimpan = (e) => {
    e.preventDefault();
    if (!currentData.nama || !currentData.nisn || !currentData.harga) {
      Swal.fire('Error!', 'Lengkapi data wajib (Nama, NISN, Harga).', 'error');
      return;
    }

    if (isEditMode) {
      setDataTagihan(prev => prev.map(item => 
        item.id === currentData.id ? currentData : item
      ));
    } else {
      setDataTagihan(prev => [...prev, currentData]);
    }

    setIsModalOpen(false);
    // Kirim ke dashboard: Asumsikan dispatch action atau props callback
    console.log('Data disimpan dan dikirim ke dashboard');
    Swal.fire('Berhasil!', isEditMode ? 'Data berhasil diupdate.' : 'Data berhasil ditambahkan.', 'success');
  };

  // Handle input change di modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentData(prev => ({
      ...prev,
      [name]: name.includes('harga') || name.includes('noHp') || name.includes('nisn') ? value : value
    }));
  };

  // Handle tanggal change
  const handleTanggalChange = (e) => {
    setCurrentData(prev => ({ ...prev, tanggal: new Date(e.target.value) }));
  };

  return (
    <div className="tagihan-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Konten Utama */}
      <div className="main-content">
        <h1 className="page-title">Tagihan</h1>

        {/* Bar pencarian dan tombol tambah */}
        <div className="header-actions">
          <div className="search-container">
            <i className="search-icon">🔍</i> {/* Icon pencarian sederhana */}
            <input
              type="text"
              placeholder="Cari tagihan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="tambah-btn" onClick={handleTambah}>
            Tambah Data
          </button>
        </div>

        {/* Tabel */}
        <div className="table-container">
          <table className="tagihan-table">
            <thead>
              <tr>
                <th className="no-col">No</th> {/* Rata kanan */}
                <th className="nama-col">Nama</th> {/* Rata kiri */}
                <th className="keterangan-col">Keterangan</th> {/* Rata kiri */}
                <th className="nisn-col">NISN</th> {/* Rata kiri */}
                <th className="hp-col">No. HP</th> {/* Rata kiri */}
                <th className="deskripsi-col">Deskripsi</th> {/* Rata kiri */}
                <th className="harga-col">Harga</th> {/* Rata kanan */}
                <th className="tanggal-col">Tanggal</th> {/* Default kiri, format ID */}
                <th className="status-col">Status</th> {/* Rata tengah */}
                <th className="aksi-col">Aksi</th> {/* Rata tengah */}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="no-data text-right">{item.no}</td>
                    <td className="nama-data text-left">{item.nama}</td>
                    <td className="keterangan-data text-left">{item.keterangan}</td>
                    <td className="nisn-data text-left">{item.nisn}</td>
                    <td className="hp-data text-left">{item.noHp}</td>
                    <td className="deskripsi-data text-left">{item.deskripsi}</td>
                    <td className="harga-data text-right">Rp {item.harga.toLocaleString('id-ID')}</td>
                    <td className="tanggal-data">{formatTanggal(item.tanggal)}</td>
                    <td className="status-data text-center">{item.status}</td>
                    <td className="aksi-data text-center">
                      <button className="edit-btn" onClick={() => handleEdit(item)}>🖊</button>
                      <button className="hapus-btn" onClick={() => handleHapus(item.id)}>🗑</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-data-row">Tidak ada data tagihan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal untuk Tambah/Edit */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{isEditMode ? 'Edit Tagihan' : 'Tambah Tagihan'}</h2>
              <form onSubmit={handleSimpan}>
                <input
                  type="text"
                  name="nama"
                  placeholder="Nama"
                  value={currentData.nama}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="keterangan"
                  placeholder="Keterangan"
                  value={currentData.keterangan}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="nisn"
                  placeholder="NISN"
                  value={currentData.nisn}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="noHp"
                  placeholder="No. HP"
                  value={currentData.noHp}
                  onChange={handleInputChange}
                />
                <textarea
                  name="deskripsi"
                  placeholder="Deskripsi"
                  value={currentData.deskripsi}
                  onChange={handleInputChange}
                  rows="3"
                />
                <input
                  type="number"
                  name="harga"
                  placeholder="Harga"
                  value={currentData.harga}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="date"
                  value={currentData.tanggal.toISOString().split('T')[0]}
                  onChange={handleTanggalChange}
                />
                <select
                  name="status"
                  value={currentData.status}
                  onChange={handleInputChange}
                >
                  <option value="Belum Lunas">Belum Lunas</option>
                  <option value="Lunas">Lunas</option>
                </select>
                <div className="modal-actions">
                  <button type="submit">Simpan</button>
                  <button type="button" onClick={() => setIsModalOpen(false)}>Batal</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tagihan;
