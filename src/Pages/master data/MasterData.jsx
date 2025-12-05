import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import SidebarT from "../../Component/Sidebar";
import { FaArchive } from "react-icons/fa";

const KategoriData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Semua");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/kategori_data");
      setData(res.data || []);
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
        await axios.delete(`http://localhost:5000/kategori_data/${id}`);
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

  const filteredData = data.filter((item) => {
    const q = searchTerm.trim().toLowerCase();
    const matchSearch =
      (item.nama || "").toLowerCase().includes(q) ||
      (item.email || "").toLowerCase().includes(q);
    const matchFilter =
      filter === "Semua" ||
      (item.kategori || "").toLowerCase() === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  return (
    <div className="pl-[calc(15rem+1%)] pr-[5%] pt-[5%] md:pt-10 transition-all duration-300">
      <div className="flex flex-col gap-6">
        <SidebarT />

        <div className="flex-1 flex flex-col gap-3 md:ml-6 bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FaArchive className="text-green-400 text-3xl" />
              Master Data
            </h2>
            <button
              onClick={() => navigate("/tambahmasterdata")}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Tambah Data
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-5">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
              >
                <option value="Semua">Semua Data</option>
                <option value="Siswa">Siswa</option>
                <option value="Guru">Guru</option>
                <option value="Karyawan">Karyawan</option>
              </select>

              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md w-64 focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-center py-4">Memuat data...</p>
          ) : (
            <div className="overflow-x-auto rounded-lg bg-white">
              <table className="min-w-full text-sm border-separate border-spacing-y-1">
  <thead>
    <tr className="bg-blue-600 text-white rounded-lg">
      <th className="px-4 py-2 text-center font-semibold">No</th>
      <th className="px-4 py-2 text-center font-semibold">Nama</th>
      <th className="px-4 py-2 text-center font-semibold">Email</th>

      {/* ⭐ KOLOM BARU */}
      <th className="px-4 py-2 text-center font-semibold">Nomor Uniqe</th>

      <th className="px-4 py-2 text-center font-semibold">Level</th>
      <th className="px-4 py-2 text-center font-semibold">
        {filter === "Guru"
          ? "Mapel"
          : filter === "Siswa"
          ? "Kelas"
          : filter === "Karyawan"
          ? "Bagian"
          : "Mapel / Kelas"}
      </th>
      <th className="px-4 py-2 text-center font-semibold">Aksi</th>
    </tr>
  </thead>

  <tbody>
    {filteredData.length > 0 ? (
      filteredData.map((item, index) => (
        <tr key={item.id || index} className="bg-gray-50 hover:bg-gray-100 rounded-md">
          <td className="px-4 py-2 text-left">{index + 1}</td>
          <td className="px-4 py-2 text-left text-gray-700">{item.nama || "-"}</td>
          <td className="px-4 py-2 text-left text-gray-700">{item.email || "-"}</td>

          {/* ⭐ KOLOM BARU */}
          <td className="px-4 py-2 text-center text-gray-700">
            {item.nomorUnik || "-"}
          </td>

          <td className="px-4 py-2 text-left text-gray-700">
            {item.kategori || "-"}
          </td>
          <td className="px-4 py-2 text-left text-gray-700">
            {item.jabatan_kelas || "-"}
          </td>
          <td className="px-4 py-3 text-left">
            <div className="flex justify-center gap-2">
              <button
                onClick={() => navigate(`/editmasterdata/${item.id}`)}
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
      ))
    ) : (
      <tr>
        <td
          colSpan="7"
          className="text-center py-5 text-gray-500 italic bg-gray-50 rounded-md"
        >
          Tidak ada data ditemukan.
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

export default KategoriData;
