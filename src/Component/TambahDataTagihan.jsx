import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaArrowLeft } from 'react-icons/fa';
import "./tagihan.css"; // Gaya layout dasar dan sidebar
import "./tambahdatatagihan.css"; // Gaya form tambah data

const TambahDataTagihan = ({ onBack, setTagihanData }) => {
    const [formData, setFormData] = useState({
        nama: '', keterangan: '', nisn: '', noHp: '', deskripsi: '', 
        harga: '', tanggal: new Date().toISOString().substring(0, 10), // Default hari ini (YYYY-MM-DD)
        status: 'Belum Lunas',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Konversi tanggal dari YYYY-MM-DD ke DD/MM/YYYY sebelum disimpan
        const [year, month, day] = formData.tanggal.split('-');
        // PERBAIKAN: Gunakan backticks untuk template literal yang benar
        const formattedDate = `${day}/${month}/${year}`;

        // Buat objek data baru dengan ID unik (simulasi)
        setTagihanData(prevData => {
            const newId = Math.max(...prevData.map(d => d.id), 0) + 1;
            const newData = { 
                ...formData, 
                id: newId, 
                harga: parseInt(formData.harga),
                tanggal: formattedDate // Simpan tanggal format Indonesia
            };
            return [...prevData, newData];
        });

        Swal.fire({
            title: 'Berhasil!',
            text: 'Data tagihan berhasil ditambahkan.',
            icon: 'success',
            confirmButtonText: 'Kembali ke Daftar'
        }).then(() => {
            onBack(); 
        });
    };

    return (
        <>
            <div className="header-tagihan header-form">
                <h1 className="main-title">Tambah Data Tagihan Baru</h1>
            </div>
            
            <button onClick={onBack} className="back-button">
                <FaArrowLeft /> Kembali ke Daftar Tagihan
            </button>

            <form onSubmit={handleSubmit} className="form-tagihan">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nama">Nama</label>
                        <input type="text" id="nama" name="nama" value={formData.nama} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="keterangan">Keterangan</label>
                        <input type="text" id="keterangan" name="keterangan" value={formData.keterangan} onChange={handleChange} required />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nisn">NISN</label>
                        <input type="text" id="nisn" name="nisn" value={formData.nisn} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="noHp">No. HP</label>
                        <input type="text" id="noHp" name="noHp" value={formData.noHp} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group full-width">
                    <label htmlFor="deskripsi">Deskripsi</label>
                    <textarea id="deskripsi" name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows="3" required></textarea>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="harga">Harga (Rp)</label>
                        <input type="number" id="harga" name="harga" value={formData.harga} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tanggal">Tanggal</label>
                        <input type="date" id="tanggal" name="tanggal" value={formData.tanggal} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group half-width">
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} required>
                        <option value="Belum Lunas">Belum Lunas</option>
                        <option value="Lunas">Lunas</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button type="submit" className="tambah-data-btn">Simpan Data Tagihan</button>
                </div>
            </form>
        </>
    );
};

export default TambahDataTagihan;
