import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {FaDoorClosed } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PresensiPulang = () => {
  const navigate = useNavigate();
  const [nomorUnik, setNomorUnik] = useState("");
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/presensi");
    setData(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitPulang = async () => {
    const today = new Date().toISOString().split("T")[0];

    const presensiHariIni = data.find(
      (d) =>
        (d.nomorUnik == nomorUnik ||
         d.nomorunik == nomorUnik ||
         d.nomor_unik == nomorUnik) &&
        d.tanggal.startsWith(today)
    );

    if (!presensiHariIni) {
      Swal.fire("Tidak ditemukan!", "Siswa belum presensi masuk.", "warning");
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/presensi/${presensiHariIni.id}`, {
        jamPulang: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      Swal.fire("Berhasil!", "Presensi Pulang dicatat.", "success").then(() => {
        navigate("/presensisiswa"); // ← otomatis navigasi ke presensisiswa
      });

      setNomorUnik("");
      fetchData();
    } catch {
      Swal.fire("Error", "Gagal menyimpan presensi pulang!", "error");
    }
  };

  const batal = () => navigate("/presensisiswa");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-5 flex items-center gap-2 justify-center">
          <FaDoorClosed className="text-red-600 text-3xl" />
          Presensi Pulang
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nomor Uniqe"
            value={nomorUnik}
            onChange={(e) => setNomorUnik(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-red-500"
          />

          <button
            onClick={submitPulang}
            className="bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition"
          >
            Simpan Presensi Pulang
          </button>

          <button
            onClick={batal}
            className="bg-gray-400 text-white py-2 rounded-lg font-bold hover:bg-gray-500 transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresensiPulang;
