import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaDoorClosed } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/api";

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
      const res = await axios.get(`${BASE_URL}/presensi`);
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
        const batasPulang = 10 * 60;

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

        await axios.put(
  `${BASE_URL}/presensi/${presensiHariIni.id}`,
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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
    <div className="w-full max-w-md bg-gray-950 rounded-3xl shadow-2xl border border-red-500/40 p-7 text-white">

      {/* HEADER */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-14 h-14 flex items-center justify-center rounded-xl border border-red-500 bg-black shadow-inner">
          <FaDoorClosed className="text-2xl text-red-500" />
        </div>

        <h2 className="mt-3 text-xl font-bold tracking-widest text-red-400">
          PRESENSI PULANG
        </h2>

        <p className="text-xs text-gray-400 tracking-wider mt-1">
          SISTEM PULANG DIGITAL
        </p>
      </div>

      {/* JAM DIGITAL */}
      <div className="mb-6">
        <div
          className="text-center text-4xl font-mono tracking-[6px] select-none"
          style={{
            background: "#000",
            color: "#ff3b3b",
            padding: "20px 0",
            borderRadius: "14px",
            border: "2px solid #ff3b3b",
            boxShadow:
              "inset 0 0 15px rgba(255,50,50,.8), 0 0 18px rgba(255,50,50,.6)",
          }}
        >
          {jam}
        </div>

        {/* SCAN BAR */}
        <div className="mt-3 border border-red-500 rounded-lg overflow-hidden">
          <div
            className="text-center text-red-400 text-xs py-2 font-mono bg-black"
            style={{ animation: "marquee 10s linear infinite" }}
          >
            ⏰ SCAN PULANG • REALTIME • TERVALIDASI •
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="space-y-5">
        <div>
          <label className="block text-xs text-gray-400 mb-1 tracking-wider">
            Nomor Unik
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="SCAN / INPUT NOMOR"
            value={nomorUnik}
            onChange={(e) => {
              const onlyNumber = e.target.value.replace(/\D/g, "");
              setNomorUnik(onlyNumber);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setTriggerSubmit(true);
              }
            }}
            className="w-full px-5 py-3 text-lg rounded-xl bg-black border border-red-500/50
            text-red-300 font-mono tracking-widest
            focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1 tracking-wider">
            Nama Siswa
          </label>
          <input
            type="text"
            value={nama}
            readOnly
            placeholder="TERDETEKSI OTOMATIS"
            className="w-full px-5 py-3 text-lg rounded-xl bg-gray-900 border border-gray-700
            text-gray-300 cursor-not-allowed"
          />
        </div>

        <button
          onClick={batal}
          className="w-full py-3 rounded-xl text-sm tracking-widest font-semibold
          bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
        >
          KEMBALI
        </button>
      </div>
    </div>
  </div>
);
};

export default PresensiPulang;
