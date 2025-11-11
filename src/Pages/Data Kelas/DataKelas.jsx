import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import SidebarT from "../../Component/Sidebar";
import { FaChalkboard } from "react-icons/fa";

const DataKelas = () => {
  const [kelasData, setKelasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKelas, setSelectedKelas] = useState("Semua");
  const [selectedJurusan, setSelectedJurusan] = useState("Semua");
  const navigate = useNavigate();

  // Ambil data dari API
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/data_kelas");
      setKelasData(res.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Gagal mengambil data dari server.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hapus data
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/data_kelas/${id}`);
          setKelasData(kelasData.filter((item) => item.id !== id));
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Data berhasil dihapus.",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error("Gagal hapus data:", err);
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: "Tidak dapat menghapus data.",
          });
        }
      }
    });
  };

  // Ambil daftar kelas & jurusan unik
  const daftarKelas = ["Semua", ...new Set(kelasData.map((i) => i.kelas))];
  const daftarJurusan = ["Semua", ...new Set(kelasData.map((i) => i.jurusan))];

  // Filter data
  const filteredData = kelasData.filter((item) => {
    const cocokKelas =
      selectedKelas === "Semua" || item.kelas === selectedKelas;
    const cocokJurusan =
      selectedJurusan === "Semua" || item.jurusan === selectedJurusan;
    return cocokKelas && cocokJurusan;
  });

  return (
    <div className="pl-[calc(15rem+1%)] pr-[5%] pt-[5%] md:pt-10 transition-all duration-300">
      <div className="flex flex-col gap-6">
        <SidebarT />
        <div className="flex-1 flex flex-col gap-3 md:ml-6 bg-white shadow-lg rounded-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FaChalkboard className="text-orange-400 text-3xl" />
              Data Kelas
            </h2>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Filter Kelas */}
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {daftarKelas.map((k, idx) => (
                <option key={idx} value={k}>
                  {k === "Semua" ? "Semua Kelas" : k}
                </option>
              ))}
            </select>

            {/* Filter Jurusan */}
            <select
              value={selectedJurusan}
              onChange={(e) => setSelectedJurusan(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {daftarJurusan.map((j, idx) => (
                <option key={idx} value={j}>
                  {j === "Semua" ? "Semua Jurusan" : j}
                </option>
              ))}
            </select>

            {/* Tombol Tambah */}
            <button
              onClick={() => navigate("/tambah_datakelas")}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition ml-auto"
            >
              Tambah Data
            </button>
          </div>

          {/* Tabel Data */}
          {loading ? (
            <p className="text-center py-6">Memuat data...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm text-gray-800 shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="px-4 py-3 text-center font-medium">No</th>
                    <th className="px-4 py-3 text-center font-medium">Kelas</th>
                    <th className="px-4 py-3 text-center font-medium">
                      Jurusan
                    </th>
                    <th className="px-4 py-3 text-center font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-all duration-200"
                      >
                        <td className="px-4 py-3 text-left">{index + 1}</td>
                        <td className="px-4 py-3 text-left">{item.kelas}</td>
                        <td className="px-4 py-3 text-left">{item.jurusan}</td>
                        <td className="px-4 py-3 text-center flex justify-center gap-2">
                          <button
                            onClick={() => navigate(`/edit_datakelas/${item.id}`)}
                            className="bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-800 transition"
                          >
                            ✏
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-4 text-gray-500 italic"
                      >
                        Tidak ada data kelas ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataKelas;
