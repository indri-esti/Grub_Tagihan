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

  // ==============================
  // JAM DIGITAL LED + BLINK
  // ==============================
  const [jam, setJam] = useState("");
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      // bikin blink titik :
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

  const handleNomorChange = (e) => {
    setForm({
      nomorUnik: e.target.value,
    });
  };

  const submitMasuk = async () => {
    if (!form.nomorUnik) {
      Swal.fire("Oops!", "Nomor Unik wajib diisi!", "warning");
      return;
    }

    const payload = {
      nomorUnik: form.nomorUnik,
      jamMasuk: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      jamPulang: "",
      tanggal: new Date().toISOString(),
    };

    try {
      setSubmitting(true);
      await axios.post("http://localhost:5000/presensi", payload);

      playSound(); // 🔊 bunyi

      Swal.fire("Berhasil!", "Presensi Masuk Tercatat!", "success").then(() => {
        navigate("/presensisemua");
      });

      setForm({ nomorUnik: "" });
    } catch (err) {
      console.error("Gagal menyimpan presensi:", err);
      Swal.fire("Error", "Gagal menyimpan data!", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const batal = () => navigate("/presensisemua");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        {/* HEADER */}
        <h2 className="text-center text-3xl font-extrabold text-green-700 mb-4">
          <div className="flex flex-col items-center">
            <FaDoorOpen className="text-4xl mb-2" />
            Presensi Masuk
          </div>
        </h2>

        {/* JAM LED */}
        <p
          className="text-center text-4xl font-mono tracking-widest mb-8 select-none"
          style={{
            background: "#000",
            color: "#39ff14",
            padding: "14px 0",
            borderRadius: "12px",
            fontWeight: "bold",
            letterSpacing: "6px",
            border: "2px solid #00ff00",
            boxShadow: "0 0 12px #00ff00",
          }}
        >
          {jam}
        </p>

        {/* FORM */}
        <div className="flex flex-col gap-5">
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Nomor Unik
            </label>
            <input
              type="text"
              placeholder="Masukkan Nomor Unik"
              value={form.nomorUnik}
              onChange={handleNomorChange}
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
            />
          </div>

          <button
            onClick={submitMasuk}
            disabled={submitting}
            className={`w-full py-3 rounded-xl text-lg font-bold text-white bg-green-600 hover:bg-green-700 transition ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Menyimpan..." : "Simpan Presensi"}
          </button>

          <button
            onClick={batal}
            className="w-full py-3 rounded-xl text-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresensiMasuk;
