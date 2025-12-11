import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaDoorClosed } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PresensiPulang = () => {
  const navigate = useNavigate();
  const [nomorUnik, setNomorUnik] = useState("");
  const [data, setData] = useState([]);

  // ==============================
  // JAM DIGITAL LED + BLINK
  // ==============================
  const [jam, setJam] = useState("");
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      setBlink((prev) => !prev);

      const hh = now.getHours().toString().padStart(2, "0");
      const mm = now.getMinutes().toString().padStart(2, "0");
      const ss = now.getSeconds().toString().padStart(2, "0");

      const separator = blink ? ":" : " ";

      setJam(`${hh}${separator}${mm}${separator}${ss}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [blink]);

  // ==============================
  // SUARA NOTIFIKASI
  // ==============================
  const playSound = () => {
    const audio = new Audio("/sound/berhasil.mp3");
    audio.play();
  };

  // ==============================
  // FULLSCREEN MODE
  // ==============================
  const Fullscreen = () => {
    document.documentElement.requestFullscreen();
  };

  // ==============================
  // FETCH DATA
  // ==============================
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/presensi");
      setData(res.data || []);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==============================
  // SUBMIT PRESENSI PULANG
  // ==============================
  const submitPulang = async () => {
    const today = new Date().toISOString().split("T")[0];

    const presensiHariIni = data.find((d) => {
      const nomor = d.nomorUnik || d.nomorunik || d.nomor_unik || "";
      const tanggal = d.tanggal || "";
      return nomor === nomorUnik && tanggal.startsWith(today);
    });

    if (!presensiHariIni) {
      Swal.fire("Tidak ditemukan!", "Siswa belum presensi masuk.", "warning");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5000/presensi/${presensiHariIni.id}`,
        {
          jamPulang: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }
      );

      playSound(); // 🔊 bunyi

      Swal.fire(
        "Berhasil!",
        "Presensi Pulang berhasil dicatat.",
        "success"
      ).then(() => {
        navigate("/presensisemua");
      });

      setNomorUnik("");
      fetchData();
    } catch {
      Swal.fire("Error", "Gagal menyimpan presensi pulang!", "error");
    }
  };

  const batal = () => navigate("/presensisemua");

  // ==============================
  // UI LED CLASSIC
  // ==============================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        {/* HEADER */}
        <h2 className="text-3xl font-bold mb-4 flex flex-col items-center text-red-700">
          <FaDoorClosed className="text-4xl mb-2" />
          Presensi Pulang
        </h2>

        {/* JAM LED */}
        <p
          className="text-center text-4xl font-mono tracking-widest mb-8 select-none"
          style={{
            background: "#000",
            color: "#ff3333",
            padding: "14px 0",
            borderRadius: "12px",
            fontWeight: "bold",
            letterSpacing: "6px",
            border: "2px solid #ff0000",
            boxShadow: "0 0 12px #ff0000",
          }}
        >
          {jam}
        </p>

        {/* FULLSCREEN BUTTON */}
        <div className="flex flex-col gap-5">
          {/* Input Nomor Unik */}
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Nomor Unik
            </label>
            <input
              type="text"
              placeholder="Masukkan Nomor Unik"
              value={nomorUnik}
              onChange={(e) => setNomorUnik(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-red-400 focus:outline-none transition"
            />
          </div>

          {/* Tombol */}
          <button
            onClick={submitPulang}
            className="w-full py-3 rounded-xl font-bold text-white text-lg bg-red-600 hover:bg-red-700 transition shadow-md"
          >
            Simpan Presensi Pulang
          </button>

          <button
            onClick={batal}
            className="w-full py-3 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresensiPulang;
