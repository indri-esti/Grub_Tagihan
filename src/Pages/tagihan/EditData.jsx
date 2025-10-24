import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const EditData = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ambil ID dari URL
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

  // ambil data lama berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/tagihan/${id}`);
        setFormData(res.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal mengambil data dari server.",
        });
      }
    };
    fetchData();
  }, [id]);

  // ubah data ketika user mengetik
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // kirim data update ke API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/tagihan/${id}`, formData);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data tagihan berhasil diperbarui!",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/tagihan");
    } catch (error) {
      console.error("Gagal mengupdate data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat mengupdate data.",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Edit Data Tagihan
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
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditData;
