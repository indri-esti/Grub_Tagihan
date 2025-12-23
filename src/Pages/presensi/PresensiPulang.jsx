import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaDoorClosed } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PresensiPulang = () => {
  const navigate = useNavigate();

  const [nomorUnik, setNomorUnik] = useState("");
  const [nama, setNama] = useState("");
  const [data, setData] = useState([]);
  const [triggerSubmit, setTriggerSubmit] = useState(false);

  // 🔒 PENGAMAN (ANTI DOBEL EFFECT & SWEETALERT KEDIP)
  const isProcessing = useRef(false);

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
  // SUARA
  // ==============================
  const playSound = () => {
    const audio = new Audio("/sound/berhasil.mp3");
    audio.play();
  };

  // ==============================
  // FETCH DATA
  // ==============================
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/presensi");
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==============================
  // AUTO DETEKSI + SUBMIT (FIX)
  // ==============================
  useEffect(() => {
    const processPresensi = async () => {
      if (
        !triggerSubmit ||
        !nomorUnik ||
        data.length === 0 ||
        isProcessing.current
      ) return;

      // 🔒 KUNCI PROSES
      isProcessing.current = true;
      setTriggerSubmit(false);

      const today = new Date().toISOString().split("T")[0];

      const presensiHariIni = data.find((d) => {
        const nomor =
          d.nomorUnik || d.nomorunik || d.nomor_unik || "";
        return nomor === nomorUnik && (d.tanggal || "").startsWith(today);
      });

      if (!presensiHariIni) {
        setNama("");
        isProcessing.current = false;
        return;
      }

      setNama(presensiHariIni.nama || "");

      // ❌ BELUM MASUK
      if (!presensiHariIni.jamMasuk) {
        await Swal.fire(
          "Ditolak!",
          "Anda belum melakukan presensi masuk.",
          "warning"
        );
        isProcessing.current = false;
        return;
      }

      // ℹ️ SUDAH PULANG
      if (presensiHariIni.jamPulang) {
        await Swal.fire(
          "Info",
          "Anda sudah melakukan presensi pulang.",
          "info"
        );
        isProcessing.current = false;
        return;
      }

      try {
        const now = new Date();

        const jamSekarang =
          now.getHours() * 60 + now.getMinutes();
        const batasPulang = 15 * 60;

        if (jamSekarang < batasPulang) {
          await Swal.fire(
            "Ditolak!",
            "Presensi pulang hanya bisa dilakukan setelah jam 15.00",
            "warning"
          );
          isProcessing.current = false;
          return;
        }

        const jamPulangFix = now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });

        await axios.patch(
          `http://localhost:5000/presensi/${presensiHariIni.id}`,
          { jamPulang: jamPulangFix }
        );

        playSound();

        await Swal.fire(
          "Berhasil!",
          "Presensi Pulang dicatat.",
          "success"
        );

        setNomorUnik("");
        setNama("");
        fetchData();
      } catch {
        await Swal.fire(
          "Error",
          "Gagal menyimpan presensi pulang!",
          "error"
        );
      }

      // 🔓 BUKA KUNCI
      isProcessing.current = false;
    };

    processPresensi();
  }, [triggerSubmit, nomorUnik, data]);

  // ==============================
  // TOMBOL BATAL
  // ==============================
  const batal = () => navigate("/presensi");

  // ==============================
  // UI FINAL (TIDAK DIUBAH)
  // ==============================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">

        <div className="flex flex-col items-center mb-7">
          <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-red-600 mb-3">
            <FaDoorClosed className="text-3xl text-red-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-wide">
            Presensi Pulang
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Sistem Pulang Digital
          </p>
        </div>

        <div className="mb-8">
          <div
            className="text-center text-4xl font-mono tracking-widest select-none"
            style={{
              background: "#000",
              color: "#ff3333",
              padding: "18px 0",
              borderRadius: "16px",
              fontWeight: "bold",
              letterSpacing: "6px",
              border: "2px solid #ff0000",
              boxShadow:
                "inset 0 0 12px rgba(255,0,0,0.8), 0 0 10px rgba(255,0,0,0.6)",
            }}
          >
            {jam}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nomor Unik
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Masukkan Nomor Unik"
              value={nomorUnik}
              onChange={(e) => {
                const onlyNumber = e.target.value.replace(/\D/g, "");
                setNomorUnik(onlyNumber);
              }}
              onKeyDown={(e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // ⬅️ INI KUNCINYA
    setTriggerSubmit(true);
  }
}}
              className="w-full px-5 py-3 text-lg rounded-2xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Siswa
            </label>
            <input
              type="text"
              value={nama}
              readOnly
              placeholder="Nama otomatis"
              className="w-full px-5 py-3 text-lg rounded-2xl border border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          <button
            onClick={batal}
            className="w-full py-3 rounded-2xl text-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresensiPulang;
