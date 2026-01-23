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
  setForm({ ...form, nomorUnik: e.target.value })
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
