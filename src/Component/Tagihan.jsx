import React, { useState, useMemo } from "react";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar"; // Asumsikan Sidebar.jsx ada
import TambahDataTagihan from "./TambahDataTagihan";
import EditDataTagihan from "./EditDataTagihan";

import "./tagihan.css";
import { FaSearch, FaPlus, FaUsers, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaFilter } from 'react-icons/fa';

const initialData = [
    { id: 1, nama: 'John Doe', keterangan: 'SPP', nisn: '123456', noHp: '08123456789', deskripsi: 'Pembayaran SPP', harga: 500000, tanggal: '20/10/2025', status: 'Lunas' },
    { id: 2, nama: 'Jane Smith', keterangan: 'Uang Buku', nisn: '654321', noHp: '08987654321', deskripsi: 'Pembelian Buku Semester', harga: 750000, tanggal: '22/10/2025', status: 'Belum Lunas' },
    { id: 3, nama: 'Alice Johnson', keterangan: 'Uang Gedung', nisn: '112233', noHp: '08112233445', deskripsi: 'Iuran Pembangunan Gedung', harga: 2000000, tanggal: '25/10/2025', status: 'Lunas' },
    { id: 4, nama: 'Bob Brown', keterangan: 'SPP', nisn: '445566', noHp: '08556677889', deskripsi: 'Pembayaran SPP bulan 10', harga: 500000, tanggal: '01/10/2025', status: 'Belum Lunas' },
];

const Tagihan = () => {
    const [tagihanData, setTagihanData] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterJenis, setFilterJenis] = useState('Semua'); // State untuk filter jenis
    
    // State untuk Conditional Rendering
    const [view, setView] = useState('list'); // 'list', 'add', 'edit'
    const [selectedId, setSelectedId] = useState(null);

    // Fungsi untuk kembali ke tampilan daftar utama
    const handleBackToList = () => {
        setView('list');
        setSelectedId(null);
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    // Data yang Difilter (Pencarian & Jenis)
    const filteredData = tagihanData.filter(item => {
        const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesFilter = true;
        if (filterJenis !== 'Semua') {
            const itemKeterangan = item.keterangan.toLowerCase();
            const filterLower = filterJenis.toLowerCase();
            
            if (filterLower === 'spp' && !itemKeterangan.includes('spp')) matchesFilter = false;
            else if (filterLower === 'seragam' && !itemKeterangan.includes('seragam')) matchesFilter = false;
            else if (filterLower === 'uang gedung' && !itemKeterangan.includes('gedung')) matchesFilter = false;
        }

        return matchesSearch && matchesFilter;
    });

    // Hitung Statistik
    const statistik = useMemo(() => {
        const totalTagihan = tagihanData.reduce((sum, item) => sum + item.harga, 0);
        const dibayarkan = tagihanData.filter(item => item.status === 'Lunas').reduce((sum, item) => sum + item.harga, 0);
        const belumDibayar = totalTagihan - dibayarkan;
        const totalMember = new Set(tagihanData.map(item => item.nisn)).size;

        return {
            totalMember,
            totalTagihan: formatRupiah(totalTagihan),
            dibayarkan: formatRupiah(dibayarkan),
            belumDibayar: formatRupiah(belumDibayar),
        };
    }, [tagihanData]);

    // Handler untuk Tambah/Edit/Hapus
    const handleTambahData = () => { setView('add'); };
    const handleEdit = (id) => { setSelectedId(id); setView('edit'); };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin ingin menghapus?',
            text: 'Data tagihan ini akan terhapus sendiri (permanen)!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                const newData = tagihanData.filter(item => item.id !== id);
                setTagihanData(newData);
                Swal.fire('Terhapus!', 'Data tagihan berhasil dihapus.', 'success');
            }
        });
    };

    // Logika utama Conditional Rendering
    const renderContent = () => {
        if (view === 'add') {
            return <TambahDataTagihan onBack={handleBackToList} setTagihanData={setTagihanData} />;
        }

        if (view === 'edit') {
            const dataToEdit = tagihanData.find(item => item.id === selectedId);
            return <EditDataTagihan data={dataToEdit} onBack={handleBackToList} setTagihanData={setTagihanData} />;
        }
        
        // Tampilan List (view === 'list')
        return (
            <>
                <div className="header-tagihan">
                    <h1 className="main-title">Tagihan</h1>
                </div>

                {/* Kotak Statistik */}
                <div className="statistik-container">
                    <div className="stat-card total-member">
                        <FaUsers className="stat-icon" />
                        <p>Total Member</p>
                        <h3>{statistik.totalMember}</h3>
                    </div>
                    <div className="stat-card total-tagihan">
                        <FaMoneyBillWave className="stat-icon" />
                        <p>Total Tagihan</p>
                        <h3>{statistik.totalTagihan}</h3>
                    </div>
                    <div className="stat-card dibayarkan">
                        <FaCheckCircle className="stat-icon" />
                        <p>Dibayarkan</p>
                        <h3>{statistik.dibayarkan}</h3>
                    </div>
                    <div className="stat-card belum-dibayar">
                        <FaTimesCircle className="stat-icon" />
                        <p>Belum Dibayar</p>
                        <h3>{statistik.belumDibayar}</h3>
                    </div>
                </div>

                {/* Kontrol Filter, Pencarian dan Tambah Data */}
                <div className="controls-container">
                    <div className="filter-and-search-group">
                        {/* Filter Jenis Tagihan */}
                        <div className="filter-container">
                            <FaFilter className="filter-icon" />
                            <label htmlFor="filterJenis">Filter Jenis:</label>
                            <select id="filterJenis" value={filterJenis} onChange={(e) => setFilterJenis(e.target.value)} className="filter-select">
                                <option value="Semua">Semua</option>
                                <option value="SPP">SPP</option>
                                <option value="Seragam">Seragam</option>
                                <option value="Uang Gedung">Uang Gedung</option>
                            </select>
                        </div>

                        {/* Pencarian */}
                        <div className="search-container">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Cari nama..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                    
                    <button onClick={handleTambahData} className="tambah-data-btn">
                        <FaPlus className="plus-icon" /> Tambah Data
                    </button>
                </div>

                {/* Tabel Data Tagihan */}
                <div className="table-responsive">
                    <table className="tagihan-table">
                        <thead>
                            <tr>
                                <th className="text-right-header">No</th>
                                <th className="text-left-header">Nama</th>
                                <th className="text-left-header">Keterangan</th>
                                <th className="text-left-header">NISN</th>
                                <th className="text-left-header">No. HP</th>
                                <th className="text-left-header">Deskripsi</th>
                                <th className="text-right-header">Harga</th>
                                <th className="text-center-header">Tanggal</th>
                                <th className="text-center-header">Status</th>
                                <th className="text-center-header">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="text-right-data">{index + 1}</td>
                                    <td className="text-left-data">{item.nama}</td>
                                    <td className="text-left-data">{item.keterangan}</td>
                                    <td className="text-left-data">{item.nisn}</td>
                                    <td className="text-left-data">{item.noHp}</td>
                                    <td className="text-left-data">{item.deskripsi}</td>
                                    <td className="text-right-data">{formatRupiah(item.harga)}</td>
                                    <td className="text-center-data">{item.tanggal}</td>
                                    {/* PERBAIKAN: Bungkus className dalam template literal dengan backticks */}
                                    <td className={`text-center-data status-cell status-${item.status.replace(/\s/g, '').toLowerCase()}`}>{item.status}</td>
                                    <td className="text-center-data aksi-cell">
                                        <button onClick={() => handleEdit(item.id)} className="action-btn edit-btn" title="Edit"> ✏️ </button>
                                        <button onClick={() => handleDelete(item.id)} className="action-btn delete-btn" title="Hapus"> 🗑️ </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan="10" className="text-center-data no-data">Tidak ada data tagihan yang ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
        );
    };

    return (
        <div className="tagihan-page-container">
            <Sidebar />
            <div className="main-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Tagihan;
