import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import SidebarT from "../../Component/Sidebar";
import { FaMoneyBillWave } from "react-icons/fa";

const Tagihan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Ambil data dari API
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/tagihan");
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
        await axios.delete(`http://localhost:5000/tagihan/${id}`);
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

  // Helper: aman ambil "jenis" (beberapa record pakai field keterangan)
  const getJenis = (item) => {
    return item.jenis || item.keterangan || "-";
  };

  // Format tanggal ke dd/mm/yyyy — aman untuk input dd/mm/yyyy atau yyyy-mm-dd
  const formatTanggal = (tgl) => {
    if (!tgl) return "-";

    // sudah dd/mm/yyyy
    if (typeof tgl === "string" && tgl.includes("/")) {
      return tgl;
    }

    // yyyy-mm-dd -> dd/mm/yyyy
    if (typeof tgl === "string" && tgl.includes("-")) {
      const parts = tgl.split("-");
      if (parts.length >= 3) {
        const [year, month, day] = parts;
        return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
      }
    }

    // fallback: coba parsing Date object
    const d = new Date(tgl);
    if (!isNaN(d)) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }

    return tgl;
  };

  // Filter pencarian: cari pada nama dan jenis/keterangan
  const filteredData = data.filter((item) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    const nama = (item.nama || "").toLowerCase();
    const jenis = (getJenis(item) || "").toLowerCase();
    return nama.includes(q) || jenis.includes(q);
  });

  return (
    <div className="pl-[calc(15rem+1%)] pr-[5%] pt-[5%] md:pt-10 transition-all duration-300">
      <div className="flex flex-col gap-6">
        <SidebarT />

        <div className="flex-1 flex flex-col gap-3 md:ml-6 bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FaMoneyBillWave className="text-green-600 text-3xl" />
              Tabel Tagihan
            </h2>
            <button
              onClick={() => navigate("/tambahdata")}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Tambah Data
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau jenis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {loading ? (
            <p className="text-center">Memuat data...</p>
          ) : (
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="table-auto w-full text-sm border-collapse">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="px-4 py-2 text-center">No</th>
                    <th className="px-4 py-2 text-center">Nama</th>
                    <th className="px-4 py-2 text-center">Jenis</th>
                    <th className="px-4 py-2 text-center">Harga</th>
                    <th className="px-4 py-2 text-center">Tanggal</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={item.id || index}
                        className="hover:bg-gray-50 transition-all border-b border-gray-100"
                      >
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{item.nama || "-"}</td>
                        <td className="px-4 py-2">{getJenis(item)}</td>
                        <td className="py-2 px-4 text-right">
                          Rp {parseInt(item.harga || 0).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {formatTanggal(item.tanggal)}
                        </td>
                        <td
                          className={`py-2 px-4 font-semibold text-center ${
                            (item.status || "").toLowerCase() === "lunas"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {item.status || "-"}
                        </td>
                        <td className="px-4 py-2 flex justify-center gap-2">
                          <button
                            onClick={() => navigate(`/editdata/${item.id}`)}
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
                      <td colSpan="7" className="text-center py-4 text-gray-500 italic">
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

export default Tagihan;
