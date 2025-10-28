import React, { useState, useEffect } from "react";
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
    status: "Belum Lunas",
  });

  const [jenisTagihan, setJenisTagihan] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/jenis_tagihan")
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

  const formatTanggal = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tanggal") {
      const formatted = formatTanggal(value);
      setFormData({
        ...formData,
        [name]: formatted,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData, status: "Belum Lunas" };
      await axios.post("http://localhost:5000/tagihan", dataToSend);

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
          {/* Nama */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Nama</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* NISN */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">NISN</label>
            <input
              type="text"
              name="nisn"
              value={formData.nisn}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* No HP */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">No HP</label>
            <input
              type="text"
              name="nohp"
              value={formData.nohp}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Deskripsi</label>
            <input
              type="text"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
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
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
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

          {/* Tanggal */}
          <div>
            <label className="text-gray-700 text-sm">
              Tanggal (dd/mm/yyyy)
            </label>
            <input
              type="date"
              name="tanggal"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none mt-1"
              required
            />
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
