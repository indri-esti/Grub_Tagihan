import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const EditLevel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [level, setLevel] = useState("");

  // 🔹 Ambil data level berdasarkan ID
  useEffect(() => {
    axios
      .get(`http://localhost:5000/level/${id}`)
      .then((res) => {
        setLevel(res.data.level || "");
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Tidak dapat mengambil data level dari server.",
        });
      });
  }, [id]);

  // 🔹 Saat form disubmit
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
      await axios.put(`http://localhost:5000/level/${id}`, { level });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data level berhasil diperbarui!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate("/kategoridata"); // arahkan ke halaman list data (ubah sesuai kebutuhan)
    } catch (error) {
      console.error("Gagal memperbarui data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat memperbarui data level.",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Edit Level
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Level */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Level</label>
            <input
              type="text"
              name="level"
              placeholder="Masukkan level"
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
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-[48%]"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLevel;
