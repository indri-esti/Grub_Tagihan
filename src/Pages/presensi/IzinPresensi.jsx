import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaRegFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const IzinPresensi = () => {
  const navigate = useNavigate(); // ← diperbaiki

  const [form, setForm] = useState({
    kategori: "",
    nama: "",
    nomorUnik: "",
    jenisIzin: "",
    keterangan: "",
    // bukti: null,  <-- DIHAPUS
  });

  const [kategoriList, setKategoriList] = useState([]);
  const [loadingKategori, setLoadingKategori] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ==============================
  // FETCH DATA KATEGORI
  // ==============================
  const fetchKategori = async () => {
    try {
      setLoadingKategori(true);
      const res = await axios.get("http://localhost:5000/kategori_data");
      setKategoriList(res.data || []);
    } catch (error) {
      console.error("Gagal fetch kategori:", error);
      Swal.fire("Error", "Gagal memuat daftar kategori.", "error");
    } finally {
      setLoadingKategori(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  // ==============================
  // FILTER NAMA BERDASARKAN KATEGORI
  // ==============================
  const filteredNamaList = form.kategori
    ? kategoriList.filter(
        (item) => item.kategori?.toLowerCase() === form.kategori.toLowerCase()
      )
    : [];

  // ==============================
  // KETIKA PILIH NAMA → NOMOR UNIK
  // ==============================
  const handleNamaSelect = (e) => {
    const selectedNama = e.target.value;
    const found = kategoriList.find((item) => item.nama === selectedNama);

    setForm((prev) => ({
      ...prev,
      nama: selectedNama,
      nomorUnik:
        found?.nomorUnik ||
        found?.nomorUniqe ||
        found?.nomor_unique ||
        found?.nomor_unik ||
        "",
    }));
  };

  // (HANDLE FILE DIHAPUS karena diminta)

  // ==============================
  // SUBMIT IZIN PRESENSI
  // ==============================
  const submitIzin = async () => {
    if (!form.kategori || !form.nama || !form.jenisIzin || !form.keterangan) {
      Swal.fire("Oops!", "Semua form wajib diisi (kecuali bukti).", "warning");
      return;
    }

    const payload = {
      kategori: form.kategori,
      nama: form.nama,
      nomorUnik: form.nomorUnik || "",
      jenisIzin: form.jenisIzin,
      keterangan: form.keterangan,
      tanggal: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      status: "izin",
      // bukti: null, <-- dihilangkan
    };

    try {
      setSubmitting(true);

      // Simpan ke resource izinpresensi (tetap)
      await axios.post("http://localhost:5000/izinpresensi", payload, {
        headers: { "Content-Type": "application/json" },
      });

      // JUGA simpan SALINAN ke presensi supaya muncul di daftar presensi siswa
      // (jamMasuk / jamPulang dibiarkan kosong)
      const presensiPayload = {
        kategori: payload.kategori,
        nama: payload.nama,
        nomorUnik: payload.nomorUnik,
        keterangan: payload.keterangan,
        jamMasuk: "",
        jamPulang: "",
        tanggal: payload.tanggal,
        status: payload.status,
      };

      await axios.post("http://localhost:5000/presensi", presensiPayload, {
        headers: { "Content-Type": "application/json" },
      });

      Swal.fire("Berhasil!", "Pengajuan izin berhasil dikirim!", "success").then(() => {
        navigate("/presensisiswa"); // ← navigasi otomatis
      });

      setForm({
        kategori: "",
        nama: "",
        nomorUnik: "",
        jenisIzin: "",
        keterangan: "",
      });
    } catch (err) {
      console.error("Gagal menyimpan izin:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal menyimpan izin! Cek server.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const batal = () => navigate("/presensisiswa");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-5 flex items-center gap-2 justify-center">
          <FaRegFileAlt className="text-blue-600 text-3xl" />
          Izin Presensi
        </h2>

        <div className="flex flex-col gap-4">
          <select
            name="kategori"
            value={form.kategori}
            onChange={(e) =>
              setForm({
                ...form,
                kategori: e.target.value,
                nama: "",
                nomorUnik: "",
              })
            }
            className="border rounded-lg px-3 py-2"
          >
            <option value="">-- Pilih Kategori --</option>
            <option value="siswa">Siswa</option>
            <option value="guru">Guru</option>
            <option value="karyawan">Karyawan</option>
          </select>

          <select
            name="nama"
            onChange={handleNamaSelect}
            value={form.nama}
            className="border rounded-lg px-3 py-2"
            disabled={loadingKategori || !form.kategori}
          >
            <option value="">
              {!form.kategori
                ? "Pilih kategori dulu"
                : loadingKategori
                ? "Memuat daftar..."
                : "-- Pilih Nama --"}
            </option>

            {filteredNamaList.map((item, index) => (
              <option key={index} value={item.nama}>
                {item.nama}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Nomor Unik"
            value={form.nomorUnik}
            readOnly
            className="border rounded-lg px-3 py-2 bg-gray-200 text-gray-600"
          />

          <select
            name="jenisIzin"
            value={form.jenisIzin}
            onChange={(e) => setForm({ ...form, jenisIzin: e.target.value })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">-- Pilih Jenis Izin --</option>
            <option value="sakit">Sakit</option>
            <option value="izin">Izin</option>
            <option value="keperluan">Keperluan Penting</option>
            <option value="lainnya">Lainnya</option>
          </select>

          <textarea
            name="keterangan"
            placeholder="Tuliskan keterangan izin..."
            value={form.keterangan}
            onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
            className="border rounded-lg px-3 py-2 h-24 resize-none"
          />

          {/* INPUT FILE DIHAPUS SESUAI PERMINTAAN */}

          <button
            onClick={submitIzin}
            disabled={submitting}
            className={`bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Mengirim..." : "Kirim Izin Presensi"}
          </button>

          <button
            onClick={batal}
            className="bg-gray-400 text-white py-2 rounded-lg font-bold hover:bg-gray-500"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default IzinPresensi;
