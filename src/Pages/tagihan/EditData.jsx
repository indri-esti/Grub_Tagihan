import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../config/api";

const EditData = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nama: "",
    keterangan: "",
    harga: "",
    tanggal: "",
    status: "Belum lunas",
  });

  const [jenisTagihan, setJenisTagihan] = useState([]);

useEffect(() => {
  axios
    .get(`${BASE_URL}/kategoritagihan`)
    .then((res) => {
      console.log("DATA KATEGORI:", res.data); // 🔥 cek ini

      const aktifOnly = res.data.filter(
        (item) => item.status?.toLowerCase() === "aktif"
      );

      console.log("HASIL FILTER:", aktifOnly); // 🔥 cek ini
      setJenisTagihan(aktifOnly);
    })
    .catch((err) =>
      console.error("Gagal mengambil jenis tagihan:", err)
    );
}, []);


  // Ambil data tagihan berdasarkan ID (BE - Spring Boot)
  useEffect(() => {
  axios
    .get(`${BASE_URL}/tagihan/${id}`)
    .then((res) => {
      const data = res.data;

      // 🔥 KONVERSI yyyy-MM-dd → dd/MM/yyyy
      let tanggalFix = "";

if (data.tanggal) {
  // jika backend kirim yyyy-MM-dd atau yyyy-MM-ddTHH:mm:ss
  if (data.tanggal.includes("-")) {
    const dateOnly = data.tanggal.split("T")[0];
    const [year, month, day] = dateOnly.split("-");
    tanggalFix = `${day}/${month}/${year}`;
  }
  // jika sudah dd/MM/yyyy (jaga-jaga)
  else {
    tanggalFix = data.tanggal;
  }
}


      setFormData({
        nama: data.nama ?? "",
        keterangan: data.keterangan ?? "",
        harga: data.harga ?? "",
        tanggal: tanggalFix,
        status:
          data.status === "Lunas" ? "Lunas" : "Belum Lunas",
      });
    })
    .catch(() => {
      Swal.fire("Error", "Gagal mengambil data", "error");
    });
}, [id]);

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tanggal") {
      const cleanValue = value.replace(/[^0-9/]/g, "");
      setFormData({ ...formData, [name]: cleanValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Simpan perubahan
  const handleSubmit = async (e) => {
  e.preventDefault();

  const tanggalPattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

  if (!tanggalPattern.test(formData.tanggal)) {
    Swal.fire({
      icon: "warning",
      title: "Format Tanggal Salah",
      text: "Gunakan format dd/mm/yyyy, contoh: 11/11/2025",
    });
    return;
  }

  // dd/mm/yyyy → yyyy-MM-dd
  const [day, month, year] = formData.tanggal.split("/");
  const tanggalFix = `${year}-${month}-${day}`;

  // 🔥 FIX STATUS
const statusFix =
  formData.status === "Lunas" ? "Lunas" : "Belum Lunas";

try {
  await axios.put(`${BASE_URL}/tagihan/${id}`, {
    ...formData,
    tanggal: tanggalFix,
    status: statusFix,
  });

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Data tagihan berhasil diperbarui!",
      showConfirmButton: false,
      timer: 2000,
    });

    navigate("/tagihan");
  } catch (error) {
    console.error("Gagal mengedit data:", error);
    Swal.fire({
      icon: "error",
      title: "Gagal!",
      text: "Terjadi kesalahan saat mengedit data.",
    });
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Edit Data Tagihan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Nama</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Jenis Tagihan */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">
              Jenis Tagihan
            </label>
            <select
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">-- Pilih Jenis Tagihan --</option>
              {jenisTagihan.map((item) => (
                <option key={item.id} value={item.nama}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Harga */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Harga</label>
            <input
              type="number"
              name="harga"
              value={formData.harga}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Tanggal */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Tanggal</label>
            <input
              type="text"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              placeholder="dd/mm/yyyy"
              maxLength={10}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="Belum Lunas">Belum Lunas</option>
              <option value="Lunas">Lunas</option>
            </select>
          </div>

          {/* Tombol */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/tagihan")}
              className="bg-gray-400 text-white px-4 py-2 rounded-md w-[48%]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md w-[48%]"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditData;
