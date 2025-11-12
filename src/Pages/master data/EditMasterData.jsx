import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const EditMasterData = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    kategori: "",
    jabatan_kelas: "",
  });

  const [levels, setLevels] = useState([]);
  const [dataKelas, setDataKelas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil data level, data_kelas, dan data master berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resLevel, resKelas, resMaster] = await Promise.all([
          axios.get("http://localhost:5000/level"),
          axios.get("http://localhost:5000/data_kelas"),
          axios.get(`http://localhost:5000/kategori_data/${id}`),
        ]);

        setLevels(resLevel.data || []);
        setDataKelas(resKelas.data || []);

        const data = resMaster.data;
        setFormData({
          nama: data.nama || "",
          email: data.email || "",
          kategori: data.kategori || "",
          jabatan_kelas: data.jabatan_kelas || "",
        });
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Tidak dapat mengambil data dari server.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🔹 Reset input tambahan jika kategori berubah
  useEffect(() => {
    setFormData((prev) => ({ ...prev, jabatan_kelas: "" }));
  }, [formData.kategori]);

  // 🔹 Gabungkan kelas & jurusan jadi satu opsi
  const kelasGabungOptions = [
    ...new Set(
      dataKelas
        .filter((i) => i.kelas && i.jurusan)
        .map((i) => `${i.kelas} ${i.jurusan}`)
    ),
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Label dinamis
  const getDynamicLabel = () => {
    const k = (formData.kategori || "").toLowerCase();
    if (k === "siswa") return "Pilih Kelas & Jurusan";
    if (k === "guru") return "Masukkan Mapel";
    if (k === "karyawan") return "Masukkan Jabatan";
    return "Isi Data Tambahan";
  };

  // 🔹 Submit update data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama || !formData.email || !formData.kategori) {
      Swal.fire({
        icon: "warning",
        title: "Lengkapi Data!",
        text: "Nama, Email, dan Kategori wajib diisi.",
      });
      return;
    }

    const kategori = (formData.kategori || "").toLowerCase();

    if (kategori === "siswa" && !formData.jabatan_kelas) {
      Swal.fire({
        icon: "warning",
        title: "Lengkapi Data!",
        text: "Pilih Kelas & Jurusan untuk level Siswa.",
      });
      return;
    }

    if (["guru", "karyawan"].includes(kategori) && !formData.jabatan_kelas) {
      Swal.fire({
        icon: "warning",
        title: "Lengkapi Data!",
        text: "Masukkan Mapel atau Jabatan.",
      });
      return;
    }

    try {
      await axios.put(`http://localhost:5000/kategori_data/${id}`, formData);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil diperbarui!",
        showConfirmButton: false,
        timer: 1800,
      });
      navigate("/masterdata");
    } catch (error) {
      console.error("Gagal mengedit data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat memperbarui data.",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Edit Data Master
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Nama</label>
            <input
              type="text"
              name="nama"
              placeholder="Contoh: Indri"
              value={formData.nama}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              placeholder="contoh@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">
              Pilih Level 
            </label>
            {loading ? (
              <p className="text-gray-500 text-sm">Memuat data...</p>
            ) : (
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">-- Pilih Level --</option>
                {levels.map((item) => (
                  <option key={item.id} value={item.level}>
                    {item.level}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Input Dinamis */}
          {formData.kategori && (
            <div>
              <label className="text-gray-700 text-sm mb-1 block">
                {getDynamicLabel()}
              </label>

              {(formData.kategori || "").toLowerCase() === "siswa" ? (
                <select
                  name="jabatan_kelas"
                  value={formData.jabatan_kelas}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="">-- Pilih Kelas & Jurusan --</option>
                  {kelasGabungOptions.length > 0 ? (
                    kelasGabungOptions.map((item, i) => (
                      <option key={i} value={item}>
                        {item}
                      </option>
                    ))
                  ) : (
                    <option disabled>Data kelas belum tersedia</option>
                  )}
                </select>
              ) : (
                <input
                  type="text"
                  name="jabatan_kelas"
                  placeholder={
                    (formData.kategori || "").toLowerCase() === "guru"
                      ? "Masukkan Mapel (mis. Matematika)"
                      : "Masukkan Jabatan (mis. Staff TU)"
                  }
                  value={formData.jabatan_kelas}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              )}
            </div>
          )}

          {/* Tombol Aksi */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/masterdata")}
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

export default EditMasterData;
