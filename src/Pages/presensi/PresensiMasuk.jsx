import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaDoorOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PresensiMasuk = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nomorUnik: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // 🔧 REVISI: DATA SISWA
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
  // 🔧 REVISI: FETCH DATA SISWA
  // ==============================
  useEffect(() => {
    axios
      .get("http://localhost:5000/kategori_data")
      .then((res) => setSiswaList(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  // ==============================
  // SUARA NOTIFIKASI
  // ==============================
  const playSound = () => {
    const audio = new Audio("/sound/berhasil.mp3");
    audio.play();
  };

  const handleNomorChange = (e) => {
    setForm({ nomorUnik: e.target.value });
  };

  // ==============================
  // SUBMIT MASUK
  // ==============================
  const submitMasuk = async () => {
    if (!form.nomorUnik) {
      Swal.fire("Oops!", "Nomor Unik wajib diisi!", "warning");
      return;
    }

    const now = new Date();

    // 🔧 REVISI: CARI SISWA BERDASARKAN NOMOR UNIK
    const found = siswaList.find(
      (s) =>
        s.nomorUnik === form.nomorUnik ||
        s.nomor_unik === form.nomorUnik
    );

    const payload = {
      nama: found?.nama || "-",
      nomorUnik: form.nomorUnik,
      jamMasuk: now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      jamPulang: "",
      tanggal: now.toISOString().split("T")[0],
      status: "hadir",
    };

    try {
      setSubmitting(true);
      await axios.post("http://localhost:5000/presensi", payload);

      playSound();

      Swal.fire("Berhasil!", "Presensi Masuk Tercatat!", "success").then(() => {
        navigate("/presensimasuk");
      });

      setForm({ nomorUnik: "" });
    } catch (err) {
      console.error("Gagal menyimpan presensi:", err);
      Swal.fire("Error", "Gagal menyimpan data!", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const batal = () => navigate("/presensi");

  // ==============================
  // UI
  // ==============================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-7">
          <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-green-600 mb-3">
            <FaDoorOpen className="text-3xl text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-wide">
            Presensi Masuk
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Sistem Kehadiran Digital
          </p>
        </div>

        {/* JAM LED */}
        <div className="mb-8">
          <div
            className="text-center text-4xl font-mono tracking-widest select-none"
            style={{
              background: "#000",
              color: "#39ff14",
              padding: "18px 0",
              borderRadius: "16px",
              fontWeight: "bold",
              letterSpacing: "6px",
              border: "2px solid #00ff00",
              boxShadow:
                "inset 0 0 12px rgba(0,255,0,0.8), 0 0 10px rgba(0,255,0,0.7)",
            }}
          >
            {jam}
          </div>
        </div>

        {/* FORM */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nomor Unik
            </label>
            <input
              type="text"
              placeholder="Masukkan Nomor Unik"
              value={form.nomorUnik}
              onChange={handleNomorChange}
              className="w-full px-5 py-3 text-lg rounded-2xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition shadow-sm"
            />
          </div>

          <button
            onClick={submitMasuk}
            disabled={submitting}
            className={`w-full py-3 rounded-2xl text-lg font-bold text-white bg-green-600 hover:bg-green-700 active:scale-[0.98] transition-all shadow-md ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Menyimpan..." : "Simpan Presensi"}
          </button>

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

export default PresensiMasuk;
