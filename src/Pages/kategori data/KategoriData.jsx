import React, { useState } from "react";
import SidebarT from "../../Component/Sidebar";
import { useNavigate } from "react-router-dom";

const KategoriData = () => {
  const Navigate = useNavigate();
  const [kategoriList, setKategoriList] = useState([
    { id: 1, nama: "Siswa" },
    { id: 2, nama: "Guru" },
    { id: 3, nama: "Karyawan" },
  ]);

  const [namaKategori, setNamaKategori] = useState("");
  const [editId, setEditId] = useState(null);

  // Fungsi tambah / edit kategori
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!namaKategori.trim()) {
      alert("Nama kategori tidak boleh kosong!");
      return;
    }

    if (editId) {
      setKategoriList(
        kategoriList.map((item) =>
          item.id === editId ? { ...item, nama: namaKategori } : item
        )
      );
      setEditId(null);
    } else {
      setKategoriList([...kategoriList, { id: Date.now(), nama: namaKategori }]);
    }
    setNamaKategori("");
  };

  // Fungsi edit kategori
  const handleEdit = (id) => {
    const selected = kategoriList.find((item) => item.id === id);
    setNamaKategori(selected.nama);
    setEditId(id);
  };

  // Fungsi hapus kategori
  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus kategori ini?")) {
      setKategoriList(kategoriList.filter((item) => item.id !== id));
    }
  };

  // Fungsi menuju halaman tagihan
  const handleLihatTagihan = () => {
    window.location.href = "http://localhost:5000/tagihan";
  };

  return (
   <div className="pl-[calc(15rem+1%)] pr-[5%] pt-[5%] md:pt-10 transition-all duration-300">
      {/* Sidebar */}
      <SidebarT />

      {/* Konten utama */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🧍‍♂️ Kategori Data</h2>

        {/* Form tambah / edit kategori */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 mb-6 bg-white p-4 rounded-lg shadow"
        >
          <input
            type="text"
            value={namaKategori}
            onChange={(e) => setNamaKategori(e.target.value)}
            placeholder="Masukkan kategori (misal: Siswa)"
            className="border border-gray-300 rounded-md p-2 flex-1 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {editId ? "Simpan Perubahan" : "Tambah"}
          </button>
        </form>

        {/* Tabel daftar kategori */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="border p-2 w-12">No</th>
                <th className="border p-2">Nama Kategori</th>
                <th className="border p-2 w-72">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kategoriList.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{item.nama}</td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      🗑️ Hapus
                    </button>
                    <button
                      onClick={handleLihatTagihan}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      🔗 Lihat Tagihan
                    </button>
                  </td>
                </tr>
              ))}

              {kategoriList.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center text-gray-500 py-4 border"
                  >
                    Belum ada kategori data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KategoriData;
