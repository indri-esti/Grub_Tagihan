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
  const [masterUser, setMasterUser] = useState([]);

  const [statusFilter, setStatusFilter] = useState("semua");
  const [roleFilter, setRoleFilter] = useState("semua");


  // =================== TANGGAL FILTER =================
  const [tanggalFilter, setTanggalFilter] = useState("");

const isValidDate = (value) => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
    const [dd, mm, yyyy] = value.split("/").map(Number);
    const date = new Date(yyyy, mm - 1, dd);
    return (
      date.getFullYear() === yyyy &&
      date.getMonth() === mm - 1 &&
      date.getDate() === dd
    );
  };

  const convertToISODate = (value) => {
    const [dd, mm, yyyy] = value.split("/");
    return `${yyyy}-${mm}-${dd}`;
  };


  // ================= NAVIGATE =================
  const Navigate = useNavigate();

  // ================= MASTER USER =================
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

  const getRoleFromNomor = (nomor) => {
    
  if (!nomor) return "";
  const found = masterUser.find(
    (x) =>
      x.nomorUnik === nomor ||
      x.nomorUniqe === nomor ||
      x.nomor_unique === nomor ||
      x.nomor_unik === nomor
  );
  return (found?.role || found?.kategori || "").toLowerCase();
};


 // ================= STATUS =================
const GetStatusFromData = (item) => {
  const jamMasuk = item?.jamMasuk || item?.jam_masuk || "";
  const jamPulang = item?.jamPulang || item?.jam_pulang || "";

  const statusRaw = (item?.status || "")
    .toString()
    .toLowerCase()
    .replace(/_/g, " ")
    .trim();

  // 🔥 PRIORITAS ABSOLUT (TIDAK BOLEH KETIMPA)
  if (statusRaw === "izin") return "Izin";
  if (statusRaw === "sakit") return "Sakit";
  if (statusRaw === "dispensasi") return "Dispensasi";
  if (statusRaw === "alpa") return "Alpa";
  if (statusRaw === "pulang awal") return "Pulang Awal";
  if (statusRaw === "terlambat") return "Terlambat";

  // 🔥 HADIR NORMAL
  if (jamMasuk && !jamPulang) return "Hadir";
  if (jamMasuk && jamPulang) return "Hadir";

  return "Alpa";
};

  // ================= STATUS COLOR =================


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

  // ================= FETCH DATA (🔥 DITAMBAHKAN IZIN) =================
  const FetchData = async () => {
    try {
      setLoading(true);

      const [presensiRes, izinRes] = await Promise.all([
        axios.get("http://localhost:5000/presensi"),
        axios.get("http://localhost:5000/izinpresensi"),
      ]);

      const presensiData = presensiRes.data || [];
      const izinData = izinRes.data || [];

      const gabunganData = [...presensiData, ...izinData];

      gabunganData.sort(
        (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
      );
      
      setData(gabunganData);
      setFilteredData(gabunganData);
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

 // ================= DELETE =================
const handleDelete = (item) => {
  Swal.fire({
    title: "Hapus Data?",
    text: "Data presensi akan dihapus!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Hapus",
    cancelButtonText: "Batal",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // 🔥 COBA HAPUS KE PRESENSI DULU
        try {
          await axios.delete(`http://localhost:5000/presensi/${item.id}`);
        } catch {
          // 🔥 JIKA GAGAL → COBA KE IZIN
          await axios.delete(
            `http://localhost:5000/izinpresensi/${item.id}`
          );
        }

        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        FetchData();
      } catch (error) {
        console.error("Hapus error:", error);
        Swal.fire("Gagal!", "Tidak dapat menghapus data.", "error");
      }
    }
  });
};


  useEffect(() => {
    FetchData();
    FetchMasterUser();
  }, []);
  // ================= FORMAT DATA ================= //

  const statusBaru = (status) => {
    if (!status) return "Alpa";
    const s = status.toLowerCase();
    if (s === "hadir" || s === "izin" || s === "sakit" || s === "dispensasi" || s === "terlambat" || s === "pulang awal" || s === "alpa") {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }
    return "Alpa";
  };

  const finalKeterangan = (keterangan) => {
    if (!keterangan || keterangan.trim() === "") {
      return "";
    }
    return keterangan;
  };

  const FinalStatus = (status) => {
    if (!status) return "Alpa";
    const s = status.toLowerCase();
    if (s === "hadir" || s === "izin" || s === "sakit" || s === "dispensasi" || s === "terlambat" || s === "pulang awal" || s === "alpa") {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }
    return "Alpa";
  };
  const formatTanggal = (tgl) => {
  if (!tgl) return "-";
  const d = new Date(tgl);
  return d.toLocaleDateString("id-ID"); // dd/mm/yyyy
};



  // ================= FILTER =================
  useEffect(() => {
  let hasil = [...data];

  // ================= TANGGAL MANUAL dd/mm/yyyy =================
  if (tanggalFilter) {
  // ⛔ JANGAN VALIDASI SAAT MASIH NGETIK
  if (tanggalFilter.length < 10) {
    setFilteredData([]);
    return;
  }

  // ❌ FORMAT SALAH BARU MUNCUL SETELAH LENGKAP
  if (!isValidDate(tanggalFilter)) {
    Swal.fire("Format Salah", "Gunakan dd/mm/yyyy", "warning");
    setFilteredData([]);
    return;
  }

  const isoDate = convertToISODate(tanggalFilter);
  hasil = hasil.filter(
    (item) =>
      typeof item.tanggal === "string" &&
      item.tanggal.startsWith(isoDate)
  );
}

  // ================= STATUS =================
  if (statusFilter !== "semua") {
    hasil = hasil.filter(
      (item) => GetStatusFromData(item).toLowerCase() === statusFilter
    );
  }

  // ================= ROLE =================
  if (roleFilter !== "semua") {
    hasil = hasil.filter((item) => {
      const nomor =
        item.nomorUnik || item.nomor_unik || item.nomorunik;
      return getRoleFromNomor(nomor) === roleFilter;
    });
  }

  setFilteredData(hasil);
}, [tanggalFilter, statusFilter, roleFilter, data]);

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

          {/* FILTER */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5 items-start sm:items-center">
            <label className="font-medium text-gray-700">Filter Rekapan:</label>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
            >
              <option value="semua">Semua</option>
              <option value="hari-ini">Hari Ini</option>
              <option value="minggu-ini">Minggu Ini</option>
              <option value="bulan-ini">Bulan Ini</option>
              <option value="tahun-ini">Tahun Ini</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
            >
              <option value="semua">Semua Status</option>
              <option value="hadir">Hadir</option>
              <option value="sakit">Sakit</option>
              <option value="izin">Izin</option>
              <option value="dispensasi">Dispensasi</option>
              <option value="terlambat">Terlambat</option>
              <option value="alpa">Alpa</option>
              <option value="pulang awal">Pulang Awal</option>
            </select>

<select
  value={roleFilter}
  onChange={(e) => setRoleFilter(e.target.value)}
  className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
>
  <option value="semua">Semua Data</option>
  <option value="siswa">Siswa</option>
  <option value="guru">Guru</option>
  <option value="karyawan">Karyawan</option>
</select>

            <input
              type="text"
              placeholder="dd/mm/yyyy"
              value={tanggalFilter}  
              onChange={(e) => setTanggalFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
              />

          </div>

          {/* TABLE */}
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
                    <th className="px-4 py-3 text-center">Aksi</th>
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
                          <td className="px-4 py-3 text-left">
                            {item.keterangan || ""}
                          </td>
                          <td className="px-4 py-3 text-center">
                  {item.jamMasuk ? item.jamMasuk : ""}
</td>
<td className="px-4 py-3 text-center">
                  {item.jamPulang ? item.jamPulang : ""}
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

                          <td className="px-4 py-2 flex justify-center gap-2">
                            <div className="flex justify-center gap-2">
                              <button
  onClick={() =>
    Swal.fire({
      title: "Detail Presensi",
      html: `
        <div style="text-align: left; font-size: 15px; line-height: 1.6;">
          <b>Nama:</b> ${item?.nama || getNamaFromNomor(nomor)} <br/>
          <b>Nomor Unik:</b> ${nomor} <br/>
          <b>Keterangan:</b> ${finalKeterangan(item?.keterangan)} <br/>
         <b>Jam Masuk:</b> ${item?.jamMasuk || item?.jam_masuk || "-"} <br/>
<b>Jam Pulang:</b> ${item?.jamPulang || item?.jam_pulang || "-"} <br/>
          <b>Tanggal:</b> ${formatTanggal(item?.tanggal)} <br/>
          <b>Status:</b> ${statusBaru(GetStatusFromData(item))}
        </div>
      `,
      confirmButtonText: "Tutup",
      width: 450,
    })
  }
  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-500"
>
  📝
</button>

                           <button
  onClick={() => Navigate(`/editpresensi/${item.id}`)}
  className="bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-600"
>
  ✏
</button>


                           <button
  onClick={() => handleDelete(item)}
  className="bg-red-700 text-white px-3 py-2 rounded-md hover:bg-red-600"
>
  🗑
</button>

                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center py-4 text-gray-500 italic"
                      >
                        Tidak ada data presensi ditemukan
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