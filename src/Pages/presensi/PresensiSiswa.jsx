// ===========================================
// PRESENSI SISWA - STATUS SUDAH DIPERBAIKI
// ===========================================

import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarT from "../../Component/Sidebar";
import {
  FaUserCheck,
  FaRegFileAlt,
  FaDoorOpen,
  FaDoorClosed,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/api";

const PresensiSiswa = () => {
  const [Data, setData] = useState([]);
  const [FilteredData, setFilteredData] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [MasterUser, setMasterUser] = useState([]);
  const [CurrentFilter, SetCurrentFilter] = useState("semua");

  const navigate = useNavigate();

  const FetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/presensi`);
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
    const res = await axios.get(`${BASE_URL}/kategoridata`);
    setMasterUser(res.data || []);
  } catch (err) {
    console.error("Gagal ambil master user:", err);
  }
};

  useEffect(() => {
    FetchData();
    FetchMasterUser();
  }, []);

 return (

    <div className="flex flex-col gap-6">
      <div className="flex-1 flex flex-col gap-6 md:ml-6 bg-white shadow-xl rounded-2xl p-8">

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b pb-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <FaUserCheck className="text-green-600 text-3xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Presensi
            </h2>
          </div>
        </div>

{/* RUNNING TEXT */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-50 to-green-100 rounded-xl py-3">
          <div className="whitespace-nowrap animate-marquee text-green-700 font-semibold text-sm md:text-base">
            📢 Selamat datang di sistem presensi — Silakan pilih menu presensi di bawah — Pastikan data presensi Anda benar dan sesuai 
          </div>
        </div>

        {/* MENU */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">

          {/* IZIN */}
          <div
            onClick={() => navigate("/izinpresensi")}
            className="cursor-pointer group bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all"
          >
            <FaRegFileAlt className="text-4xl mb-3 group-hover:scale-110 transition" />
            <p className="text-lg font-semibold">Izin Presensi</p>
            <span className="text-sm opacity-90 mt-1">
              Sakit, Izin, Dispensasi, dll
            </span>
          </div>

          {/* MASUK */}
          <div
            onClick={() => navigate("/presensimasuk")}
            className="cursor-pointer group bg-gradient-to-br from-green-500 to-green-700 text-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all"
          >
            <FaDoorOpen className="text-4xl mb-3 group-hover:scale-110 transition" />
            <p className="text-lg font-semibold">Presensi Masuk</p>
            <span className="text-sm opacity-90 mt-1">
              Absen kehadiran
            </span>
          </div>

          {/* PULANG */}
          <div
            onClick={() => navigate("/presensipulang")}
            className="cursor-pointer group bg-gradient-to-br from-red-500 to-red-700 text-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all"
          >
            <FaDoorClosed className="text-4xl mb-3 group-hover:scale-110 transition" />
            <p className="text-lg font-semibold">Presensi Pulang</p>
            <span className="text-sm opacity-90 mt-1">
             Absen Pulang / selesai kerja
            </span>
          </div>  

        </div>

      </div>
    </div>
);
};

export default PresensiSiswa;
