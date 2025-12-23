import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

/* ================= HELPER JAM ================= */
const dotToColon = (jam) => {
  if (!jam) return "";
  return String(jam).replace(".", ":");
};

const colonToDot = (jam) => {
  if (!jam) return "";
  return String(jam).replace(":", ".");
};
/* ============================================= */

const EditPresensi = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    jam_masuk: "",
    jam_pulang: "",
  });

  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const getEndpoint = (data = {}) => {
    const status = String(data.status || "").toLowerCase();
    const kategori = String(data.kategori || "").toLowerCase();

    if (status === "izin" || status === "dispensasi" || kategori === "izin") {
      return "http://localhost:5000/izinpresensi";
    }

    return "http://localhost:5000/presensi";
  };

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    try {
      setLoading(true);

      const presensiRes = await axios
        .get(`http://localhost:5000/presensi/${id}`)
        .catch(() => null);

      const izinRes = await axios
        .get(`http://localhost:5000/izinpresensi/${id}`)
        .catch(() => null);

      const res = presensiRes || izinRes;
      if (!res) throw new Error("Data tidak ditemukan");

      let data = res.data;
      if (Array.isArray(data)) data = data[0] || null;

      if (!data) {
        Swal.fire("Error", "Data presensi tidak ditemukan.", "error");
        setExistingData(null);
        setForm({ jamMasuk: "", jamPulang: "" });
        return;
      }

      setExistingData(data);
      setForm({
        jamMasuk: dotToColon(data.jamMasuk),
        jamPulang: dotToColon(data.jamPulang),
      });
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      Swal.fire("Error", "Gagal mengambil data presensi.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  /* ================= UPDATE DATA ================= */
 const updatePresensi = async () => {
  if (!existingData) {
    Swal.fire("Error", "Data asli belum dimuat. Coba kembali.", "error");
    return;
  }

  // Kalau dua-duanya kosong, baru dicegah
  if (!form.jamMasuk && !form.jamPulang) {
    Swal.fire("Oops!", "Minimal salah satu jam harus diisi.", "warning");
    return;
  }

  try {
    setSaving(true);

    const updated = {
  ...existingData,
  jamMasuk: form.jamMasuk
    ? colonToDot(form.jamMasuk)
    : existingData.jamMasuk,
  jamPulang: form.jamPulang
    ? colonToDot(form.jamPulang)
    : existingData.jamPulang,

  // 🔥 PENANDA DATA TERBARU
  updatedAt: new Date().toISOString(),
};

    const endpoint = getEndpoint(existingData);

    await axios.put(`${endpoint}/${id}`, updated, {
      headers: { "Content-Type": "application/json" },
    });

    Swal.fire(
      "Berhasil!",
      "Data presensi berhasil diperbarui!",
      "success"
    ).then(() => navigate("/rekappresensi"));
  } catch (err) {
    console.error("Gagal update:", err);
    Swal.fire("Error", "Gagal menyimpan perubahan.", "error");
  } finally {
    setSaving(false);
  }
};

  const batal = () => navigate("/rekappresensi");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Edit Presensi
        </h2>

        {loading ? (
          <p className="text-center">Memuat data...</p>
        ) : existingData === null ? (
          <div className="text-center">
            <p>Data tidak tersedia.</p>
            <button
              onClick={() => navigate("/presensisiswa")}
              className="mt-4 bg-gray-500 text-white py-2 px-4 rounded"
            >
              Kembali
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Jam Masuk
              </label>
              <input
                type="time"
                value={form.jamMasuk}
                onChange={(e) =>
                  setForm({ ...form, jamMasuk: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Jam Pulang
              </label>
              <input
                type="time"
                value={form.jamPulang}
                onChange={(e) =>
                  setForm({ ...form, jamPulang: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full"
                disabled={saving}
              />
            </div>

            <button
              onClick={updatePresensi}
              disabled={saving}
              className={`bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition ${
                saving ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>

            <button
              onClick={batal}
              disabled={saving}
              className="bg-gray-400 text-white py-2 rounded-lg font-bold hover:bg-gray-500"
            >
              Batal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPresensi;
