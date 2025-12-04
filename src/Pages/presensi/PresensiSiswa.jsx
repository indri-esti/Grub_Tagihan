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

  const navigate = useNavigate(); // gunakan lowercase untuk menghindari kebingungan

  const FetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/presensi");
      const hasil = res.data || [];

      // pastikan sorting aman meskipun tanggal kosong
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

  useEffect(() => {
    FetchData();
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

  const getKeterangan = (item) => {
    if (!item) return "-";
    const ket =
      item.keterangan ??
      item.ket ??
      item.alasan ??
      item.keteranganIzin ??
      item.keterangan_izin ??
      item.note ??
      "";

    return ket && typeof ket === "string" && ket.trim() !== "" ? ket : "-";
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-300 text-gray-800";

    const s = String(status).toLowerCase();

    if (s.includes("hadir")) return "bg-green-500 text-white";
    if (s.includes("izin")) return "bg-blue-500 text-white";
    if (s.includes("sakit")) return "bg-yellow-500 text-white";
    if (s.includes("alpa")) return "bg-red-500 text-white";

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

  const cleanedData = (Array.isArray(filteredData) ? filteredData : []).filter(
    (item) =>
      (item?.nama || item?.nama === "") &&
      (item?.nomorUnik || item?.nomor_unik || item?.nomorunik)
  );

  return (
    <div className="pl-[calc(15rem+1%)] pr-[5%] pt-[5%] md:pt-10 transition-all duration-300">
      <SidebarT />

      <div className="flex flex-col gap-6">
        <div className="flex-1 flex flex-col gap-3 md:ml-6 bg-white shadow-md rounded-2xl p-6">

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FaUserCheck className="text-green-300 text-3xl" />
              Presensi Siswa
            </h2>
          </div>

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

          {loading ? (
            <p className="text-center py-4 text-gray-500">Memuat data...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700 
                border border-gray-300/60 rounded-xl overflow-hidden shadow-sm">

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
                    cleanedData.map((item, i) => (
                      <tr key={item.id ?? i} className="hover:bg-blue-50/80 transition-all">

                        <td className="px-4 py-3 text-center">{i + 1}</td>
                        <td className="px-4 py-3 text-left">{item?.nama || "-"}</td>

                        <td className="px-4 py-3 text-center">
                          {item?.nomorUnik || item?.nomor_unik || item?.nomorunik || "-"}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {getKeterangan(item)}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {item?.jamMasuk ?? item?.jam_masuk ?? item?.jammasuk ?? "-"}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {item?.jamPulang ?? item?.jam_pulang ?? item?.jampulang ?? "-"}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {formatTanggal(item?.tanggal)}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(item?.status)}`}>
                            {item?.status || "-"}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center py-6 text-gray-500 italic">
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

export default PresensiSiswa;
