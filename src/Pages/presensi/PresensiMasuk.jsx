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
  // JAM DIGITAL
  // ==============================
  const [jam, setJam] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const jamLive = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setJam(jamLive);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ==============================
  // HANDLE INPUT
  // ==============================
  const handleNomorChange = (e) => {
    setForm({
      nomorUnik: e.target.value,
    });
  };

  // ==============================
  // SUBMIT MASUK
  // ==============================
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

  // ==============================
  // UI (HANYA NOMOR UNIK)
  // ==============================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">

        <h2 className="text-3xl font-bold mb-2 flex flex-col items-center text-green-700">
          <FaDoorOpen className="text-4xl mb-2" />
          Presensi Masuk
        </h2>

        {/* JAM DIGITAL */}
        <p className="text-center text-xl font-mono text-gray-700 mb-6">
          {jam}
        </p>

        <div className="flex flex-col gap-4">

          {/* Input Nomor Unik */}
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Nomor Unik
            </label>
            <input
              type="text"
              placeholder="Masukkan Nomor Unik"
              value={form.nomorUnik}
              onChange={handleNomorChange}
              className="w-full mt-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
            />
          </div>

          {/* Tombol Simpan */}
          <button
            onClick={submitMasuk}
            disabled={submitting}
            className={`w-full py-3 rounded-xl font-bold text-white text-lg bg-green-600 hover:bg-green-700 transition ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Menyimpan..." : "Simpan Presensi"}
          </button>

          {/* Tombol Batal */}
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

export default PresensiMasuk;
