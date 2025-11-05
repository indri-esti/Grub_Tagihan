import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import SidebarT from "../../Component/Sidebar";
import { FaListAlt } from "react-icons/fa";

const KategoriTagihan = () => {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Ambil data dari API
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/kategori_tagihan");
      setKategori(res.data);
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
          await axios.delete(`http://localhost:5000/kategori_tagihan${id}`);
          setKategori(kategori.filter((item) => item.id !== id));
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

  // Filter pencarian
  const filteredData = kategori.filter((item) =>
    item.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pl-[calc(15rem+1%)] pr-[5%] pt-[5%] md:pt-10 transition-all duration-300">
      <div className="flex flex-col gap-6">
        {/* Sidebar */}
        <SidebarT />

        {/* Konten utama */}
        <div className="flex-1 flex flex-col gap-3 md:ml-6 bg-white shadow-lg rounded-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FaListAlt className="text-blue-600 text-3xl" />
              Tabel Kategori Tagihan
            </h2>
            <button
              onClick={() => navigate("/tambahkategori")}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Tambah Data
            </button>
          </div>

          {/* Pencarian */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Cari berdasarkan nama kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Tabel Data */}
          {loading ? (
            <p className="text-center">Memuat data...</p>
          ) : (
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="table-auto border border-gray-300 w-full text-sm">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="px-2 py-2">No</th>
                    <th className="px-2 py-2">Nama Kategori</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={item.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 text-right">{index + 1}</td>
                        <td className="px-4 py-2 text-left">{item.nama}</td>

                        {/* STATUS */}
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`px-3 py-1 rounded-full font-semibold text-sm ${
                              item.status === "Aktif"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* AKSI */}
                        <td className="px-4 py-2 flex justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/editkategori/${item.id}`)
                            }
                            className="bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-600 transition"
                            title="Edit Data"
                          >
                            ✏
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-700 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                            title="Hapus Data"
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        Tidak ada data kategori ditemukan.
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

export default KategoriTagihan;
