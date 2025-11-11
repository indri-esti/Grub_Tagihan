import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const EditDataKelas = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    kelas: "",
    jurusan: "",
  });

  // Ambil data berdasarkan ID
  useEffect(() => {
    axios
      .get(`http://localhost:5000/data_kelas/${id}`)
      .then((res) => {
        const data = res.data;
        setFormData({
          kelas: data.kelas || "",
          jurusan: data.jurusan || "",
        });
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Tidak dapat mengambil data dari server.",
        });
      });
  }, [id]);

  // Handle input perubahan
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Simpan perubahan data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/data_kelas/${id}`, formData);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data kelas berhasil diperbarui!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate("/datakelas");
    } catch (error) {
      console.error("Gagal mengedit data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat mengedit data.",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Edit Data Kelas
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
              placeholder="Contoh: Rekayasa Perangkat Lunak"
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
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-[48%]"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDataKelas;
