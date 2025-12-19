import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaRegFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const IzinPresensi = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nomorUnik: "",
    nama: "",
    jenisIzin: "",
    keterangan: "",
  });

  const [kategoriList, setKategoriList] = useState([]);
  const [jenisIzinList, setJenisIzinList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const fetchKategori = async () => {
    try {
      const res = await axios.get("http://localhost:5000/kategori_data");
      setKategoriList(Array.isArray(res.data) ? res.data : []);
    } catch {
      setKategoriList([]);
      Swal.fire("Error", "Gagal memuat data kategori", "error");
    }
  };

  const fetchJenisIzin = async () => {
    try {
      const res = await axios.get("http://localhost:5000/kategori_izin");
      const aktif = (Array.isArray(res.data) ? res.data : []).filter(
        (x) => String(x?.status || "").toLowerCase() === "aktif"
      );
      setJenisIzinList(aktif);
    } catch {
      setJenisIzinList([]);
      Swal.fire("Error", "Gagal memuat jenis izin", "error");
    }
  };

  useEffect(() => {
    fetchKategori();
    fetchJenisIzin();
  }, []);

  useEffect(() => {
    if (!form.nomorUnik) {
      setForm((prev) => ({ ...prev, nama: "" }));
      return;
    }

    const found = kategoriList.find(
      (x) =>
        x?.nomorUnik === form.nomorUnik ||
        x?.nomorUniqe === form.nomorUnik ||
        x?.nomor_unique === form.nomorUnik ||
        x?.nomor_unik === form.nomorUnik
    );

    setForm((prev) => ({
      ...prev,
      nama: found?.nama || "",
    }));
  }, [form.nomorUnik, kategoriList]);

  const submitIzin = async () => {
    // ================= STEP VALIDATION (TIDAK DIUBAH) =================
    if (step === 1) {
      if (!form.nomorUnik) {
        Swal.fire("Oops!", "Nomor unik wajib diisi.", "warning");
        return;
      }
      setStep(2);
      return;
    }

    if (!form.jenisIzin) {
      Swal.fire("Oops!", "Jenis izin wajib dipilih.", "warning");
      return;
    }

    // ================= LOGIKA JAM & STATUS =================
    const jenisLower = String(form.jenisIzin).toLowerCase().trim();

    const now = new Date();
    const jamNow = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const tanggalNow = new Date().toISOString().split("T")[0];

    let jamMasuk = "";
    let jamPulang = "";
    let statusFinal = "";

    // ===== IZIN =====
    if (jenisLower === "izin") {
  jamMasuk = jamNow; // JAM KELUAR IZIN
  jamPulang = "";
  statusFinal = "izin";
}

    // ===== TERLAMBAT =====
    else if (jenisLower.includes("terlambat")) {
  jamMasuk = jamNow; // jam real datang
  jamPulang = "";
  statusFinal = "terlambat";
}

    // ===== HADIR (jika suatu saat dipakai) =====
    else if (jenisLower === "hadir") {
      jamMasuk = jamNow;
      jamPulang = "";
      statusFinal = "hadir";
    }

// ====== PULANG AWAL ======
else if (jenisLower === "pulang awal") {
  jamMasuk = "";              // jam masuk tetap dari presensi masuk
  jamPulang = jamNow;         // 🔥 JAM PULANG OTOMATIS
  statusFinal = "pulang awal";
}

    // ===== LAINNYA =====
    else if (jenisLower === "dispensasi") statusFinal = "dispensasi";
    else if (jenisLower === "sakit") statusFinal = "sakit";
    else if (jenisLower === "alpa") statusFinal = "alpa";

    const payloadPresensi = {
      kategori: "izin",
      nama: form.nama || "-",
      nomorUnik: form.nomorUnik,
      keterangan: form.keterangan || "-",
      jamMasuk,
      jamPulang,
      tanggal: tanggalNow,
      status: statusFinal,
      jenisIzin: form.jenisIzin,
    };

    try {
      setSubmitting(true);
      await axios.post("http://localhost:5000/izinpresensi", payloadPresensi);

      Swal.fire("Berhasil", "Izin presensi berhasil dikirim", "success").then(
        () => navigate("/presensi")
      );
    } catch {
      Swal.fire("Error", "Gagal menyimpan izin", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100 px-4">
      <div className="w-full max-w-md bg-white p-7 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 justify-center text-blue-700">
          <FaRegFileAlt className="text-3xl" />
          Izin Presensi
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Masukkan Nomor Unik"
            value={form.nomorUnik}
            onChange={(e) =>
              setForm({ ...form, nomorUnik: e.target.value.trim() })
            }
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            placeholder="Nama otomatis"
            value={form.nama}
            readOnly
            className="border rounded-lg px-3 py-2 bg-gray-100"
          />

          {step === 2 && (
            <>
              <select
                value={form.jenisIzin}
                onChange={(e) =>
                  setForm({ ...form, jenisIzin: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
              >
                <option value="">-- Pilih Jenis Izin --</option>
                {jenisIzinList.map((item, index) => (
                  <option key={item?.id ?? index} value={item?.nama || ""}>
                    {item?.nama || "-"}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Keterangan (opsional)"
                value={form.keterangan}
                onChange={(e) =>
                  setForm({ ...form, keterangan: e.target.value })
                }
                className="border rounded-lg px-3 py-2 h-24 resize-none"
              />
            </>
          )}

          <button
            onClick={submitIzin}
            disabled={submitting}
            className="bg-blue-600 text-white py-2 rounded-lg font-bold"
          >
            {submitting ? "Mengirim..." : "Kirim Izin"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IzinPresensi;
