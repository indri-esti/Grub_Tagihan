import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaDoorOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PresensiMasuk = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    kategori: "",
    nama: "",
    nomorUnik: "",
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
    } finally {
      setLoadingKategori(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  // ==============================
  // FILTER DATA BERDASARKAN LEVEL
  // ==============================
  const filteredNamaList = form.kategori
    ? kategoriList.filter(
        (item) => item.kategori?.toLowerCase() === form.kategori.toLowerCase()
      )
    : [];

  // ==============================
  // KETIKA PILIH NAMA → NOMOR UNIK OTOMATIS
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
        "",
    }));
  };

  // ==============================
  // SUBMIT PRESENSI MASUK
  // ==============================
  const submitMasuk = async () => {
    if (!form.kategori || !form.nama || !form.nomorUnik) {
      Swal.fire("Oops!", "Semua form wajib diisi!", "warning");
      return;
    }

    const payload = {
      ...form,
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
        navigate("/presensisiswa"); // ← otomatis navigasi setelah simpan
      });

      setForm({ kategori: "", nama: "", nomorUnik: "" });
    } catch (err) {
      console.error("Gagal menyimpan presensi:", err);
      Swal.fire("Error", err?.message || "Gagal menyimpan data!", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const batal = () => navigate("/presensisiswa");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-5 flex items-center gap-2 justify-center">
          <FaDoorOpen className="text-green-600 text-3xl" />
          Presensi Masuk
        </h2>

        <div className="flex flex-col gap-4">

          {/* FILTER KATEGORI */}
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
            className="border rounded-lg px-3 py-2 focus:outline-green-500"
          >
            <option value="">-- Pilih Kategori --</option>
            <option value="siswa">Siswa</option>
            <option value="guru">Guru</option>
            <option value="karyawan">Karyawan</option>
          </select>

          {/* Pilih Nama berdasarkan kategori */}
          <select
            name="nama"
            onChange={handleNamaSelect}
            value={form.nama}
            className="border rounded-lg px-3 py-2 focus:outline-green-500"
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

          {/* Nomor Unik otomatis */}
          <input
            type="text"
            name="nomorUnik"
            placeholder="Nomor Unik"
            value={form.nomorUnik}
            readOnly
            className="border rounded-lg px-3 py-2 bg-gray-200 text-gray-600"
          />

          <button
            onClick={submitMasuk}
            disabled={submitting}
            className={`bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Menyimpan..." : "Simpan Presensi Masuk"}
          </button>

          <button
            onClick={batal}
            className="bg-gray-400 text-white py-2 rounded-lg font-bold hover:bg-gray-500 transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresensiMasuk;
