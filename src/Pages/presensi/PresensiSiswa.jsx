// ===========================================
// PRESENSI SISWA - STATUS SUDAH DIPERBAIKI
// ===========================================

import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarT from "../../Component/Sidebar";
import { FaUserCheck, FaRegFileAlt, FaDoorOpen, FaDoorClosed } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const PresensiSiswa = () => {
  const [Data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [masterUser, setMasterUser] = useState([]);
  const [CurrentFilter, setCurrentFilter] = useState("semua");

  const navigate = useNavigate();

  const FetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/presensi");
      const hasil = res.data || [];

      hasil.sort((a, b) => {
        const ta = a?.tanggal ? new Date(a.tanggal).getTime() : 0;
        const tb = b?.tanggal ? new Date(b.tanggal).getTime() : 0;
        return tb - ta;
      });

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

  const FetchMasterUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/kategori_data");
      setMasterUser(res.data || []);
    } catch (err) {
      console.error("Gagal ambil master user:", err);
    }
  };

  useEffect(() => {
    FetchData();
    FetchMasterUser();
  }, []);

  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    try {
      const d = new Date(tgl);
      if (isNaN(d)) return tgl;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return tgl;
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

  // ===========================================
  //  STATUS DIBENARKAN — HANYA BAGIAN INI
  // ===========================================
  const getStatusFromData = (item) => {
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

  // ===========================================
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

  const handleDelete = async (id) => {
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
          await axios.delete(`http://localhost:5000/presensi/${id}`);
          Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
          FetchData();
        } catch (error) {
          console.error("Hapus error:", error);
          Swal.fire("Gagal!", "Tidak dapat menghapus data.", "error");
        }
      }
    });
  };

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
              <FaUserCheck className="text-green-300 text-3xl" />
              Presensi Semua
            </h2>
          </div>

          {/* MENU — TIDAK DIUBAH */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div
              onClick={() => navigate("/izinpresensi")}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-5 flex flex-col items-center justify-center shadow-md transition"
            >
              <FaRegFileAlt className="text-3xl mb-2" />
              <p className="text-lg font-medium">Izin Presensi</p>
            </div>

            <div
              onClick={() => navigate("/presensimasuk")}
              className="cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-xl p-5 flex flex-col items-center justify-center shadow-md transition"
            >
              <FaDoorOpen className="text-3xl mb-2" />
              <p className="text-lg font-medium">Presensi Masuk</p>
            </div>

            <div
              onClick={() => navigate("/presensipulang")}
              className="cursor-pointer bg-orange-600 hover:bg-orange-700 text-white rounded-xl p-5 flex flex-col items-center justify-center shadow-md transition"
            >
              <FaDoorClosed className="text-3xl mb-2" />
              <p className="text-lg font-medium">Presensi Pulang</p>
            </div>
          </div>

          {/* FILTER — TIDAK DIUBAH */}
          <div className="flex items-center gap-3 mb-4">
            <label className="text-gray-700 font-medium">Filter:</label>

            <select
              onChange={(e) => {
                const v = e.target.value.toLowerCase();
                setCurrentFilter(v);

                if (v === "semua") {
                  setFilteredData(Data);
                  return;
                }

                const f = Data.filter((item) => {
                  const nomor =
                    item?.nomorUnik ||
                    item?.nomor_unik ||
                    item?.nomorunik;

                  const user = masterUser.find(
                    (x) =>
                      x.nomorUnik === nomor ||
                      x.nomorUniqe === nomor ||
                      x.nomor_unique === nomor ||
                      x.nomor_unik === nomor ||
                      x.nomor === nomor
                  );

                  if (!user) return false;

                  const kategori = String(user.kategori || "").toLowerCase();

                  return kategori === v;
                });

                setFilteredData(f);
              }}
              className="border border-gray-400 rounded-lg px-3 py-2"
            >
              <option value="semua">Semua</option>
              <option value="siswa">Siswa</option>
              <option value="guru">Guru</option>
              <option value="karyawan">Karyawan</option>
            </select>
          </div>

          {/* TABEL */}
          {loading ? (
            <p className="text-center py-4 text-gray-500">Memuat data...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700 border border-gray-300/60 rounded-xl overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    <th className="px-4 py-3 text-center">No</th>
                    <th className="px-4 py-3 text-center">Nama</th>
                    <th className="px-4 py-3 text-center">Nomor Uniqe</th>
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
                        item?.nomorUnik || item?.nomor_unik || item?.nomorunik;

                      const finalKeterangan =
                        item?.keterangan ||
                        item?.keteranganIzin ||
                        item?.keterangan_izin ||
                        item?.alasan ||
                        item?.ket ||
                        item?.note ||
                        "";

                      const statusBaru = getStatusFromData(item);

                      return (
                        <tr key={item.id ?? i}>
                          <td className="px-4 py-3 text-center">{i + 1}</td>

                          <td className="px-4 py-3 text-left">
                            {item?.nama && item.nama !== ""
                              ? item.nama
                              : getNamaFromNomor(nomor)}
                          </td>

                          <td className="px-4 py-3 text-center">{nomor}</td>
                          <td className="px-4 py-3 text-center">{finalKeterangan || "-"}</td>
                          <td className="px-4 py-3 text-center">{item?.jamMasuk ?? "-"}</td>
                          <td className="px-4 py-3 text-center">{item?.jamPulang ?? "-"}</td>
                          <td className="px-4 py-3 text-center">{formatTanggal(item?.tanggal)}</td>

                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(
                                statusBaru
                              )}`}
                            >
                              {statusBaru}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() =>
                                  Swal.fire({
                                    title: "Detail Presensi",
                                    html: `
                                      <div style="text-align: left; font-size: 15px; line-height: 1.5;">
                                        <b>Nama:</b> ${item?.nama || getNamaFromNomor(nomor)} <br/>
                                        <b>Nomor Unik:</b> ${nomor} <br/>
                                        <b>Keterangan:</b> ${finalKeterangan || "-"} <br/>
                                        <b>Jam Masuk:</b> ${item?.jamMasuk ?? "-"} <br/>
                                        <b>Jam Pulang:</b> ${item?.jamPulang ?? "-"} <br/>
                                        <b>Tanggal:</b> ${formatTanggal(item?.tanggal)} <br/>
                                        <b>Status:</b> ${statusBaru}
                                      </div>
                                    `,
                                    confirmButtonText: "Tutup",
                                    width: 450
                                  })
                                }
                                className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-500"
                              >
                                📝
                              </button>

                              <button
                                onClick={() => navigate(`/editpresensi/${item.id}`)}
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
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center py-6 text-gray-500 italic"
                      >
                        {CurrentFilter === "siswa"
                          ? "Tidak ada data presensi siswa ditemukan"
                          : CurrentFilter === "guru"
                          ? "Tidak ada data presensi guru ditemukan"
                          : CurrentFilter === "karyawan"
                          ? "Tidak ada data presensi karyawan ditemukan"
                          : "Tidak ada data presensi ditemukan"}
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

export default PresensiSiswa;
