import React, { useState, useMemo } from "react";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar"; // Asumsi lokasi Sidebar
import "./JenisTagihan.css"; // Import CSS

// Data dummy untuk contoh
const initialData = [
  { id: 1, jenisTagihan: 'SPP', deskripsi: 'SPP Bulan Oktober 2025', aksi: '' },
  { id: 2, jenisTagihan: 'Seragam', deskripsi: 'Pembayaran Seragam Sekolah', aksi: '' },
  { id: 3, jenisTagihan: 'Uang Gedung', deskripsi: 'Pembayaran Pembangunan Gedung ', aksi: '' },
  { id: 4, jenisTagihan: 'SPP', deskripsi: 'SPP Bulan Agustus 2025', aksi: '' },
];

const JenisTagihan = () => {
  const [dataTagihan, setDataTagihan] = useState(initialData);
  const [filter, setFilter] = useState('Semua');

  // --- Fungsi Tambah Data (Simulasi Halaman Baru dengan SweetAlert) ---
  const handleTambahData = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Jenis Tagihan Baru',
      html:
        '<input id="swal-input-jenis" class="swal2-input" placeholder="Jenis Tagihan (Contoh: SPP)" style="margin-bottom: 10px;">' +
        '<textarea id="swal-input-deskripsi" class="swal2-textarea" placeholder="Deskripsi (Contoh: SPP Bulanan Reguler)"></textarea>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Simpan Data',
      cancelButtonText: 'Batal',
      preConfirm: () => {
        const jenis = document.getElementById('swal-input-jenis').value.trim();
        const deskripsi = document.getElementById('swal-input-deskripsi').value.trim();
        if (!jenis || !deskripsi) {
             Swal.showValidationMessage('Jenis Tagihan dan Deskripsi tidak boleh kosong.');
             return false;
        }
        return [jenis, deskripsi];
      }
    });

    if (formValues) {
      const newId = Math.max(...dataTagihan.map(d => d.id), 0) + 1;
      const newData = {
        id: newId,
        jenisTagihan: formValues[0],
        deskripsi: formValues[1],
        aksi: ''
      };
      setDataTagihan([...dataTagihan, newData]);
      Swal.fire('Berhasil!', 'Data jenis tagihan berhasil ditambahkan.', 'success');
    }
  };

  // --- Fungsi Edit Data (Simulasi Halaman Baru dengan SweetAlert) ---
  const handleEdit = async (item) => {
    const { value: formValues } = await Swal.fire({
      title: `Edit Jenis Tagihan: ${item.jenisTagihan}`,
      html:
        '<input id="swal-input-jenis" class="swal2-input" placeholder="Jenis Tagihan" style="margin-bottom: 10px;">' +
        '<textarea id="swal-input-deskripsi" class="swal2-textarea" placeholder="Deskripsi"></textarea>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Simpan Perubahan',
      cancelButtonText: 'Batal',
      didOpen: () => {
        // Set nilai awal setelah dialog terbuka
        document.getElementById('swal-input-jenis').value = item.jenisTagihan;
        document.getElementById('swal-input-deskripsi').value = item.deskripsi;
      },
      preConfirm: () => {
        const jenis = document.getElementById('swal-input-jenis').value.trim();
        const deskripsi = document.getElementById('swal-input-deskripsi').value.trim();
        if (!jenis || !deskripsi) {
             Swal.showValidationMessage('Jenis Tagihan dan Deskripsi tidak boleh kosong.');
             return false;
        }
        return [jenis, deskripsi];
      }
    });

    if (formValues) {
      const updatedData = dataTagihan.map(d =>
        d.id === item.id ? { ...d, jenisTagihan: formValues[0], deskripsi: formValues[1] } : d
      );
      setDataTagihan(updatedData);
      Swal.fire('Berhasil!', 'Data jenis tagihan berhasil diperbarui.', 'success');
    }
  };

  // --- Fungsi Hapus Data ---
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data ini akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        setDataTagihan(dataTagihan.filter(item => item.id !== id));
        Swal.fire(
          'Terhapus!',
          'Data jenis tagihan berhasil dihapus.',
          'success'
        );
      }
    });
  };

  // --- Logika Filter Data ---
  const filteredData = useMemo(() => {
    if (filter === 'Semua') {
      return dataTagihan;
    }
    return dataTagihan.filter(item => item.jenisTagihan === filter);
  }, [dataTagihan, filter]);

  return (
    <div className="jenis-tagihan-container">
      {/* Asumsi komponen Sidebar */}
      <Sidebar /> 
      
      <div className="content-area">
        <h1 className="main-title">Jenis Tagihan</h1>

        {/* --- Filter Section --- */}
        <div className="filter-section">
          <label htmlFor="jenis-filter">Pilih jenis:</label>
          <select
            id="jenis-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="Semua">Semua Jenis Tagihan</option>
            <option value="SPP">SPP</option>
            <option value="Seragam">Seragam</option>
            <option value="Uang Gedung">Uang Gedung</option>
            {/* Anda bisa menambahkan opsi lain di sini sesuai kebutuhan */}
          </select>
        </div>

        {/* --- Table Section --- */}
        <div className="table-container">
          <h2>Daftar Jenis Tagihan ({filter})</h2>
          <table>
            <thead>
              <tr>
                 <th className="right-align">No</th>
                <th className="center-align">Jenis Tagihan</th>
                <th className="center-align">Deskripsi</th>
                <th className="center-align">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <td className="right-align">{index + 1}</td>
                    <td>{item.jenisTagihan}</td>
                    <td>{item.deskripsi}</td>
                    <td className="action-buttons">
                      <button 
                        className="btn-edit-icon" 
                        onClick={() => handleEdit(item)}
                        title="Edit Data"
                      >
                        ✏️ 
                      </button>
                      <button 
                        className="btn-hapus-icon" 
                        onClick={() => handleDelete(item.id)}
                        title="Hapus Data"
                      >
                        🗑️ 
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center'}}>
                    Tidak ada data jenis tagihan untuk kategori *{filter}*.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- Tombol Tambah Data --- */}
        <button className="btn-tambah-data" onClick={handleTambahData}>
          + Tambah Data
        </button>
      </div>


    </div>
  );
};

export default JenisTagihan;

