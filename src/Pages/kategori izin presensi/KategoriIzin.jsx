import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import SidebarT from "../../Component/Sidebar";
import { FaFileSignature } from "react-icons/fa";
import { BASE_URL } from "../../config/api";

const KategoriIzin = () => {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Ambil data dari API → kategori_izin
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/kategoriizin`);
let data = [];

if (Array.isArray(res.data)) {
  data = res.data;
} else if (Array.isArray(res.data.data)) {
  data = res.data.data;
}

// 🔥 URUTKAN DATA TERBARU DI ATAS
data = [...data].sort((a, b) => b.id - a.id);

      const normalizedData = data.map((item) => ({
        id: item.id,
        nama: item.nama ?? item.jenisIzin ?? "",
        status: item.status ?? "",
      }));

      setKategori(normalizedData);
    } catch (err) {
      console.error("ERROR FETCH:", err);
      Swal.fire("Oops!", "Gagal mengambil data dari server.", "error");
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
          await axios.delete(`${BASE_URL}/kategoriizin/${id}`);
          setKategori((prev) => prev.filter((item) => item.id !== id));

          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Data berhasil dihapus.",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error("Gagal hapus data:", err);
          Swal.fire("Gagal!", "Tidak dapat menghapus data.", "error");
        }
      }
    });
  };

  const filteredData = kategori.filter((item) =>
    item.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pl-[calc(15rem+1%)] pr-[5%] pt-[5%] md:pt-10 transition-all duration-300">
      <div className="flex flex-col gap-6">
        <SidebarT />

        <div className="flex-1 flex flex-col gap-3 md:ml-6 bg-white shadow-lg rounded-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FaFileSignature className="text-slate-500 text-3xl" />
              Tabel Kategori Izin
            </h2>

            <button
              onClick={() => navigate("/tambahkategoriizin")}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Tambah Data
            </button>
          </div>

          {/* Pencarian */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Cari kategori izin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* ✅ LOADING MODERN */}
          {loading ? (
            <div className="flex items-center justify-center h-[45vh]">
              <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl px-8 py-6 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-blue-300 border-t-blue-600 animate-spin" />
                <p className="text-sm font-medium text-gray-600">
                  Memuat data ......
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700 border border-gray-300/60 rounded-xl overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    <th className="px-4 py-3 text-center">No</th>
                    <th className="px-4 py-3 text-center">Nama Kategori</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-blue-50 transition"
                      >
                        <td className="px-4 py-3 text-center">{index + 1}</td>
                        <td className="px-4 py-3 font-medium">{item.nama}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              item.status === "Aktif"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/editkategoriizin/${item.id}`)
                            }
                            className="bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-600"
                          >
                            ✏
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-700 text-white px-3 py-2 rounded-md hover:bg-red-600"
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
                        className="text-center py-5 text-gray-500 italic bg-gray-50"
                      >
                        Tidak ada data kategori izin ditemukan.
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

export default KategoriIzin;
