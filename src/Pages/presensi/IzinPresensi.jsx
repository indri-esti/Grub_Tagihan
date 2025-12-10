import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaRegFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const IzinPresensi = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    kategori: "",
    nama: "",
    nomorUnik: "",
    jenisIzin: "",
    keterangan: "",
  });

  const [kategoriList, setKategoriList] = useState([]);
  const [jenisIzinList, setJenisIzinList] = useState([]); // <-- kategori_izin
  const [loadingKategori, setLoadingKategori] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ============================================
  // FETCH KATEGORI NAMA (kategori_data)
  // ============================================
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

  // ============================================
  // FETCH JENIS IZIN (kategori_izin)
  // ============================================
  const fetchJenisIzin = async () => {
    try {
      const res = await axios.get("http://localhost:5000/kategori_izin");
      const aktifOnly = (res.data || []).filter(
        (item) => String(item.status || "").toLowerCase() === "aktif"
      );
      setJenisIzinList(aktifOnly);
    } catch (err) {
      console.error("Gagal fetch kategori izin:", err);
      Swal.fire("Error", "Gagal memuat jenis izin.", "error");
    }
  };

  useEffect(() => {
    fetchKategori();
    fetchJenisIzin();
  }, []);

  const filteredNamaList = form.kategori
    ? kategoriList.filter(
        (item) =>
          String(item.kategori || "").toLowerCase() ===
          String(form.kategori || "").toLowerCase()
      )
    : [];

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

  // ============================================
  // SUBMIT IZIN (tidak diubah)
  // ============================================
  const submitIzin = async () => {
    if (!form.kategori || !form.nama || !form.jenisIzin) {
      Swal.fire("Oops!", "Semua form wajib diisi.", "warning");
      return;
    }

    const now = new Date();
    const jamNow = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let autoKet = form.keterangan;

    if (String(form.jenisIzin).toLowerCase() === "alpa" && !autoKet)
      autoKet = "Tanpa keterangan";

    if (String(form.jenisIzin).toLowerCase() === "dispensasi" && !autoKet)
      autoKet = "Kegiatan resmi sekolah";

    const jamMasukVal =
      String(form.jenisIzin).toLowerCase() === "terlambat" ? jamNow : "";

    const tanggalNow = new Date().toISOString().split("T")[0];

    const payload = {
      kategori: form.kategori,
      nama: form.nama,
      nomorUnik: form.nomorUnik || "",
      jenisIzin: form.jenisIzin,
      keterangan: autoKet,
      tanggal: tanggalNow,
      status: String(form.jenisIzin).toLowerCase(),
    };

    try {
      setSubmitting(true);

      await axios.post("http://localhost:5000/izinpresensi", payload);

      const presensiPayload = {
        kategori: payload.kategori,
        nama: payload.nama,
        nomorUnik: payload.nomorUnik,
        keterangan: autoKet,
        jamMasuk: jamMasukVal,
        jamPulang: "",
        tanggal: tanggalNow,
        status: String(form.jenisIzin).toLowerCase(),
      };

      await axios.post("http://localhost:5000/presensi", presensiPayload);

      Swal.fire("Berhasil!", "Pengajuan izin berhasil dikirim!", "success").then(
        () => {
          navigate("/presensisemua");
        }
      );

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

  const batal = () => navigate("/presensisemua");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-5 flex items-center gap-2 justify-center">
          <FaRegFileAlt className="text-blue-600 text-3xl" />
          Izin Presensi
        </h2>

        <div className="flex flex-col gap-4">
          {/* Kategori */}
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

          {/* Nama */}
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
              <option key={index} value={String(item.nama || "")}>
                {String(item.nama || "")}
              </option>
            ))}
          </select>

          {/* Nomor Unik */}
          <input
            type="text"
            placeholder="Nomor Unik"
            value={form.nomorUnik}
            readOnly
            className="border rounded-lg px-3 py-2 bg-gray-200 text-gray-600"
          />

          {/* JENIS IZIN DARI kategori_izin */}
       <select
  name="jenisIzin"
  value={form.jenisIzin}
  onChange={(e) => setForm({ ...form, jenisIzin: e.target.value })}
  className="border rounded-lg px-3 py-2"
>
  <option value="" disabled hidden>-- Pilih Jenis Izin --</option>

  {jenisIzinList.map((item) => (
    <option key={item.id} value={item.nama}>
      {item.nama}
    </option>
  ))}
</select>


          {/* Keterangan */}
          <textarea
            name="keterangan"
            placeholder="Tuliskan keterangan izin..."
            value={form.keterangan}
            onChange={(e) =>
              setForm({ ...form, keterangan: e.target.value })
            }
            className="border rounded-lg px-3 py-2 h-24 resize-none"
          />

          {/* Button Submit */}
          <button
            onClick={submitIzin}
            disabled={submitting}
            className={`bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Mengirim..." : "Kirim Izin Presensi"}
          </button>

          {/* Batal */}
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
