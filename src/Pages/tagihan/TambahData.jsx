import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/api";


const TambahData = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    keterangan: "",
    harga: "",
    tanggal: "",
    status: "Belum Lunas", // 🔥 Default status
  });

  const [jenisTagihan, setJenisTagihan] = useState([]);
  const [dataSiswa, setDataSiswa] = useState([]);

  // Ambil jenis tagihan aktif
  useEffect(() => {
    axios.get(`${BASE_URL}/kategoritagihan`)
      .then((res) => {
        const aktifOnly = res.data.filter(
          (item) => item.status?.toLowerCase() === "aktif"
        );
        setJenisTagihan(aktifOnly);
      })
      .catch((err) => {
        console.error("Gagal mengambil jenis tagihan:", err);
      });
  }, []);

 // Ambil daftar siswa dari master data
useEffect(() => {
  axios.get(`${BASE_URL}/masterdata`)
    .then((res) => {
      const siswaOnly = res.data.filter(
        (item) =>
          String(item.kategori || "")
            .trim()
            .toLowerCase()
            .includes("siswa")
      );
      setDataSiswa(siswaOnly);
    })
    .catch((err) => {
      console.error("Gagal mengambil data siswa:", err);
    });
}, []);


  // Handle input perubahan
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Simpan data ke backend
  const handleSubmit = async (e) => {
  e.preventDefault();

  const tanggalFix = convertTanggal(formData.tanggal);

  if (!tanggalFix) {
    Swal.fire("Error", "Format tanggal harus dd/mm/yyyy", "error");
    return;
  }

  const payload = {
    ...formData,
    tanggal: tanggalFix, // 🔥 sudah yyyy-MM-dd
  };

  try {
    await axios.post(`${BASE_URL}/tagihan`, payload);
    Swal.fire("Berhasil", "Data tagihan tersimpan", "success");
    navigate("/tagihan");
  } catch (err) {
    console.error("Gagal simpan data tagihan:", err);
    Swal.fire("Gagal", "Data tidak tersimpan", "error");
  }
};

  const convertTanggal = (tgl) => {
  // dd/mm/yyyy → yyyy-MM-dd
  const parts = tgl.split("/");
  if (parts.length !== 3) return null;

  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm}-${dd}`;
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Tambah Data Tagihan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Siswa */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Nama</label>
            <select
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">-- Pilih Siswa --</option>
              {dataSiswa.length > 0 ? (
                dataSiswa.map((item) => (
                  <option key={item.id} value={item.nama}>
                    {item.nama}
                  </option>
                ))
              ) : (
                <option disabled>Tidak ada data siswa</option>
              )}
            </select>
          </div>

          {/* Jenis Tagihan */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">
              Jenis Tagihan
            </label>
            <select
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">-- Pilih Jenis Tagihan (Aktif) --</option>
              {jenisTagihan.length > 0 ? (
                jenisTagihan.map((item) => (
                  <option key={item.id} value={item.nama}>
                    {item.nama}
                  </option>
                ))
              ) : (
                <option disabled>Tidak ada jenis tagihan aktif</option>
              )}
            </select>
          </div>

          {/* Harga */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Harga</label>
            <input
              type="number"
              name="harga"
              value={formData.harga}
              onChange={handleChange}
              required
              placeholder="Contoh: 500000"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Tanggal */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">
              Tanggal (dd/mm/yyyy)
            </label>
            <input
              type="text"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              required
              placeholder="dd/mm/yyyy"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>


          {/* Tombol */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/tagihan")}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 w-[48%]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-[48%]"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahData;
