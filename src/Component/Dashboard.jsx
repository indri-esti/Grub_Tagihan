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
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BASE_URL } from "../config/api";


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

  const [showNomor, setShowNomor] = useState({});


  // ============================
  // STATUS PRESENSI FIX
  // ============================
const GetStatusFromData = (item) => {
  const jamMasuk = item?.jamMasuk || item?.jam_masuk || "";
  const jamPulang = item?.jamPulang || item?.jam_pulang || "";

  const statusRaw = (item?.status || "")
    .toString()
    .toLowerCase()
    .replace(/_/g, " ")
    .trim();

  // 🔥 PRIORITAS ABSOLUT (SAMA DENGAN REKAP PRESENSI)
  if (statusRaw === "izin") return "Izin";
  if (statusRaw === "sakit") return "Sakit";
  if (statusRaw === "dispensasi") return "Dispensasi";
  if (statusRaw === "alpa") return "Alpa";
  if (statusRaw === "pulang awal") return "Pulang Awal";
  if (statusRaw === "terlambat") return "Terlambat";

  // 🔥 HADIR
  if (jamMasuk && !jamPulang) return "Hadir";
  if (jamMasuk && jamPulang) return "Hadir";

  return "Alpa";
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
  return (
    obj.nomor_unik ||
    obj.nomorUnik ||
    obj.nomor ||
    "-"
  ).toString();
};


  const safeParseInt = (val) => {
    if (val === null || val === undefined) return 0;
    const digits = String(val).replace(/[^0-9-]/g, "");
    const n = parseInt(digits, 10);
    return Number.isNaN(n) ? 0 : n;
  };

  const formatTanggalIndo = (tanggal) => {
  if (!tanggal) return "-";
  const d = new Date(tanggal);
  if (isNaN(d)) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ambilNomorUnik = (obj) => {
  if (!obj) return "";
  return String(
    obj.nomor_unik ||
    obj.nomorUnik ||
    obj.nomor ||
    ""
  ).trim();
};


// ============================
// KATEGORI HELPER (WAJIB DI ATAS)
// ============================
const getKategoriUser = (obj) => {
  if (!obj) return "";
  return String(obj.kategori || "")
    .toLowerCase()
    .trim();
};

const isKategori = (obj, kategori) => {
  return getKategoriUser(obj) === kategori.toLowerCase();
};

const totalSiswa = MasterUser.filter((u) => isKategori(u, "siswa")).length;
const totalGuru = MasterUser.filter((u) => isKategori(u, "guru")).length;
const totalKaryawan = MasterUser.filter((u) => isKategori(u, "karyawan")).length;



  // ===== FETCH DASHBOARD =====
const fetchDashboard = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard`);
    const data = res.data || {};
      console.log("DASHBOARD DATA:", res.data);

    setStats({
      totalSiswa: data.totalSiswa ?? 0,
      totalGuru: data.totalGuru ?? 0,
      totalKaryawan: data.totalKaryawan ?? 0,
      totalTagihan: data.totalTagihan ?? 0,
      totalLunas: data.totalLunas ?? 0,
      totalBelumLunas: data.totalBelumLunas ?? 0,
    });

    setPresensi(data.presensiTerbaru ?? []);
  } catch (err) {
    console.error("Gagal load dashboard:", err);
  }
};

// ===== FETCH MASTER USER =====
const fetchMasterUser = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/masterdata`);
    setMasterUser([...res.data].reverse());
    setKategoriData([...res.data].reverse());
  } catch (err) {
    console.error("Gagal ambil master data:", err);
  }
};

// ===== FETCH TAGIHAN =====
const fetchTagihan = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/tagihan`);
    const sorted = [...(res.data || [])].sort((a, b) => b.id - a.id);
    setTagihan(sorted);
  } catch (err) {
    console.error("Gagal ambil tagihan:", err);
  }
};


const hitungTotalTagihan = (data) => {
  return data.reduce((total, item) => {
    return total + safeParseInt(item.harga);
  }, 0);
};


const fetchPresensi = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/presensi`);
    const presensiData = res.data || [];

    presensiData.sort((a, b) => {
      // 1️⃣ terakhir diedit / dibuat
      const updatedA = new Date(a.updated_at || a.updatedAt || 0).getTime();
      const updatedB = new Date(b.updated_at || b.updatedAt || 0).getTime();
      if (updatedA !== updatedB) return updatedB - updatedA;

      // 2️⃣ tanggal presensi
      const dateA = a.tanggal ? new Date(a.tanggal).getTime() : 0;
      const dateB = b.tanggal ? new Date(b.tanggal).getTime() : 0;
      if (dateA !== dateB) return dateB - dateA;

      // 3️⃣ id terbesar di atas
      return (b.id || 0) - (a.id || 0);
    });

    setPresensi(presensiData);
  } catch (err) {
    console.error("Gagal ambil presensi:", err);
  }
};


const [IzinPresensi, setIzinPresensi] = useState([]);

 const fetchIzinPresensi = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/izinpresensi`);
    const izinData = res.data || [];

    izinData.sort((a, b) => {
      // 🔥 prioritas terakhir diedit
      const updatedA = new Date(a.updated_at || a.updatedAt || 0).getTime();
      const updatedB = new Date(b.updated_at || b.updatedAt || 0).getTime();
      if (updatedA !== updatedB) return updatedB - updatedA;

      // 🔥 fallback tanggal
      const dateA = a.tanggal ? new Date(a.tanggal).getTime() : 0;
      const dateB = b.tanggal ? new Date(b.tanggal).getTime() : 0;
      if (dateA !== dateB) return dateB - dateA;

      // 🔥 terakhir id
      return (b.id || 0) - (a.id || 0);
    });

    setIzinPresensi(izinData);
  } catch (err) {
    console.error("Gagal ambil izin presensi:", err);
  }
};




useEffect(() => {
  fetchDashboard();
  fetchMasterUser();
  fetchTagihan();
  fetchPresensi();
  fetchIzinPresensi(); 
}, []);

  const cards = [
     {
    title: "Total Siswa",
    value: totalSiswa,
    icon: <FaUsers />,
    gradient: "from-green-400 to-green-600",
  },
  {
    title: "Total Guru",
    value: totalGuru,
    icon: <FaChalkboardTeacher />,
    gradient: "from-blue-400 to-blue-600",
  },
  {
    title: "Total Karyawan",
    value: totalKaryawan,
    icon: <FaUserTie />,
    gradient: "from-yellow-400 to-yellow-600",
  },
    {
  title: "Total Tagihan",
  value: `Rp ${hitungTotalTagihan(tagihan).toLocaleString("id-ID")}`,
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



const filteredPresensi = Presensi.filter((p) => {
  // tampilkan semua
  if (filterPresensi === "semua") return true;

  const nomorPresensi = ambilNomorUnik(p);
  if (!nomorPresensi) return false;

  const user = MasterUser.find(
    (u) => ambilNomorUnik(u) === nomorPresensi
  );

  if (!user) return false;

  return isKategori(user, filterPresensi);
});




 const GetNamaByNomor = (nomor) => {
  if (!nomor || nomor === "-") return "-";

  const user = MasterUser.find(
    (u) => String(u.nomor_unik) === String(nomor)
  );

  return user?.nama || "-";
};

const [darkMode, setDarkMode] = useState(false);



  return (
    <div
  className={`pl-[calc(15rem+2%)] pr-[4%] pt-[4%] min-h-screen transition-all duration-300
  ${darkMode ? "dark bg-gray-900" : "bg-gray-100"}`}
>
      <SidebarT />
      
  <button
  onClick={() => setDarkMode(!darkMode)}
  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
    border shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200
    ${
      darkMode
        ? "bg-gray-800 text-gray-100 border-gray-700"
        : "bg-white text-gray-800 border-gray-200"
    }
  `}
>
  {darkMode ? "🌙 Mode Gelap" : "☀️ Mode Terang"}
</button>



      <div className="p-6 md:p-10 max-w-10xl mx-auto">
        <div className="mb-8 rounded-2xl bg-white/70 backdrop-blur-md shadow flex items-center justify-between px-6 py-4">
      

  {/* CONTAINER HEADER */}
<div className="w-full flex flex-col items-center justify-center py-4 gap-2">
  

  {/* JUDUL TENGAH */}
  <div className="flex items-center gap-3">
    <FaChartBar className="text-blue-600 text-2xl" />
    <h1 className="text-2xl font-bold text-gray-800">
      Dashboard
    </h1>
  </div>

  {/* MARQUEE DI BAWAH */}
  <div className="w-full max-w-3xl overflow-hidden">
    <div className="whitespace-nowrap animate-marquee text-sm text-gray-600 text-center">
      📢 Selamat datang di School Web Dashboard —
      🔔 Sistem monitoring data terpusat dan terintegrasi —
      🕒 {new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </div>
  </div>
</div>
  </div>

</div>

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
                 const tanggalIndo = formatTanggalIndo(p.tanggal);


                  const nomorUnik = getNomorUnik(p);

                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-2 px-4 text-left">{i + 1}</td>
                      <td className="py-2 px-4 text-left">
  {p.nama || GetNamaByNomor(nomorUnik)}
</td>

                      <td className="px-4 py-3 text-center">
  <div className="flex items-center justify-center gap-2">
    <span className="font-mono tracking-widest">
      {showNomor[i] ? nomorUnik : "●●●●●●●●"}
    </span>

     <button
      onClick={() =>
        setShowNomor((prev) => ({
          ...prev,
          [i]: !prev[i],
        }))
      }
      className=" bg-gray-100 hover:bg-gray-200 transition"
      title={showNomor[i] ? "Tampilkan" : "Sembunyikan"}
    >
      {showNomor[i] ? (
        <FaEye className="text-gray-700" size={16} />
      ) : (
        <FaEyeSlash className="text-gray-700" size={16} />
      )}
    </button>
  </div>
</td>

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
                      <td className="py-2 px-4 text-left">{s.jabatankelas}</td>
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
                      <td className="py-2 px-4 text-left">{g.jabatankelas}</td>
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
                      <td className="py-2 px-4 text-left">{k.jabatankelas}</td>
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
                  <td className="py-2 px-4 text-center">
  {formatTanggalIndo(t.tanggal)}
</td>
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
  );
} 