import React, { useState, useEffect } from 'react'; // Fixed: tambah useEffect ke import
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Tagihan.css';


const Tagihan = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  // Tambahkan dummy data untuk testing (hapus jika data dari API)
  const [dataTagihan, setDataTagihan] = useState([
    {
      id: 1,
      nama: 'John Doe',
      keterangan: 'Tagihan Bulanan',
      nisn: '123456789',
      noHp: '08123456789',
      deskripsiBarang: 'Buku Pelajaran',
      harga: '50000',
      tanggal: '2023-10-01',
      status: 'Belum Bayar'
    },
    {
      id: 2,
      nama: 'Jane Smith',
      keterangan: 'Tagihan SPP',
      nisn: '987654321',
      noHp: '08987654321',
      deskripsiBarang: 'Uang Seragam',
      harga: '100000',
      tanggal: '2023-10-05',
      status: 'Sudah Bayar'
    }
  ]);

  // Fixed: useEffect dengan fetch simulasi (ganti dengan API real)
  useEffect(() => {
    // Contoh fetch real: 
    // fetch('/api/tagihan').then(res => res.json()).then(setDataTagihan);
    console.log('Data tagihan di-load dari sistem dashboard');
  }, []);

  // Fixed: Filter dengan optional chaining untuk hindari crash jika properti undefined
  const filteredData = dataTagihan.filter(item => {
    const nama = item.nama?.toLowerCase() || '';
    const nisn = item.nisn?.toLowerCase() || '';
    const keterangan = item.keterangan?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return nama.includes(term) || nisn.includes(term) || keterangan.includes(term);
  });

  // Fungsi tambah data
  const handleTambahData = () => {
    Swal.fire({
      title: 'Tambah Data Tagihan',
      text: 'Apakah Anda ingin menambahkan data baru?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Tambah!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/tambah-tagihan'); // Pastikan route ini ada
      }
    });
  };

  // Fixed: Syntax error di navigate - pakai backticks untuk template literal
  const handleEdit = (id) => {
    Swal.fire({
      title: 'Edit Data',
      text: 'Apakah Anda ingin mengedit data ini?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Edit!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/edit-tagihan/${id}`); // Fixed: backticks untuk ${id}
      }
    });
  };

  // Fungsi hapus
  const handleHapus = (id) => {
    Swal.fire({
      title: 'Hapus Data',
      text: 'Apakah Anda yakin ingin menghapus data ini? Aksi ini tidak bisa dibatalkan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        setDataTagihan(dataTagihan.filter(item => item.id !== id));
        Swal.fire('Terhapus!', 'Data telah dihapus.', 'success');
        // Kirim ke API: fetch(`/api/tagihan/${id}`, { method: 'DELETE' });
      }
    });
  };

  // Fungsi logout
  const handleLogout = () => {
    Swal.fire({
      title: 'Logout',
      text: 'Apakah Anda ingin keluar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Keluar!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/menu'); // Pastikan route ini ada
      }
    });
  };

  return (
    <div className="tagihan-container">
      {/* Sidenav Kiri */}
      <nav className="sidenav">
        <h2>Menu Keuangan</h2>
        <ul>
          <li>
            <Link to="/dashboard" className="nav-item">
              <span className="icon">📊</span> Dashboard
            </Link>
          </li>
          <li className="active">
            <Link to="/tagihan" className="nav-item">
              <span className="icon">💸</span> Tagihan
            </Link>
          </li>
          <li>
            <Link to="/jenis-tagihan" className="nav-item">
              <span className="icon">💵</span> Jenis Tagihan
            </Link>
          </li>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        </ul>
      </nav>

      {/* Area Utama */}
      <main className="main-content">
        <div className="header">
          <h1>Halaman Tagihan</h1>
        </div>

        {/* Pencarian dan Tombol Tambah */}
        <div className="search-add-container">
          <input
            type="text"
            placeholder="Cari data tagihan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={handleTambahData} className="tambah-btn">
            + Tambah Data
          </button>
        </div>

        {/* Tabel */}
        <div className="table-container">
          <table className="tagihan-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Keterangan</th>
                <th>NISN</th>
                <th>No. HP</th>
                <th>Deskripsi Barang</th>
                <th>Harga</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="empty-state">
                    Tidak ada data tagihan. Tambahkan data baru dari dashboard.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.nama || 'N/A'}</td> {/* Fallback jika undefined */}
                    <td>{item.keterangan || 'N/A'}</td>
                    <td>{item.nisn || 'N/A'}</td>
                    <td>{item.noHp || 'N/A'}</td>
                    <td>{item.deskripsiBarang || 'N/A'}</td>
                    <td>{item.harga || 'N/A'}</td>
                    <td>{item.tanggal || 'N/A'}</td>
                    <td>
                      {/* Fixed: Syntax error - pakai backticks untuk template literal */}
                      <span className={`status ${item.status || ''}`}>
                        {item.status || 'N/A'}
                      </span>
                    </td>
                    <td className="aksi">
                      <button onClick={() => handleEdit(item.id)} className="edit-btn">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleHapus(item.id)} className="hapus-btn">
                        🗑️ Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Tagihan;
