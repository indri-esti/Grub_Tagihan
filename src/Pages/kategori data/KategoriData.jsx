import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import SidebarT from "../../Component/Sidebar";
import { FaFolderOpen } from "react-icons/fa";
import { BASE_URL } from "../../config/api";

const KategoriData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Ambil data dari API
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/level`);
      setData(Array.isArray(res.data) ? res.data : res.data.data || []);
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
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/level/${id}`);
        setData((prev) => prev.filter((item) => item.id !== id));

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil dihapus.",
          timer: 1400,
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
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="pl-[calc(15rem+1%)] pr-[5%] pt-[5%] md:pt-10 transition-all duration-300">
        <div className="flex flex-col gap-6">
          <SidebarT />

          <div className="flex-1 flex flex-col gap-3 md:ml-6 bg-white shadow-lg rounded-lg p-6">
            {/* Judul */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FaFolderOpen className="text-yellow-300 text-3xl" />
                Kategori Data
              </h2>
              <button
                onClick={() => navigate("/tambah_kategoridata")}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Tambah Data
              </button>
            </div>

            {/* Loading Spinner */}
            <div className="flex items-center justify-center h-[60vh]">
              <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl px-8 py-6 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-blue-300 border-t-blue-600 animate-spin" />
                <p className="text-sm font-medium text-gray-600 tracking-wide">
                  Memuat data...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // ================= END LOADING =================

  return (
    <div className="pl-[calc(15rem+1%)] pr-[5%] pt-[5%] md:pt-10 transition-all duration-300">
      <div className="flex flex-col gap-6">
        <SidebarT />

        <div className="flex-1 flex flex-col gap-3 md:ml-6 bg-white shadow-lg rounded-lg p-6">
          {/* Judul */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FaFolderOpen className="text-yellow-300 text-3xl" />
              Kategori Data
            </h2>
            <button
              onClick={() => navigate("/tambah_kategoridata")}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Tambah Data
            </button>
          </div>

          {data.length === 0 ? (
            <p className="text-center py-5 text-gray-500 italic bg-gray-50 rounded-md">
              Data tidak ada
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg bg-white">
              <table className="min-w-full text-sm border-separate border-spacing-y-1">
                <thead>
                  <tr className="bg-blue-600 text-white rounded-lg">
                    <th className="px-4 py-2 text-center font-semibold">No</th>
                    <th className="px-4 py-2 text-center font-semibold">Level</th>
                    <th className="px-4 py-2 text-center font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="bg-gray-50 hover:bg-gray-100 rounded-md"
                    >
                      <td className="px-4 py-2 text-left">{index + 1}</td>
                      <td className="px-4 py-2 text-center text-gray-700">
                        {item.level || "-"}
                      </td>
                      <td className="px-4 py-3 text-left">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/edit_kategoridata/${item.id}`)
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KategoriData;
