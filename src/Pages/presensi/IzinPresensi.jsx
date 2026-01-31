import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaRegFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/api";

const IzinPresensi = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nomorUnik: "",
    nama: "",
    jenisIzin: "",
    keterangan: "",
  });

  const [jenisIzinList, setJenisIzinList] = useState([]);
  const [masterUser, setMasterUser] = useState([]); // ✅ FIX UTAMA
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);


  const fetchJenisIzin = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/kategoriizin`);
      const aktif = (Array.isArray(res.data) ? res.data : []).filter(
        (x) => String(x?.status || "").toLowerCase() === "aktif"
      );
      setJenisIzinList(aktif);
    } catch {
      setJenisIzinList([]);
      Swal.fire("Error", "Gagal memuat jenis izin", "error");
    }
  };

  const fetchMasterUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/masterdata`);
      setMasterUser(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMasterUser([]);
      console.error("Gagal ambil master user", err);
    }
  };

  useEffect(() => {
    fetchJenisIzin();
    fetchMasterUser();
  }, []);

  useEffect(() => {
    if (!form.nomorUnik) {
      setForm((prev) => ({ ...prev, nama: "" }));
      return;
    }

    const nomor = String(form.nomorUnik).trim();

    const found = masterUser.find(
      (u) =>
        String(u.nomorUnik || "").trim() === nomor ||
        String(u.nomorUniqe || "").trim() === nomor ||
        String(u.nomor_unik || "").trim() === nomor ||
        String(u.nomor || "").trim() === nomor
    );

    setForm((prev) => ({
      ...prev,
      nama: found?.nama || "",
    }));
  }, [form.nomorUnik, masterUser]);

  const submitIzin = async () => {
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

    if (jenisLower === "izin") {
      jamMasuk = jamNow;
      statusFinal = "izin";
    } else if (jenisLower.includes("terlambat")) {
      jamMasuk = jamNow;
      statusFinal = "terlambat";
    } else if (jenisLower === "hadir") {
      jamMasuk = jamNow;
      statusFinal = "hadir";
    } else if (jenisLower === "pulang awal") {
      jamPulang = jamNow;
      statusFinal = "pulang awal";
    } else if (jenisLower === "dispensasi") statusFinal = "dispensasi";
    else if (jenisLower === "sakit") statusFinal = "sakit";
    else if (jenisLower === "alpa") statusFinal = "alpa";

    const payloadPresensi = {
  nomorUnik: form.nomorUnik,
  nama: form.nama || "-",
  jamMasuk: jamMasuk || null,
  jamPulang: jamPulang || null,
  tanggal: tanggalNow, // yyyy-MM-dd ✔ cocok dengan LocalDate
  status: statusFinal,
  keterangan: form.keterangan || "-"
};


    try {
      setSubmitting(true);
      await axios.post(`${BASE_URL}/presensi`, payloadPresensi);

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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-200 px-4">
    <div className="w-full max-w-md bg-white p-7 rounded-3xl shadow-2xl border border-blue-200">

      {/* HEADER */}
      <div className="flex flex-col items-center mb-5">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
          <FaRegFileAlt className="text-2xl" />
        </div>

        <h2 className="mt-3 text-2xl font-extrabold text-blue-700 tracking-wide">
          IZIN PRESENSI
        </h2>

        <p className="text-xs text-gray-500 tracking-wider mt-1">
          FORM PENGAJUAN IZIN RESMI
        </p>
      </div>

      {/* MARQUEE */}
      <div className="w-full overflow-hidden rounded-xl border border-blue-400 bg-blue-50 mb-6">
  <div
    className="flex w-max animate-marquee"
  >
    <span className="text-blue-700 text-sm font-mono py-2 px-4 whitespace-nowrap">
      📄 FORM IZIN PRESENSI • DATA TERCATAT OTOMATIS • RESMI • REALTIME •
    </span>
    <span className="text-blue-700 text-sm font-mono py-2 px-4 whitespace-nowrap">
      📄 FORM IZIN PRESENSI • DATA TERCATAT OTOMATIS • RESMI • REALTIME •
    </span>
  </div>
</div>

      {/* FORM */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">
            Nomor Unik
          </label>
          <input
            type="text"
            placeholder="Masukkan Nomor Unik"
            value={form.nomorUnik}
            onChange={(e) =>
              setForm({ ...form, nomorUnik: e.target.value })
            }
            className="border border-blue-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none w-full"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">
            Nama
          </label>
          <input
            type="text"
            placeholder="Nama otomatis"
            value={form.nama}
            readOnly
            className="border border-gray-300 rounded-xl px-4 py-2 bg-gray-100 text-gray-700 w-full cursor-not-allowed"
          />
        </div>

        {step === 2 && (
          <>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">
                Jenis Izin
              </label>
              <select
                value={form.jenisIzin}
                onChange={(e) =>
                  setForm({ ...form, jenisIzin: e.target.value })
                }
                className="border border-blue-300 rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">-- Pilih Jenis Izin --</option>
                {jenisIzinList.map((item, index) => (
                  <option key={item?.id ?? index} value={item?.nama || ""}>
                    {item?.nama || "-"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">
                Keterangan
              </label>
              <textarea
                placeholder="Keterangan (opsional)"
                value={form.keterangan}
                onChange={(e) =>
                  setForm({ ...form, keterangan: e.target.value })
                }
                className="border border-blue-300 rounded-xl px-4 py-2 h-24 resize-none w-full focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </>
        )}

        <button
          onClick={submitIzin}
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold tracking-wide transition shadow-md"
        >
          {submitting ? "Mengirim..." : "KIRIM IZIN"}
        </button>
      </div>
    </div>
  </div>
);

};

export default IzinPresensi;
