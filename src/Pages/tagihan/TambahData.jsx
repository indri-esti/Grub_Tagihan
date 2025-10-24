import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const TambahData = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    keterangan: "",
    nisn: "",
    nohp: "",
    deskripsi: "",
    harga: "",
    tanggal: "",
    status: "",
  });

  // Saat input berubah
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Saat form disubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/tagihan", formData);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data tagihan berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/tagihan");
    } catch (error) {
      console.error("Gagal menambahkan data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menambahkan data.",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Tambah Data Tagihan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nama"
            placeholder="Nama"
            value={formData.nama}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="text"
            name="keterangan"
            placeholder="Keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="text"
            name="nisn"
            placeholder="NISN"
            value={formData.nisn}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="text"
            name="nohp"
            placeholder="No HP"
            value={formData.nohp}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="text"
            name="deskripsi"
            placeholder="Deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="number"
            name="harga"
            placeholder="Harga"
            value={formData.harga}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="date"
            name="tanggal"
            value={formData.tanggal}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">-- Pilih Status --</option>
            <option value="Belum Lunas">Belum Lunas</option>
            <option value="Lunas">Lunas</option>
          </select>

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
