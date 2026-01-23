import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import SidebarT from "../../Component/Sidebar";
import { BASE_URL } from "../../config/api";


const TambahDataKategori = () => {
  const navigate = useNavigate();
  const [level, setLevel] = useState("");

  // 🔹 Saat submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!level.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Lengkapi Data!",
        text: "Field level tidak boleh kosong.",
      });
      return;
    }

    try {
      await axios.post(`${BASE_URL}/level`, { level });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data level berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate("/kategoridata");
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
    <div className="flex min-h-screen bg-gray-100 transition-all duration-300">
      {/* Sidebar */}
      <SidebarT />

      {/* Konten utama */}
      <div className="flex-1 flex justify-center items-center px-6 py-10">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Tambah Level
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Level */}
            <div>
              <label className="text-gray-700 text-sm mb-1 block">
                Level
              </label>
              <input
                type="text"
                name="level"
                placeholder="Contoh: Siswa / Guru / Karyawan"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => navigate("/kategoridata")}
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
    </div>
  );
};

export default TambahDataKategori;
