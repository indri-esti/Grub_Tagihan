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
  FaUserCheck,
} from "react-icons/fa";

export default function Dashboard() {
  const [kategoriData, setKategoriData] = useState([]);
  const [MasterUser, setMasterUser] = useState([]); // FIX: hanya 1 state master user

  const [tagihan, setTagihan] = useState([]);
  const [filterPresensi, setFilterPresensi] = useState("semua");
  const [Presensi, setPresensi] = useState([]);

  const [stats, setStats] = useState({
    totalSiswa: 0,
    totalGuru: 0,
    totalKaryawan: 0,
    totalTagihan: 0,
    totalLunas: 0,
    totalBelumLunas: 0,
  });

  // ============================
  // STATUS PRESENSI FIX
  // ============================
const GetStatusFromData = (item) => {
  const explicitStatus = (item?.status || "")
    .toLowerCase()
    .replace(" ", "_");

  if (explicitStatus === "terlambat") return "Terlambat";
  if (explicitStatus === "sakit") return "Sakit";
  if (explicitStatus === "izin") return "Izin";
  if (explicitStatus === "dispensasi") return "Dispensasi";
  if (explicitStatus === "pulang_awal") return "Pulang Awal";
  if (explicitStatus === "alpa") return "Alpa";
  if (explicitStatus === "hadir") return "Hadir";

  if (!item?.jamMasuk && !item?.jamPulang) return "Alpa";
  if (item?.jamMasuk || item?.jamPulang) return "Hadir";

  return "-";
};

 const GetStatusColor = (status) => {
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


  // helper nomor unik
 const getNomorUnik = (obj) => {
    if (!obj) return "-";
    const keys = [
      "nomorUnik",
      "nomorUniqe",
      "nomor_unik",
      "nomor",
      "kode",
      "id_unik",
    ];
    for (const k of keys) {
      if (obj[k]) return String(obj[k]);
    }
    return "-";
  };

  const safeParseInt = (val) => {
    if (val === null || val === undefined) return 0;
    const digits = String(val).replace(/[^0-9-]/g, "");
    const n = parseInt(digits, 10);
    return Number.isNaN(n) ? 0 : n;
  };

  const FetchMasterUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/kategori_data");
      setMasterUser(res.data || []);
    } catch (err) {
      console.error("Gagal ambil master user:", err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          kategoriRes,
          tagihanRes,
          presensiRes,
          izinRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/kategori_data"),
          axios.get("http://localhost:5000/tagihan"),
          axios.get("http://localhost:5000/presensi"),
          axios.get("http://localhost:5000/izinpresensi"),
        ]);

        const kategori = kategoriRes.data || [];
        const tagihanData = tagihanRes.data || [];
        const presensiData = presensiRes.data || [];
        const izinData = izinRes.data || [];

        /* === GABUNG PRESENSI + IZIN === */
        const gabunganPresensi = [...presensiData, ...izinData].sort(
          (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
        );

        setKategoriData(kategori);
        setTagihan(tagihanData);
        setPresensi(gabunganPresensi);
        setMasterUser(kategori);

        const totalSiswa = kategori.filter((x) => normalize(x.kategori) === "siswa").length;
        const totalGuru = kategori.filter((x) => normalize(x.kategori) === "guru").length;
        const totalKaryawan = kategori.filter((x) => normalize(x.kategori) === "karyawan").length;

        const totalTagihan = tagihanData.reduce(
          (a, b) => a + safeParseInt(b.harga),
          0
        );
        const totalLunas = tagihanData.filter(
          (t) => normalize(t.status) === "lunas"
        ).length;

        setStats({
          totalSiswa,
          totalGuru,
          totalKaryawan,
          totalTagihan,
          totalLunas,
          totalBelumLunas: tagihanData.length - totalLunas,
        });
      } catch (err) {
        console.error("Gagal load dashboard:", err);
      }
    };

    fetchAll();
  }, []);
  const normalize = (str) => {
    return String(str || "").toLowerCase().replace(/\s+/g, "_");
  };


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

 const filteredPresensi = Presensi.filter((p) => {
  if (filterPresensi === "semua") return true;

  const nomor = getNomorUnik(p);

  const user = MasterUser.find(
    (u) =>
      String(u.nomorUnik) === String(nomor) ||
      String(u.nomorUniqe) === String(nomor) ||
      String(u.nomor_unik) === String(nomor) ||
      String(u.nomor) === String(nomor)
  );

  if (!user) return true;

  return String(user.kategori || "").toLowerCase() === filterPresensi;
});


 const GetNamaByNomor = (nomor) => {
    if (!nomor || nomor === "-") return "-";
    const user = MasterUser.find(
      (u) =>
        String(u.nomorUnik) === String(nomor) ||
        String(u.nomorUniqe) === String(nomor) ||
        String(u.nomor_unik) === String(nomor) ||
        String(u.nomor) === String(nomor)
    );
    return user?.nama || "-";
  };



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

        {/* == PRESENSI == */}
        <div className="bg-white shadow-md rounded-2xl overflow-hidden mb-10">
          <h2 className="bg-purple-600 text-white p-4 text-lg font-semibold flex items-center gap-2">
            <FaUserCheck className="text-white text-xl" />
            Data Presensi
          </h2>

          <div className="p-4 flex gap-2 items-center">
            <select
              className="border rounded-lg p-2"
              value={filterPresensi}
              onChange={(e) => setFilterPresensi(e.target.value)}
            >
              <option value="semua">Semua Data</option>
              <option value="siswa">Siswa</option>
              <option value="guru">Guru</option>
              <option value="karyawan">Karyawan</option>
            </select>
          </div>

          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-center">No</th>
                <th className="py-3 px-4 text-center">Nama</th>
                <th className="py-3 px-4 text-center">Nomor Uniqe</th>
                <th className="py-3 px-4 text-center">Keterangan</th>
                <th className="py-3 px-4 text-center">Jam Masuk</th>
                <th className="py-3 px-4 text-center">Jam Pulang</th>
                <th className="py-3 px-4 text-center">Tanggal</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredPresensi.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                filteredPresensi.map((p, i) => {
                  const tanggalIndo = p.tanggal
                    ? new Date(p.tanggal).toLocaleDateString("id-ID")
                    : "-";

                  const nomorUnik = getNomorUnik(p);

                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-2 px-4 text-left">{i + 1}</td>
                      <td className="py-2 px-4 text-left">
                        {GetNamaByNomor(nomorUnik)}
                      </td>
                      <td className="py-2 px-4 text-center">{nomorUnik}</td>
                      <td className="py-2 px-4 text-left">{p.keterangan}</td>
                      <td className="py-2 px-4 text-center">{p.jamMasuk}</td>
                      <td className="py-2 px-4 text-center">{p.jamPulang}</td>
                      <td className="py-2 px-4 text-center">{tanggalIndo}</td>
                      <td className="py-2 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${GetStatusColor(
                            GetStatusFromData(p)
                          )}`}
                        >
                          {GetStatusFromData(p)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* === SISWA === */}
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
                <th className="py-3 px-4 text-center">Level</th>
                <th className="py-3 px-4 text-center">Kelas / Jurusan</th>
              </tr>
            </thead>

            <tbody>
              {kategoriData.filter((x) => isKategori(x, "siswa")).length ===
              0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
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
                      <td className="py-2 px-4 text-left">{s.kategori}</td>
                      <td className="py-2 px-4 text-left">{s.jabatan_kelas}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* === GURU === */}
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
                <th className="py-3 px-4 text-center">Level</th>
                <th className="py-3 px-4 text-center">Mapel</th>
              </tr>
            </thead>

            <tbody>
              {kategoriData.filter((x) => isKategori(x, "guru")).length ===
              0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
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
                      <td className="py-2 px-4 text-left">{g.kategori}</td>
                      <td className="py-2 px-4 text-left">{g.jabatan_kelas}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* === KARYAWAN === */}
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
                <th className="py-3 px-4 text-center">Level</th>
                <th className="py-3 px-4 text-center">Jabatan</th>
              </tr>
            </thead>

            <tbody>
              {kategoriData.filter((x) => isKategori(x, "karyawan")).length ===
              0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
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
                      <td className="py-2 px-4 text-left">{k.kategori}</td>
                      <td className="py-2 px-4 text-left">{k.jabatan_kelas}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* === TAGIHAN === */}
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
                  <td className="py-2 px-4 text-left">
                    {t.jenis || t.keterangan}
                  </td>
                  <td className="py-2 px-4 text-right">
                    Rp {safeParseInt(t.harga).toLocaleString("id-ID")}
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
