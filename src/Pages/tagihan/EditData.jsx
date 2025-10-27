import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const EditData = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ambil id dari URL

  const [formData, setFormData] = useState({
    nama: "",
    keterangan: "",
    nisn: "",
    nohp: "",
    deskripsi: "",
    harga: "",
    tanggal: "",
    status: "", // akan diisi dari data db.json
  });

  const [jenisTagihan, setJenisTagihan] = useState([]);

  // Ambil data tagihan berdasarkan ID
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

  // Ambil jenis tagihan untuk dropdown
  useEffect(() => {
    axios
      .get("http://localhost:5000/jenis_tagihan")
      .then((res) => {
        setJenisTagihan(res.data);
      })
      .catch((err) => {
        console.error("Gagal mengambil jenis tagihan:", err);
      });
  }, []);

  // Ubah format tanggal ke yyyy-mm-dd untuk input date
  const formatTanggalInput = (tanggal) => {
    if (!tanggal) return "";
    const [day, month, year] = tanggal.split("/");
    return `${year}-${month}-${day}`;
  };

  // Saat input berubah
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tanggal") {
      // format ke dd/mm/yyyy
      const [year, month, day] = value.split("-");
      setFormData({
        ...formData,
        [name]: `${day}/${month}/${year}`,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Submit update
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
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Edit Data Tagihan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Nama, NISN, No HP, Deskripsi, Harga */}
          {[
            { name: "nama", placeholder: "Nama" },
            { name: "nisn", placeholder: "NISN" },
            { name: "nohp", placeholder: "No HP" },
            { name: "deskripsi", placeholder: "Deskripsi" },
            { name: "harga", placeholder: "Harga", type: "number" },
          ].map((input) => (
            <input
              key={input.name}
              type={input.type || "text"}
              name={input.name}
              placeholder={input.placeholder}
              value={formData[input.name] || ""}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          ))}

          {/* Dropdown Jenis Tagihan */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">
              Jenis Tagihan
            </label>
            <select
              name="keterangan"
              value={formData.keterangan || ""}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">-- Pilih Jenis Tagihan --</option>
              {jenisTagihan.map((item) => (
                <option key={item.id} value={item.nama}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Input Tanggal */}
          <div>
            <label className="text-gray-700 text-sm">Tanggal (dd/mm/yyyy)</label>
            <input
              type="date"
              name="tanggal"
              value={formatTanggalInput(formData.tanggal)}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none mt-1"
              required
            />
          </div>

          {/* Dropdown Status */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
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

export default EditData;
