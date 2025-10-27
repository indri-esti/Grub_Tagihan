import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarT from "./Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Dashboard() {
  const [tagihan, setTagihan] = useState([]);
  const [stats, setStats] = useState({
    totalMember: 0,
    totalTagihan: 0,
    dibayar: 0,
    belumDibayar: 0,
    nominalLunas: 0,
    nominalBelumLunas: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/tagihan")
      .then((res) => {
        const data = res.data;
        setTagihan(data);

        const totalMember = data.length;
        const totalTagihan = data.reduce(
          (acc, cur) => acc + (parseInt(cur.harga) || 0),
          0
        );
        const dibayarData = data.filter((item) => item.status === "Lunas");
        const belumDibayarData = data.filter(
          (item) => item.status === "Belum Lunas"
        );

        const dibayar = dibayarData.length;
        const belumDibayar = belumDibayarData.length;
        const nominalLunas = dibayarData.reduce(
          (acc, cur) => acc + (parseInt(cur.harga) || 0),
          0
        );
        const nominalBelumLunas = belumDibayarData.reduce(
          (acc, cur) => acc + (parseInt(cur.harga) || 0),
          0
        );

        setStats({
          totalMember,
          totalTagihan,
          dibayar,
          belumDibayar,
          nominalLunas,
          nominalBelumLunas,
        });
      })
      .catch((err) => console.error("Gagal ambil data:", err));
  }, []);

  return (
    <div className="pl-[calc(15rem+1%)] pr-[5%] pt-[5%] md:pt-10 transition-all duration-300">
      <SidebarT />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Dashboard
        </h1>

        {/* Grid Statistik 3x2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border rounded-xl p-6 shadow-sm text-center">
            <h2 className="text-gray-600 text-sm">Total Member</h2>
            <p className="text-2xl font-bold text-gray-800">
              {stats.totalMember}
            </p>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm text-center">
            <h2 className="text-gray-600 text-sm">Total Tagihan</h2>
            <p className="text-2xl font-bold text-blue-600">
              Rp {stats.totalTagihan.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm text-center">
            <h2 className="text-gray-600 text-sm">Dibayar</h2>
            <p className="text-2xl font-bold text-green-600">{stats.dibayar}</p>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm text-center">
            <h2 className="text-gray-600 text-sm">Belum Dibayar</h2>
            <p className="text-2xl font-bold text-red-500">
              {stats.belumDibayar}
            </p>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm text-center">
            <h2 className="text-gray-600 text-sm">Nominal Sudah Lunas</h2>
            <p className="text-2xl font-bold text-green-700">
              Rp {stats.nominalLunas.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm text-center">
            <h2 className="text-gray-600 text-sm">Nominal Belum Lunas</h2>
            <p className="text-2xl font-bold text-red-600">
              Rp {stats.nominalBelumLunas.toLocaleString("id-ID")}
            </p>
          </div>
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
                    <td className="px-4 py-2 text-right">{index + 1}</td>
                    <td className="px-4 py-2 text-left">{item.nama}</td>
                    <td className="px-4 py-2 text-left">{item.keterangan}</td>
                    <td className="px-4 py-2">{item.nisn}</td>
                    <td className="px-4 py-2">{item.nohp}</td>
                    <td className="px-4 py-2 text-left">{item.deskripsi}</td>
                    <td className="px-4 py-2 text-right">
                      Rp {parseInt(item.harga || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-2 text-center">{item.tanggal}</td>
                    <td
                      className={`px-4 py-2 text-center font-semibold ${
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
                  <td colSpan="10" className="py-4 text-center text-gray-500">
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
