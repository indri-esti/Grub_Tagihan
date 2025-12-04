import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarT from "./Sidebar";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaUserTie,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaChartBar,
} from "react-icons/fa";

export default function Dashboard() {
  const [kategoriData, setKategoriData] = useState([]);
  const [tagihan, setTagihan] = useState([]);
  const [Presensi, setPresensi] = useState([]);
  const [stats, setStats] = useState({
    totalSiswa: 0,
    totalGuru: 0,
    totalKaryawan: 0,
    totalTagihan: 0,
    totalLunas: 0,
    totalBelumLunas: 0,
  });

  // helper: ambil nomor unik dari banyak kemungkinan nama field
  const getNomorUnik = (obj) => {
    if (!obj) return "-";
    const keysToCheck = [
      "nomorunik",
      "nomorUnik",
      "nomor_unik",
      "nomorUniqe",   // <-- tambahkan ini (sesuai data yang kamu kasih)
      "id_unik",
      "kode",
      "nomor",
      "uniqueNumber",
      "unique_id",
    ];
    for (const k of keysToCheck) {
      if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== "") {
        return String(obj[k]);
      }
    }
    // kalau data mungkin ada di dalam nested object (misalnya obj.meta?.nomor)
    if (obj.meta && (obj.meta.nomor || obj.meta.nomorunik || obj.meta.nomorUnik)) {
      return obj.meta.nomor || obj.meta.nomorunik || obj.meta.nomorUnik;
    }
    return "-";
  };

  // helper: aman parse int dari string currency (hilangkan non-digit)
  const safeParseInt = (val) => {
    if (val === null || val === undefined) return 0;
    const s = String(val);
    // ambil angka termasuk minus
    const digits = s.replace(/[^0-9-]/g, "");
    const n = parseInt(digits, 10);
    return Number.isNaN(n) ? 0 : n;
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const kategoriRes = await axios.get("http://localhost:5000/kategori_data");
        const tagihanRes = await axios.get("http://localhost:5000/tagihan");
        const PresensiRes = await axios.get("http://localhost:5000/presensi");

        const kategori = kategoriRes.data || [];
        const tagihanData = tagihanRes.data || [];
        const presensiData = PresensiRes.data || [];

        const normalize = (val) => (val ? String(val).toLowerCase() : "");

        // Hitungan kategori
        const totalSiswa = kategori.filter(
          (x) => normalize(x.kategori) === "siswa"
        ).length;

        const totalGuru = kategori.filter(
          (x) => normalize(x.kategori) === "guru"
        ).length;

        const totalKaryawan = kategori.filter(
          (x) => normalize(x.kategori) === "karyawan"
        ).length;

        // Hitungan tagihan (aman)
        const totalTagihan = tagihanData.reduce(
          (a, b) => a + safeParseInt(b.harga),
          0
        );

        const totalLunas = tagihanData.filter(
          (t) => normalize(t.status) === "lunas"
        ).length;

        const totalBelumLunas = tagihanData.length - totalLunas;

        setKategoriData(kategori);
        setTagihan(tagihanData);
        setPresensi(presensiData);

        setStats({
          totalSiswa,
          totalGuru,
          totalKaryawan,
          totalTagihan,
          totalLunas,
          totalBelumLunas,
        });
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };
    fetchAll();
  }, []);

  const cards = [
    {
      title: "Total Siswa",
      value: stats.totalSiswa,
      icon: <FaUsers />,
      gradient: "from-green-400 to-green-600",
    },
    {
      title: "Total Guru",
      value: stats.totalGuru,
      icon: <FaChalkboardTeacher />,
      gradient: "from-blue-400 to-blue-600",
    },
    {
      title: "Total Karyawan",
      value: stats.totalKaryawan,
      icon: <FaUserTie />,
      gradient: "from-yellow-400 to-yellow-600",
    },
    {
      title: "Total Tagihan",
      value: `Rp ${stats.totalTagihan.toLocaleString("id-ID")}`,
      icon: <FaMoneyBillWave />,
      gradient: "from-orange-400 to-orange-600",
    },
    {
      title: "Total Lunas",
      value: stats.totalLunas,
      icon: <FaCheckCircle />,
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      title: "Total Belum Lunas",
      value: stats.totalBelumLunas,
      icon: <FaTimesCircle />,
      gradient: "from-red-400 to-red-600",
    },
  ];

  const isKategori = (data, kategori) =>
    String(data.kategori || "").toLowerCase() === kategori.toLowerCase();

  return (
    <div className="pl-[calc(15rem+2%)] pr-[4%] pt-[4%] bg-gray-100 min-h-screen transition-all duration-300">
      <SidebarT />

      <div className="p-6 md:p-10 max-w-10xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-10 flex items-center justify-center gap-2">
          <FaChartBar className="text-blue-600" /> Dashboard
        </h1>

        {/* === KARTU === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {cards.map((c, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${c.gradient} text-white rounded-2xl shadow-lg p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div>
                <div className="text-sm font-medium opacity-90">{c.title}</div>
                <div className="text-2xl font-bold mt-1">{c.value}</div>
              </div>
              <div className="text-3xl opacity-90">{c.icon}</div>
            </div>
          ))}
        </div>

        {/* === TABEL SISWA === */}
        <div className="bg-white shadow-md rounded-2xl overflow-hidden mb-10">
          <h2 className="bg-green-600 text-white p-4 flex items-center gap-2 text-lg font-semibold">
            <FaUsers /> Data Siswa
          </h2>
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-center">No</th>
                <th className="py-3 px-4 text-center">Nama</th>
                <th className="py-3 px-4 text-center">Email</th>
                <th className="py-3 px-4 text-center">Nomor Uniqe</th>
                <th className="py-3 px-4 text-center">Level</th>
                <th className="py-3 px-4 text-center">Kelas / Jurusan</th>
              </tr>
            </thead>

            <tbody>
              {kategoriData.filter((x) => isKategori(x, "siswa")).length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    Tidak ada data siswa.
                  </td>
                </tr>
              ) : (
                kategoriData
                  .filter((x) => isKategori(x, "siswa"))
                  .slice(0, 5)
                  .map((s, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-2 px-4 text-left">{i + 1}</td>
                      <td className="py-2 px-4 text-left">{s.nama}</td>
                      <td className="py-2 px-4 text-left">{s.email}</td>
                      <td className="py-2 px-4 text-center">{getNomorUnik(s)}</td>
                      <td className="py-2 px-4 text-left">{s.kategori}</td>
                      <td className="py-2 px-4 text-left">{s.jabatan_kelas}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* === TABEL GURU === */}
        <div className="bg-white shadow-md rounded-2xl overflow-hidden mb-10">
          <h2 className="bg-blue-600 text-white p-4 flex items-center gap-2 text-lg font-semibold">
            <FaChalkboardTeacher /> Data Guru
          </h2>
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-center">No</th>
                <th className="py-3 px-4 text-center">Nama</th>
                <th className="py-3 px-4 text-center">Email</th>
                <th className="py-3 px-4 text-center">Nomor Uniqe</th>
                <th className="py-3 px-4 text-center">Level</th>
                <th className="py-3 px-4 text-center">Mapel</th>
              </tr>
            </thead>

            <tbody>
              {kategoriData.filter((x) => isKategori(x, "guru")).length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    Tidak ada data guru.
                  </td>
                </tr>
              ) : (
                kategoriData
                  .filter((x) => isKategori(x, "guru"))
                  .slice(0, 5)
                  .map((g, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-2 px-4 text-left">{i + 1}</td>
                      <td className="py-2 px-4 text-left">{g.nama}</td>
                      <td className="py-2 px-4 text-left">{g.email}</td>
                      <td className="py-2 px-4 text-center">{getNomorUnik(g)}</td>
                      <td className="py-2 px-4 text-left">{g.kategori}</td>
                      <td className="py-2 px-4 text-left">{g.jabatan_kelas}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* === TABEL KARYAWAN === */}
        <div className="bg-white shadow-md rounded-2xl overflow-hidden mb-10">
          <h2 className="bg-yellow-600 text-white p-4 flex items-center gap-2 text-lg font-semibold">
            <FaUserTie /> Data Karyawan
          </h2>

          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-center">No</th>
                <th className="py-3 px-4 text-center">Nama</th>
                <th className="py-3 px-4 text-center">Email</th>
                <th className="py-3 px-4 text-center">Nomor Uniqe</th>
                <th className="py-3 px-4 text-center">Level</th>
                <th className="py-3 px-4 text-center">Jabatan</th>
              </tr>
            </thead>

            <tbody>
              {kategoriData.filter((x) => isKategori(x, "karyawan")).length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    Tidak ada data karyawan.
                  </td>
                </tr>
              ) : (
                kategoriData
                  .filter((x) => isKategori(x, "karyawan"))
                  .slice(0, 5)
                  .map((k, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-2 px-4 text-left">{i + 1}</td>
                      <td className="py-2 px-4 text-left">{k.nama}</td>
                      <td className="py-2 px-4 text-left">{k.email}</td>
                      <td className="py-2 px-4 text-center">{getNomorUnik(k)}</td>
                      <td className="py-2 px-4 text-left">{k.kategori}</td>
                      <td className="py-2 px-4 text-left">{k.jabatan_kelas}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* === TABEL TAGIHAN === */}
        <div className="bg-white shadow-md rounded-2xl overflow-hidden mb-10">
          <h2 className="bg-orange-600 text-white p-4 flex items-center gap-2 text-lg font-semibold">
            <FaMoneyBillWave /> Data Tagihan
          </h2>

          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-center">No</th>
                <th className="py-3 px-4 text-center">Nama</th>
                <th className="py-3 px-4 text-center">Jenis</th>
                <th className="py-3 px-4 text-center">Harga</th>
                <th className="py-3 px-4 text-center">Tanggal</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {tagihan.slice(0, 5).map((t, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-2 px-4 text-left">{i + 1}</td>
                  <td className="py-2 px-4">{t.nama}</td>
                  <td className="py-2 px-4 text-left">{t.jenis || t.keterangan}</td>
                  <td className="py-2 px-4 text-right">
                    Rp {(safeParseInt(t.harga)).toLocaleString("id-ID")}
                  </td>
                  <td className="py-2 px-4 text-center">{t.tanggal}</td>
                  <td
                    className={`py-2 px-4 text-center font-semibold ${
                      String(t.status).toLowerCase() === "lunas"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {t.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
