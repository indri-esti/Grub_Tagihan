import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarT from "../../Component/Sidebar";
import { FaClipboardList } from "react-icons/fa";
import Swal from "sweetalert2";
import { BASE_URL } from "../../config/api";

const RekapTagihan = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("semua");
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil semua data dari server
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/rekaptagihan`);
      const sortedData = [...(res.data || [])].sort((a, b) => b.id - a.id);
      setData(sortedData);
      setFilteredData(sortedData);
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

  // ✅ Format tanggal ke format Indonesia
  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(tgl)) return tgl;

    if (typeof tgl === "string" && /^\d{4}-\d{2}-\d{2}/.test(tgl)) {
      const [y, m, d] = tgl.split("T")[0].split("-");
      return `${d}/${m}/${y}`;
    }

    const dateObj = new Date(tgl);
    if (!isNaN(dateObj)) {
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    }

    return tgl;
  };

  const parseTanggal = (tgl) => {
    if (!tgl) return null;

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(tgl)) {
      const [d, m, y] = tgl.split("/");
      return new Date(`${y}-${m}-${d}T00:00:00`);
    }

    if (/^\d{4}-\d{2}-\d{2}/.test(tgl)) {
      return new Date(tgl);
    }

    const dateObj = new Date(tgl);
    return isNaN(dateObj) ? null : dateObj;
  };

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
      hasil = hasil.filter((item) => {
        const tgl = parseTanggal(item.tanggal);
        return (
          tgl &&
          tgl.getMonth() === now.getMonth() &&
          tgl.getFullYear() === now.getFullYear()
        );
      });
    }

    setFilteredData(hasil);
  }, [filter, data]);

  return (
    <div className="pl-[calc(15rem+1%)] pr-[5%] pt-[5%] md:pt-10 transition-all duration-300">
      <div className="flex flex-col gap-6">
        <SidebarT />

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
              className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="semua">Semua</option>
              <option value="lunas">Lunas</option>
              <option value="belum">Belum Lunas</option>
              <option value="bulanini">Bulan Ini</option>
            </select>
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
            <div className="overflow-x-auto rounded-xl border border-gray-200">
  <table className="min-w-full text-sm border-separate border-spacing-0">

                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-4 py-3 text-center font-semibold border-b border-blue-500">
  No
</th>
                    <th className="px-4 py-3 text-center">Nama</th>
                    <th className="px-4 py-3 text-center">Jenis</th>
                    <th className="px-4 py-3 text-center">Harga</th>
                    <th className="px-4 py-3 text-center">Tanggal</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, i) => (
                      <tr
  key={item.id || i}
  className="hover:bg-blue-50 transition-colors duration-150"
>
                        <td className="px-4 py-3 border-b border-gray-100">
  {i + 1}
</td>
                        <td className="px-4 py-3 border-b border-gray-100
">{item.nama || "-"}</td>
                        <td className="px-4 py-3 border-b border-gray-100
">
                          {item.jenis || item.keterangan || "-"}
                        </td>
                        <td className="px-4 py-3 text-right border-b border-gray-100
">
                          Rp{" "}
                          {parseInt(item.harga || 0).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-center border-b border-gray-100
">
                          {formatTanggal(item.tanggal)}
                        </td>
                        <td
                          className={`px-4 py-3 text-center border-b border-gray-100
 font-semibold ${
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
                      <td colSpan="6" className="text-center py-6 italic text-gray-500">
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
