import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const TambahDataKelas = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    kelas: "",
    jurusan: "",
  });

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Simpan data baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/data_kelas", formData);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data kelas berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate("/datakelas");
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
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Tambah Data Kelas
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kelas */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Kelas</label>
            <input
              type="text"
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
              required
              placeholder="Contoh: XII"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Jurusan */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Jurusan</label>
            <input
              type="text"
              name="jurusan"
              value={formData.jurusan}
              onChange={handleChange}
              required
              placeholder="Contoh: RPL"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/datakelas")}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 w-[48%]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-[48%]"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahDataKelas;
