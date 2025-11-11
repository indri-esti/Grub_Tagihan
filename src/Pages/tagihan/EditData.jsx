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
    harga: "",
    tanggal: "",
    status: "Belum Lunas",
  });

  const [jenisTagihan, setJenisTagihan] = useState([]);

  // Ambil data kategori aktif
  useEffect(() => {
    axios
      .get("http://localhost:5000/kategori_tagihan")
      .then((res) => {
        const aktifOnly = res.data.filter(
          (item) => item.status?.toLowerCase() === "aktif"
        );
        setJenisTagihan(aktifOnly);
      })
      .catch((err) => console.error("Gagal mengambil jenis tagihan:", err));
  }, []);

  // Ambil data tagihan berdasarkan ID
  useEffect(() => {
    axios
      .get(`http://localhost:5000/tagihan/${id}`)
      .then((res) => {
        const data = res.data;
        setFormData({
          nama: data.nama || "",
          keterangan: data.keterangan || data.jenis || "",
          harga: data.harga || "",
          tanggal: data.tanggal || "",
          status: data.status || "Belum Lunas",
        });
      })
      .catch((err) => console.error("Gagal mengambil data tagihan:", err));
  }, [id]);

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tanggal") {
      // Hanya izinkan angka dan "/" pada input tanggal
      const cleanValue = value.replace(/[^0-9/]/g, "");
      setFormData({ ...formData, [name]: cleanValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Simpan perubahan
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi format tanggal manual (dd/mm/yyyy)
    const tanggalPattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!tanggalPattern.test(formData.tanggal)) {
      Swal.fire({
        icon: "warning",
        title: "Format Tanggal Salah",
        text: "Gunakan format tanggal dd/mm/yyyy, contoh: 11/11/2025",
      });
      return;
    }

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
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Edit Data Tagihan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Nama</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
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
              className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Tanggal (manual input) */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Tanggal</label>
            <input
              type="text"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              required
              placeholder="dd/mm/yyyy"
              maxLength={10}
              className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Belum Lunas">Belum Lunas</option>
              <option value="Lunas">Lunas</option>
            </select>
          </div>

          {/* Tombol Aksi */}
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

export default EditData;
