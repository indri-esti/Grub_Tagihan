import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarT from "../../Component/Sidebar";
import { FaClipboardList } from "react-icons/fa";
import Swal from "sweetalert2";

const RekapTagihan = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("semua");
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil semua data dari server
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/tagihan");
      const hasil = res.data || [];
      setData(hasil);
      setFilteredData(hasil);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: "Terjadi kesalahan saat mengambil data rekap tagihan.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Format tanggal ke format Indonesia (dd/mm/yyyy)
  const formatTanggal = (tgl) => {
    if (!tgl) return "-";

    // Sudah dalam format dd/mm/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(tgl)) return tgl;

    // Format yyyy-mm-dd atau yyyy-mm-ddTHH:mm:ss
    if (typeof tgl === "string" && /^\d{4}-\d{2}-\d{2}/.test(tgl)) {
      const [y, m, d] = tgl.split("T")[0].split("-");
      return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
    }

    // Parsing otomatis Date object
    const dateObj = new Date(tgl);
    if (!isNaN(dateObj)) {
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    }

    return tgl; // fallback
  };

  // 🔧 Baca tanggal dd/mm/yyyy atau format lain → Date object
  const parseTanggal = (tgl) => {
    if (!tgl) return null;

    // Format dd/mm/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(tgl)) {
      const [d, m, y] = tgl.split("/");
      return new Date(`${y}-${m}-${d}T00:00:00`);
    }

    // Format yyyy-mm-dd atau ISO
    if (/^\d{4}-\d{2}-\d{2}/.test(tgl)) {
      return new Date(tgl);
    }

    // Fallback
    const dateObj = new Date(tgl);
    return isNaN(dateObj) ? null : dateObj;
  };

  // 🔹 Filter data
  useEffect(() => {
    let hasil = [...data];

    if (filter === "lunas") {
      hasil = hasil.filter(
        (item) => (item.status || "").toLowerCase() === "lunas"
      );
    } else if (filter === "belum") {
      hasil = hasil.filter(
        (item) => (item.status || "").toLowerCase() !== "lunas"
      );
    } else if (filter === "bulanini") {
      const now = new Date();
      const bulanSekarang = now.getMonth();
      const tahunSekarang = now.getFullYear();

      hasil = hasil.filter((item) => {
        const tgl = parseTanggal(item.tanggal);
        if (!tgl) return false;

        return (
          tgl.getMonth() === bulanSekarang &&
          tgl.getFullYear() === tahunSekarang
        );
      });
    }

    setFilteredData(hasil);
  }, [filter, data]);

  return (
    <div className="pl-[calc(15rem+1%)] pr-[5%] pt-[5%] md:pt-10 transition-all duration-300">
      <SidebarT />

      <div className="flex flex-col gap-6">
        <div className="flex-1 flex flex-col gap-3 md:ml-6 bg-white shadow-md rounded-2xl p-6">
          {/* Judul */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FaClipboardList className="text-yellow-400 text-3xl" />
              Rekap Tagihan
            </h2>
          </div>

          {/* Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5 items-start sm:items-center">
            <label className="font-medium text-gray-700">Filter Rekapan:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            >
              <option value="semua">Semua</option>
              <option value="lunas">Lunas</option>
              <option value="belum">Belum Lunas</option>
              <option value="bulanini">Bulan Ini</option>
            </select>
          </div>

          {/* Tabel */}
          {loading ? (
            <p className="text-center py-4 text-gray-500">Memuat data...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    <th className="px-4 py-3 text-center font-semibold border-b border-gray-200">
                      No
                    </th>
                    <th className="px-4 py-3 text-center font-semibold border-b border-gray-200">
                      Nama
                    </th>
                    <th className="px-4 py-3 text-center font-semibold border-b border-gray-200">
                      Jenis
                    </th>
                    <th className="px-4 py-3 text-center font-semibold border-b border-gray-200">
                      Harga
                    </th>
                    <th className="px-4 py-3 text-center font-semibold border-b border-gray-200">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-center font-semibold border-b border-gray-200">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, i) => (
                      <tr
                        key={item.id || i}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 text-left">{i + 1}</td>
                        <td className="px-4 py-3 text-left">{item.nama || "-"}</td>
                        <td className="px-4 py-3 text-left">
                          {item.jenis || item.keterangan || "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          Rp {parseInt(item.harga || 0).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {formatTanggal(item.tanggal)}
                        </td>
                        <td
                          className={`px-4 py-3 text-center font-semibold ${
                            (item.status || "").toLowerCase() === "lunas"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {item.status || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-6 text-gray-500 italic"
                      >
                        Tidak ada data rekap tagihan
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

export default RekapTagihan;
