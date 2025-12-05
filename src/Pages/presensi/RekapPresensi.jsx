import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarT from "../../Component/Sidebar";
import { FaRegCalendarCheck } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const RekapPresensi = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("semua");
  const [loading, setLoading] = useState(true);

  const Navigate = useNavigate();

  // ✅ Tentukan status presensi
  const getStatus = (item) => {
  const ket = String(item.keterangan || "").toLowerCase();
  const st = String(item.status || "").toLowerCase();

  // 1. Jika ada jam masuk → Hadir
  if (item.jamMasuk && item.jamMasuk.trim() !== "") return "Hadir";

  // 2. Jika ada status langsung dari DB → (izin / sakit / alpa)
  if (st.includes("izin")) return "Izin";
  if (st.includes("sakit")) return "Sakit";
  if (st.includes("alpa")) return "Alpa";

  // 3. Jika keterangan bukan kosong → Anggap Izin / Keperluan
  if (ket.trim() !== "") {
    return "Keperluan";
  }

  // 4. Default
  return "-";
};

  // ✅ Tentukan warna status
  const getStatusColor = (item) => {
  const status = getStatus(item);

  if (status === "Hadir") return "bg-green-500 text-white px-3 py-1 rounded-full";
  if (status === "Izin") return "bg-blue-500 text-white px-3 py-1 rounded-full";
  if (status === "Keperluan") return "bg-indigo-500 text-white px-3 py-1 rounded-full";
  if (status === "Sakit") return "bg-yellow-500 text-white px-3 py-1 rounded-full";
  if (status === "Alpa") return "bg-red-500 text-white px-3 py-1 rounded-full";

  return "bg-gray-300 text-gray-800 px-3 py-1 rounded-full";
};


  const FetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/presensi");
      const hasil = res.data || [];

      hasil.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

      setData(hasil);
      setFilteredData(hasil);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: "Terjadi kesalahan saat mengambil data presensi.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchData();
  }, []);

  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    const d = new Date(tgl);
    if (isNaN(d)) return tgl;
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  useEffect(() => {
    let hasil = Array.isArray(data) ? [...data] : [];

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    if (filter === "hari-ini") {
      hasil = hasil.filter(
        (item) =>
          typeof item.tanggal === "string" &&
          item.tanggal.startsWith(todayStr)
      );
    }

    if (filter === "minggu-ini") {
      hasil = hasil.filter((item) => {
        const t = new Date(item.tanggal);
        return t >= startOfWeek && t <= today;
      });
    }

    if (filter === "bulan-ini") {
      hasil = hasil.filter((item) => {
        const t = new Date(item.tanggal);
        return (
          t.getMonth() === today.getMonth() &&
          t.getFullYear() === today.getFullYear()
        );
      });
    }

    if (filter === "tahun-ini") {
      hasil = hasil.filter((item) => {
        const t = new Date(item.tanggal);
        return t.getFullYear() === today.getFullYear();
      });
    }

    setFilteredData(hasil);
  }, [filter, data]);

  const cleanedData = filteredData.filter(
    (item) =>
      (item.nama || item.nama === "") &&
      (item.nomorUnik || item.nomor_unik || item.nomorunik)
  );

  return (
    <div className="pl-[calc(15rem+1%)] pr-[5%] pt-[5%] md:pt-10 transition-all duration-300">
      <SidebarT />

      <div className="flex flex-col gap-6">
        <div className="flex-1 flex flex-col gap-3 md:ml-6 bg-white shadow-md rounded-2xl p-6">

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FaRegCalendarCheck className="text-cyan-400 text-3xl" />
              Rekap Presensi
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-5 items-start sm:items-center">
            <label className="font-medium text-gray-700">Filter Rekapan:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            >
              <option value="semua">Semua</option>
              <option value="hari-ini">Hari Ini</option>
              <option value="minggu-ini">Minggu Ini</option>
              <option value="bulan-ini">Bulan Ini</option>
              <option value="tahun-ini">Tahun Ini</option>
            </select>
          </div>

          {loading ? (
            <p className="text-center py-4 text-gray-500">Memuat data...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700 border border-gray-300/60 rounded-xl overflow-hidden shadow-sm">

                <thead>
                  <tr className="bg-blue-700 text-white">
                    <th className="px-4 py-3 text-center">No</th>
                    <th className="px-4 py-3 text-center">Nama</th>
                    <th className="px-4 py-3 text-center">Nomor Unique</th>
                    <th className="px-4 py-3 text-center">Keterangan</th>
                    <th className="px-4 py-3 text-center">Jam Masuk</th>
                    <th className="px-4 py-3 text-center">Jam Pulang</th>
                    <th className="px-4 py-3 text-center">Tanggal</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200/70">
                  {cleanedData.length > 0 ? (
                    cleanedData.map((item, i) => (
                      <tr
                        key={item.id || i}
                        className="hover:bg-blue-50/80 transition-all"
                      >
                        <td className="px-4 py-3 text-center">{i + 1}</td>

                        <td className="px-4 py-3 text-left">{item.nama || "-"}</td>

                        <td className="px-4 py-3 text-center">
                          {item.nomorUnik || item.nomor_unik || item.nomorunik || "-"}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {item.keterangan || ""}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {item.jamMasuk ??
                            item.jam_masuk ??
                            item.jammasuk ??
                            "-"}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {item.jamPulang ??
                            item.jam_pulang ??
                            item.jampulang ??
                            "-"}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {formatTanggal(item.tanggal)}
                        </td>

                        {/* ✅ STATUS SUDAH FIX */}
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(
                              item
                            )}`}
                          >
                            {getStatus(item)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-6 text-gray-500 italic"
                      >
                        Tidak ada data presensi
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

export default RekapPresensi;
