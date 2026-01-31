import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaDoorOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/api";

const PresensiMasuk = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nomorUnik: "",
  });

  const [nama, setNama] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [siswaList, setSiswaList] = useState([]);

  // ==============================
  // JAM DIGITAL LED + BLINK
  // ==============================
  const [jam, setJam] = useState("");

  useEffect(() => {

    const timer = setInterval(() => {
      const now = new Date();
      const hh = now.getHours().toString().padStart(2, "0");
      const mm = now.getMinutes().toString().padStart(2, "0");
      const ss = now.getSeconds().toString().padStart(2, "0");

      setJam((prev) => {
        const separator = prev.includes(":") ? " " : ":";
        return `${hh}${separator}${mm}${separator}${ss}`;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ==============================
  // FETCH DATA SISWA
  // ==============================
  useEffect(() => {
    axios
      .get(`${BASE_URL}/masterdata`)
      .then((res) => setSiswaList(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  // ==============================
  // SUARA
  // ==============================
  const playSound = () => {
    const audio = new Audio("/sound/berhasil.mp3");
    audio.play();
  };

  const handleNomorChange = (e) => {
    const onlyNumber = e.target.value.replace(/\D/g, "");
    setForm({ nomorUnik: onlyNumber });
  };

  // ==============================
  // AUTO ISI NAMA + AUTO SUBMIT
  // ==============================
  useEffect(() => {
     if (submitting) return;

  if (!form.nomorUnik) {
    setNama("");
    return;
  }

  const found = siswaList.find(
    (s) =>
      String(s.nomorUnik) === String(form.nomorUnik) ||
      String(s.nomor_unik) === String(form.nomorUnik)
  );

  setNama(found?.nama || "");
  if (!found) return;

  const submitMasuk = async () => {
    const now = new Date();
    const tanggalHariIni = now.toISOString().split("T")[0];

    try {
      setSubmitting(true);

      const cek = await axios.get(`${BASE_URL}/presensi`);

      const sudahMasuk = cek.data.find(
        (p) =>
          String(p.nomorUnik) === String(form.nomorUnik) &&
          p.tanggal === tanggalHariIni &&
          p.jamMasuk &&
          !p.jamPulang
      );

      if (sudahMasuk) {
        Swal.fire(
          "Ditolak!",
          "Siswa ini sudah melakukan presensi masuk hari ini.",
          "warning"
        );
        return;
      }

      const payload = {
        nama: found.nama,
        nomorUnik: form.nomorUnik,
        jamMasuk: now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        jamPulang: "",
        tanggal: tanggalHariIni,
        status: "hadir",
      };

      await axios.post(`${BASE_URL}/presensi`, payload);

      playSound();
      Swal.fire("Berhasil!", "Presensi Masuk Tercatat!", "success");

      setForm({ nomorUnik: "" });
      setNama("");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menyimpan data!", "error");
    } finally {
      setSubmitting(false);
    }
  };

  submitMasuk();
}, [form.nomorUnik, siswaList, submitting]);

  const batal = () => navigate("/presensi");

  // ==============================
  // UI (TAMPILAN TETAP)
  // ==============================
  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
    <div className="w-full max-w-md bg-gray-950 rounded-3xl shadow-2xl border border-emerald-500/40 p-7 text-white">

      {/* HEADER */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-14 h-14 flex items-center justify-center rounded-xl border border-emerald-400 bg-black shadow-inner">
          <FaDoorOpen className="text-2xl text-emerald-400" />
        </div>

        <h2 className="mt-3 text-xl font-bold tracking-widest text-emerald-400">
          PRESENSI DIGITAL
        </h2>

        <p className="text-xs text-gray-400 tracking-wider mt-1">
          SISTEM KEHADIRAN OTOMATIS
        </p>
      </div>

      {/* JAM DIGITAL */}
      <div className="mb-6">
        <div
          className="text-center text-4xl font-mono tracking-[6px] select-none"
          style={{
            background: "#000",
            color: "#39ff14",
            padding: "20px 0",
            borderRadius: "14px",
            border: "2px solid #00ff99",
            boxShadow:
              "inset 0 0 15px rgba(0,255,150,.8), 0 0 18px rgba(0,255,150,.6)",
          }}
        >
          {jam}
        </div>

        {/* SCAN BAR (VISUAL ONLY) */}
        <div className="mt-3 border border-emerald-500 rounded-lg overflow-hidden">
          <div
            className="text-center text-emerald-400 text-xs py-2 font-mono bg-black"
            style={{ animation: "marquee 10s linear infinite" }}
          >
            ⏱️ SCANNING ID • REALTIME • TERENKRIPSI •
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
            placeholder="SCAN / INPUT NOMOR"
            value={form.nomorUnik}
            onChange={handleNomorChange}
            className="w-full px-5 py-3 text-lg rounded-xl bg-black border border-emerald-500/50
            text-emerald-300 font-mono tracking-widest
            focus:ring-2 focus:ring-emerald-500 outline-none"
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

export default PresensiMasuk;