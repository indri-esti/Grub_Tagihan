import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const EditData = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const [jenisTagihan, setJenisTagihan] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/tagihan/${id}`)
      .then((res) => {
        setFormData(res.data);
      })
      .catch((err) => {
        console.error("Gagal mengambil data tagihan:", err);
        Swal.fire({
          icon: "error",
          title: "Data tidak ditemukan!",
          text: "Gagal memuat data dari server.",
        });
        navigate("/tagihan");
      });
  }, [id, navigate]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/jenis_tagihan")
      .then((res) => setJenisTagihan(res.data))
      .catch((err) => console.error("Gagal mengambil jenis tagihan:", err));
  }, []);

  const formatTanggalInput = (tanggal) => {
    if (!tanggal) return "";
    const [day, month, year] = tanggal.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tanggal") {
      const [year, month, day] = value.split("-");
      setFormData({ ...formData, [name]: `${day}/${month}/${year}` });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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
      console.error("Gagal update data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat mengedit data.",
      });
    }
  };

return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm">
      <h2 className="text-xl font-semibold text-center mb-5">
        Edit Data Tagihan
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Nama */}
        <div>
          <label className="text-gray-700 text-sm mb-1 block">Nama</label>
          <input
            type="text"
            name="nama"
            value={formData.nama || ""}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* NISN */}
        <div>
          <label className="text-gray-700 text-sm mb-1 block">NISN</label>
          <input
            type="text"
            name="nisn"
            value={formData.nisn || ""}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* No HP */}
        <div>
          <label className="text-gray-700 text-sm mb-1 block">No. HP</label>
          <input
            type="text"
            name="nohp"
            value={formData.nohp || ""}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="text-gray-700 text-sm mb-1 block">Deskripsi</label>
          <input
            type="text"
            name="deskripsi"
            value={formData.deskripsi || ""}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Harga */}
        <div>
          <label className="text-gray-700 text-sm mb-1 block">Harga</label>
          <input
            type="number"
            name="harga"
            value={formData.harga || ""}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Jenis Tagihan */}
        <div>
          <label className="text-gray-700 text-sm mb-1 block">
            Jenis Tagihan
          </label>
          <select
            name="keterangan"
            value={formData.keterangan || ""}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">-- Pilih Jenis Tagihan --</option>
            {jenisTagihan.map((item) => (
              <option key={item.id} value={item.nama}>
                {item.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Tanggal */}
        <div>
          <label className="text-gray-700 text-sm mb-1 block">
            Tanggal (dd/mm/yyyy)
          </label>
          <input
            type="date"
            name="tanggal"
            value={formatTanggalInput(formData.tanggal)}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-gray-700 text-sm mb-1 block">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-base focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="Belum Lunas">Belum Lunas</option>
            <option value="Lunas">Lunas</option>
          </select>
        </div>

        {/* Tombol */}
        <div className="flex justify-between mt-5">
          <button
            type="button"
            onClick={() => navigate("/tagihan")}
            className="bg-gray-400 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-500 w-[48%]"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 w-[48%]"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
);
};
export default EditData;
