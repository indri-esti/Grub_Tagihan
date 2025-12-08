import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AbsensiPage = () => {
  const [nuk, setNuk] = useState("");
  const [mode, setMode] = useState("masuk"); // masuk / pulang
  const [currentTime, setCurrentTime] = useState("");

  const navigate = useNavigate();

  // ⏱ Update jam realtime
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("id-ID"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ➕ Simpan presensi masuk/pulang
  const handleSimpan = async () => {
    if (!nuk) {
      return Swal.fire("Nomor Unik kosong!", "Isi terlebih dahulu.", "warning");
    }

    const now = new Date();
    const jam = now.toLocaleTimeString("id-ID");
    const tanggal = now.toLocaleDateString("id-ID");

    const payload = {
      nomorUnik: nuk,
      jamMasuk: mode === "masuk" ? jam : "-",
      jamPulang: mode === "pulang" ? jam : "-",
      tanggal: tanggal,
      status: mode === "masuk" ? "Hadir" : "Pulang",
      keterangan: mode === "masuk" ? "Masuk" : "Pulang",
    };

    try {
      await axios.post("http://localhost:5000/presensi", payload);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Presensi ${mode} berhasil disimpan.`,
        timer: 1500,
        showConfirmButton: false,
      });

      setNuk("");

      setTimeout(() => {
        navigate("/absensi");
      }, 1200);

    } catch (error) {
      Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan.", "error");
      console.log(error);
    }
  };

  // 🔙 Tombol batal
  const handleBatal = () => {
    navigate("/presensisemua");
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">

      <div className="max-w-md w-full bg-gray-800 p-6 rounded-xl border border-cyan-400 shadow-lg">
        <h1 className="text-center text-xl text-cyan-300 font-semibold mb-3">
          ABSENSI DIGITAL
        </h1>

        <p className="text-center text-3xl font-bold text-cyan-400 mb-4">
          {currentTime}
        </p>

        {/* MODE BUTTON */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setMode("masuk")}
            className={`w-1/2 p-3 rounded-lg font-semibold 
            ${mode === "masuk" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Masuk
          </button>

          <button
            onClick={() => setMode("pulang")}
            className={`w-1/2 p-3 rounded-lg font-semibold 
            ${mode === "pulang" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Pulang
          </button>
        </div>

        <input
          type="text"
          placeholder="Masukkan Nomor Unik..."
          className="w-full p-3 rounded-lg mb-4 outline-none border border-cyan-300 bg-gray-700 text-white"
          value={nuk}
          onChange={(e) => setNuk(e.target.value)}
        />

        <button
          onClick={handleSimpan}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-lg font-semibold mb-3"
        >
          Simpan Presensi {mode === "masuk" ? "Masuk" : "Pulang"}
        </button>

        {/* ⭐ TOMBOL BATAL */}
        <button
          onClick={handleBatal}
          className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg font-semibold"
        >
          Batal
        </button>

      </div>

    </div>
  );
};

export default AbsensiPage;
