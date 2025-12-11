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
  const [masterUser, setMasterUser] = useState([]); // ✅ tambahan

  const Navigate = useNavigate();

  const FetchMasterUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/kategori_data");
      setMasterUser(res.data || []);
    } catch (err) {
      console.error("Gagal ambil master user:", err);
    }
  };

  const getNamaFromNomor = (nomor) => {
    if (!nomor) return "-";
    const found = masterUser.find(
      (x) =>
        x.nomorUnik === nomor ||
        x.nomorUniqe === nomor ||
        x.nomor_unique === nomor ||
        x.nomor_unik === nomor
    );
    return found?.nama || "-";
  };

  const GetStatusFromData = (item) => {
    const explicitStatus = (item?.status || "").toLowerCase();

    // PRIORITAS UTAMA = status yg dikirim dari izin
    if (explicitStatus === "terlambat") return "Terlambat";
    if (explicitStatus === "sakit") return "Sakit";
    if (explicitStatus === "izin") return "Izin";
    if (explicitStatus === "dispensasi") return "Dispensasi";
    if (explicitStatus === "pulang_awal") return "Pulang Awal";
    if (explicitStatus === "alpa") return "Alpa";

    // Kalau tidak ada jam masuk/pulang → Alpa
    if (!item?.jamMasuk && !item?.jamPulang) return "Alpa";

    // Jika ada jam → Hadir
    if (item?.jamMasuk || item?.jamPulang) return "Hadir";

    return "-";
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";

    if (s === "hadir") return "bg-green-600 text-white";
    if (s === "izin") return "bg-blue-600 text-white";
    if (s === "sakit") return "bg-yellow-500 text-white";
    if (s === "dispensasi") return "bg-indigo-600 text-white";
    if (s === "terlambat") return "bg-orange-500 text-white";
    if (s === "pulang awal") return "bg-purple-600 text-white";
    if (s === "alpa") return "bg-red-600 text-white";

    return "bg-gray-300 text-gray-800";
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
    FetchMasterUser(); // ✅ panggil master user juga
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
          typeof item.tanggal === "string" && item.tanggal.startsWith(todayStr)
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
    (item) => item?.nomorUnik || item?.nomor_unik || item?.nomorunik
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
                    cleanedData.map((item, i) => {
                      const nomor =
                        item.nomorUnik || item.nomor_unik || item.nomorunik;

                      return (
                        <tr key={item.id || i}>
                          <td className="px-4 py-3 text-center">{i + 1}</td>

                          <td className="px-4 py-3 text-left">
                            {item.nama && item.nama !== ""
                              ? item.nama
                              : getNamaFromNomor(nomor)}
                          </td>

                          <td className="px-4 py-3 text-center">{nomor}</td>
                          <td className="px-4 py-3 text-center">
                            {item.keterangan || ""}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.jamMasuk ?? "-"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.jamPulang ?? "-"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {formatTanggal(item.tanggal)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                GetStatusFromData(item)
                              )}`}
                            >
                              {GetStatusFromData(item)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-4 text-gray-500 italic"
                      >
                        Tidak ada data presensi di temukan
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
