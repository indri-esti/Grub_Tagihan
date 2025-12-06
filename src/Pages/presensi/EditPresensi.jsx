import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

const EditPresensi = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    keterangan: "",
    status: "",
  });

  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // FETCH DATA PRESENSI BY ID
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/presensi/${id}`);

      // support API yang mengembalikan object atau array
      let data = res.data;
      if (Array.isArray(data)) data = data[0] || null;

      if (!data) {
        Swal.fire("Error", "Data presensi tidak ditemukan.", "error");
        setExistingData(null);
        setForm({ keterangan: "", status: "" });
        return;
      }

      setExistingData(data);
      setForm({
        keterangan: data.keterangan || "",
        status: data.status || "",
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

  // UPDATE DATA PRESENSI (merge agar field lain tidak hilang)
  const updatePresensi = async () => {
    if (!form.status || !form.keterangan) {
      Swal.fire("Oops!", "Semua form harus diisi.", "warning");
      return;
    }

    if (!existingData) {
      Swal.fire("Error", "Data asli belum dimuat. Coba kembali.", "error");
      return;
    }

    try {
      setSaving(true);

      // merge perubahan ke object existingData supaya field lain tidak hilang
      const updated = {
        ...existingData,
        keterangan: form.keterangan,
        status: String(form.status).toLowerCase(),
      };

      await axios.put(`http://localhost:5000/presensi/${id}`, updated, {
        headers: { "Content-Type": "application/json" },
      });

      Swal.fire("Berhasil!", "Data presensi berhasil diperbarui!", "success").then(
        () => navigate("/presensisiswa")
      );
    } catch (err) {
      console.error("Gagal update:", err);
      Swal.fire("Error", "Gagal menyimpan perubahan.", "error");
    } finally {
      setSaving(false);
    }
  };

  const batal = () => navigate("/presensisiswa");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Presensi</h2>

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
            <select
              name="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border rounded-lg px-3 py-2"
              disabled={saving}
            >
              <option value="">-- Pilih Status Presensi --</option>
              <option value="sakit">Sakit</option>
              <option value="izin">Izin</option>
            </select>

            <textarea
              name="keterangan"
              value={form.keterangan}
              placeholder="Tuliskan keterangan..."
              onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
              className="border rounded-lg px-3 py-2 h-24 resize-none"
              disabled={saving}
            />

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
