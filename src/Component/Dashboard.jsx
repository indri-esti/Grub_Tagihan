import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarT from "./Sidebar";
import {
  FaUsers,
  FaMoneyBillWave,
  FaWallet,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaChartBar,
  FaChalkboardTeacher,
  FaUserTie,
} from "react-icons/fa";

export default function Dashboard() {
  const [tagihan, setTagihan] = useState([]);
  const [stats, setStats] = useState({
    totalSiswa: 0,
    totalGuru: 0,
    totalKaryawan: 0,
    totalTagihan: 0,
    dibayar: 0,
    belumDibayar: 0,
    nominalLunas: 0,
    nominalBelumLunas: 0,
  });

  useEffect(() => {
    // Ambil semua data (jika backend sudah siap)
    const fetchData = async () => {
      try {
        const [siswaRes, guruRes, karyawanRes, tagihanRes] = await Promise.all([
          axios.get("http://localhost:5000/siswa").catch(() => ({ data: [] })),
          axios.get("http://localhost:5000/guru").catch(() => ({ data: [] })),
          axios
            .get("http://localhost:5000/karyawan")
            .catch(() => ({ data: [] })),
          axios.get("http://localhost:5000/tagihan").catch(() => ({ data: [] })),
        ]);

        const dataTagihan = tagihanRes.data || [];

        const totalTagihan = dataTagihan.reduce(
          (acc, cur) => acc + (parseInt(cur.harga) || 0),
          0
        );
        const dibayarData = dataTagihan.filter(
          (item) => item.status === "Lunas"
        );
        const belumDibayarData = dataTagihan.filter(
          (item) => item.status === "Belum Lunas"
        );

        const nominalLunas = dibayarData.reduce(
          (acc, cur) => acc + (parseInt(cur.harga) || 0),
          0
        );
        const nominalBelumLunas = belumDibayarData.reduce(
          (acc, cur) => acc + (parseInt(cur.harga) || 0),
          0
        );

        setStats({
          totalSiswa: siswaRes.data.length,
          totalGuru: guruRes.data.length,
          totalKaryawan: karyawanRes.data.length,
          totalTagihan,
          dibayar: dibayarData.length,
          belumDibayar: belumDibayarData.length,
          nominalLunas,
          nominalBelumLunas,
        });

        setTagihan(dataTagihan);
      } catch (err) {
        console.error("Gagal memuat data:", err);
      }
    };

    fetchData();
  }, []);

  // Kartu statistik (kategori + tagihan)
  const cards = [
    {
      title: "Total Siswa",
      value: stats.totalSiswa,
      icon: <FaUsers className="text-blue-500 text-2xl" />,
      bg: "bg-blue-100 border-blue-300",
    },
    {
      title: "Total Guru",
      value: stats.totalGuru,
      icon: <FaChalkboardTeacher className="text-indigo-500 text-2xl" />,
      bg: "bg-indigo-100 border-indigo-300",
    },
    {
      title: "Total Karyawan",
      value: stats.totalKaryawan,
      icon: <FaUserTie className="text-yellow-600 text-2xl" />,
      bg: "bg-yellow-100 border-yellow-300",
    },
    {
      title: "Total Tagihan",
      value: `Rp ${stats.totalTagihan.toLocaleString("id-ID")}`,
      icon: <FaMoneyBillWave className="text-green-600 text-2xl" />,
      bg: "bg-green-100 border-green-300",
    },
    {
      title: "Dibayar",
      value: stats.dibayar,
      icon: <FaCheckCircle className="text-green-600 text-2xl" />,
      bg: "bg-emerald-100 border-emerald-300",
    },
    {
      title: "Belum Dibayar",
      value: stats.belumDibayar,
      icon: <FaTimesCircle className="text-red-500 text-2xl" />,
      bg: "bg-red-100 border-red-300",
    },
    {
      title: "Nominal Lunas",
      value: `Rp ${stats.nominalLunas.toLocaleString("id-ID")}`,
      icon: <FaWallet className="text-green-700 text-2xl" />,
      bg: "bg-teal-100 border-teal-300",
    },
    {
      title: "Nominal Belum Lunas",
      value: `Rp ${stats.nominalBelumLunas.toLocaleString("id-ID")}`,
      icon: <FaExclamationCircle className="text-orange-500 text-2xl" />,
      bg: "bg-orange-100 border-orange-300",
    },
  ];

  return (
    <div className="pl-[calc(15rem+1%)] pr-[5%] pt-[5%] md:pt-10 transition-all duration-300">
      <SidebarT />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center flex items-center justify-center gap-2">
          <FaChartBar className="text-blue-600 text-3xl" />
          Dashboard
        </h1>

        {/* Grid Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`${card.bg} border rounded-xl p-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-gray-700 text-sm font-medium">
                    {card.title}
                  </h2>
                  <p className="text-2xl font-bold text-gray-800 mt-2">
                    {card.value}
                  </p>
                </div>
                <div className="p-3 bg-white/70 rounded-full shadow-sm">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabel Tagihan */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border">
          <table className="min-w-full text-sm text-gray-700 border-collapse">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="py-3 px-4 text-center">No</th>
                <th className="py-3 px-4 text-center">Nama</th>
                <th className="py-3 px-4 text-center">Keterangan</th>
                <th className="py-3 px-4 text-center">NISN</th>
                <th className="py-3 px-4 text-center">No. HP</th>
                <th className="py-3 px-4 text-center">Deskripsi</th>
                <th className="py-3 px-4 text-center">Harga</th>
                <th className="py-3 px-4 text-center">Tanggal</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {tagihan.length > 0 ? (
                tagihan.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50 text-center"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{item.nama}</td>
                    <td className="px-4 py-2">{item.keterangan}</td>
                    <td className="px-4 py-2">{item.nisn}</td>
                    <td className="px-4 py-2">{item.nohp}</td>
                    <td className="px-4 py-2">{item.deskripsi}</td>
                    <td className="px-4 py-2 text-right">
                      Rp {parseInt(item.harga || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-2">{item.tanggal}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        item.status === "Lunas"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-4 text-center text-gray-500">
                    Tidak ada data tagihan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
