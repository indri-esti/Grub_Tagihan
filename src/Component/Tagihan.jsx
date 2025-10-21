import React, { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import './Tagihan.css';
import Sidebar from './Sidebar'; // Import Sidebar
import { FaSearch, FaTrashAlt } from 'react-icons/fa'; // Icon untuk Search, Plus, Edit, Hapus
import { useNavigate } from 'react-router-dom'; // Gunakan useNavigate untuk navigasi

// DATA DUMMY (Asumsi data ini dikelola di komponen induk seperti App.js)
const initialDataTagihan = [
    { no: 1, nama: 'John Doe', keterangan: 'SPP', nisn: '1234567890', noHp: '08123456789', deskripsi: 'Pembayaran SPP bulan Oktober', harga: 200000, tanggal: '10/10/2025', status: 'Lunas' },
    { no: 2, nama: 'Jane Smith', keterangan: 'Uang Gedung', nisn: '0987654321', noHp: '08987654321', deskripsi: 'Angsuran Uang Gedung ke-1', harga: 500000, tanggal: '13/10/2025', status: 'Belum Lunas' },
    { no: 3, nama: 'Bob Johnson', keterangan: 'Seragam', nisn: '1122334455', noHp: '08765432109', deskripsi: 'Pembelian Seragam Sekolah', harga: 900000, tanggal: '20/10/2025', status: 'Lunas' },
];

// Komponen Tagihan menerima data dan fungsi update dari props (Asumsi App.js)
const Tagihan = ({ dataTagihan = initialDataTagihan, setDataTagihan = () => {} }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Fungsi untuk memformat harga ke Rupiah
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka);
    };

    // Kalkulasi Ringkasan Data
    const summaryData = useMemo(() => {
        const totalTagihan = dataTagihan.reduce((sum, item) => sum + Number(item.harga), 0);
        const lunasCount = dataTagihan.filter(item => item.status === 'Lunas').length;
        const belumLunasCount = dataTagihan.filter(item => item.status === 'Belum Lunas').length;
        // Hitung member unik
        const totalMember = new Set(dataTagihan.map(item => item.nama)).size; 

        return {
            totalMember,
            totalTagihan: formatRupiah(totalTagihan),
            dibayarkan: lunasCount,
            belumDibayarkan: belumLunasCount,
        };
    }, [dataTagihan]);

    // Filter data berdasarkan pencarian Nama
    const filteredData = useMemo(() => {
        if (!searchTerm) return dataTagihan;

        return dataTagihan.filter((item) =>
            item.nama.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [dataTagihan, searchTerm]);

    // Handle Hapus dengan SweetAlert (Menggunakan setDataTagihan dari props)
    const handleDelete = (no) => {
        Swal.fire({
            title: 'Apakah Anda yakin ingin menghapus?',
            text: 'Data tagihan ini akan dihapus permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                // Hapus data (simulasi update state di App.js)
                setDataTagihan((prevData) => prevData.filter((item) => item.no !== no));
                Swal.fire('Terhapus!', 'Data tagihan berhasil dihapus.', 'success');
            }
        });
    };

    // Handle Edit (Navigasi ke halaman Edit)
    const handleEdit = (item) => {
        // Navigasi ke halaman/route edit dengan membawa data tagihan (state)
        // Pastikan Anda sudah membuat route /tagihan/edit/:id di App.js
        navigate(`/tagihan/edit/${item.no}`, { state: { tagihan: item } });
    };

    // Handle Tambah Data (Navigasi ke halaman Tambah)
    const handleTambahData = () => {
        // Pastikan Anda sudah membuat route /tagihan/tambah di App.js
        navigate('/tagihan/tambah');
    };
    
    // Komponen Ringkasan Kartu
    const SummaryCard = ({ title, value, colorClass = '' }) => (
        <div className={`summary-card ${colorClass}`}>
            <div className="card-title">{title}</div>
            <div className={`card-value`}>{value}</div>
        </div>
    );

    return (
        <div className="tagihan-page-container">
            <Sidebar />
            <div className="main-content-area">
                <header className="page-header">
                    <h2>Tagihan</h2>
                </header>
                
                {/* --- Kartu Ringkasan --- */}
                <div className="summary-cards-container">
                    <SummaryCard title="Total Member" value={summaryData.totalMember} colorClass="info" />
                    <SummaryCard title="Total Tagihan" value={summaryData.totalTagihan} colorClass="primary" />
                    <SummaryCard title="Dibayarkan" value={summaryData.dibayarkan} colorClass="success" />
                    <SummaryCard title="Belum Dibayarkan" value={summaryData.belumDibayarkan} colorClass="warning" />
                </div>
                
                {/* --- Kontrol Pencarian dan Tambah Data --- */}
                <div className="controls-row">
                    <div className="search-box-container">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Cari Nama..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-tambah-data" onClick={handleTambahData}>
                        <FaPlus className="plus-icon" /> Tambah Data
                    </button>
                </div>

                {/* --- Tabel Tagihan --- */}
                <div className="table-container">
                    <table className="tagihan-table">
                        <thead>
                            <tr>
                                <th className="text-right">No</th>
                                <th className="text-left">Nama</th>
                                <th className="text-left">Keterangan</th>
                                <th className="text-left">NISN</th>
                                <th className="text-left">No. HP</th>
                                <th className="text-left">Deskripsi</th>
                                <th className="text-right">Harga</th>
                                <th className="text-left">Tanggal</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr key={item.no}>
                                        <td className="text-right">{item.no}</td>
                                        <td className="text-left">{item.nama}</td>
                                        <td className="text-left">{item.keterangan}</td>
                                        <td className="text-left">{item.nisn}</td>
                                        <td className="text-left">{item.noHp}</td>
                                        <td className="text-left">{item.deskripsi}</td>
                                        <td className="text-right">{formatRupiah(item.harga)}</td>
                                        {/* Tanggal dd/mm/yyyy */}
                                        <td className="text-left">{item.tanggal}</td> 
                                        <td className={`text-center status-badge status-${item.status.toLowerCase().replace(' ', '-')}`}>
                                            {item.status}
                                        </td>
                                        <td className="text-center aksi-buttons">
                                            {/*✏️ */}
                                            <button 
                                                className="" 
                                                onClick={() => handleEdit(item)} 
                                                title="Edit"
                                            >
                                                
                                            </button>
                                            {/* Icon Hapus 🗑️ */}
                                            <button 
                                                className="" 
                                                onClick={() => handleDelete(item.no)} 
                                                title="Hapus"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center no-data">Data tagihan tidak ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Tagihan;
