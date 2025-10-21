import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Sesuaikan path jika perlu
import "./Dashboard.css";

const initialData = [
  {
    id: 1,
    nama: "John Doe",
    keterangan: "SPP",
    nisn: "1234567890",
    nohp: "08123456789",
    deskripsi: "Membayar SPP",
    harga: 200000,
    tanggal: "10/10/2025",
    status: "Lunas",
  },
  {
    id: 2,
    nama: "Jane Smith",
    keterangan: "Uang Gedung",
    nisn: "0987654321",
    nohp: "08987654321",
    deskripsi: "Membayar Uang Gedung",
    harga: 500000,
    tanggal: "13/10/2025",
    status: "Belum Lunas",
  },
  {
    id: 3,
    nama: "Bob Johnson",
    keterangan: "Seragam",
    nisn: "1122334455",
    nohp: "08765432109",
    deskripsi: "Membayar Seragam",
    harga: 900000,
    tanggal: "20/10/2025",
    status: "Lunas",
  },
];

const Dashboard = () => {
  const [data, setData] = useState(initialData);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    keterangan: "",
    nisn: "",
    nohp: "",
    deskripsi: "",
    harga: "",
    tanggal: "",
    status: "",
  });

  // Hitung total pendaftar, total tagihan, total dibayarkan
  const TotalMember = data.length;
  const totalTagihan = data.reduce((acc, item) => acc + item.harga, 0);
  const totalDibayar = data.filter((item) => item.status === "Lunas").length;
  const TotalBelumDibayar = data.filter((item) => item.status === "Belum Lunas").length;

  // Handle input change form edit
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Simpan perubahan edit
  const handleSaveEdit = () => {
    let newData = [...data];
    newData[editIndex] = {
      id: newData[editIndex].id,
      ...formData,
      harga: parseInt(formData.harga, 10) || 0,
    };
    setData(newData);
    setEditIndex(null);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditIndex(null);
  };



  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Dashboard</h1>

        <div className="dashboard-cards">
          <div className="card">
            <div className="card-title">Total Member</div>
            <div className="card-value">{TotalMember}</div>
          </div>
          <div className="card">
            <div className="card-title">Total Tagihan</div>
            <div className="card-value">
              Rp {totalTagihan.toLocaleString("id-ID")}
            </div>
          </div>
          <div className="card">
            <div className="card-title">Dibayarkan</div>
            <div className="card-value">{totalDibayar}</div>
          </div>
          <div className="card">
            <div className="card-title">Belum Dibayar</div>
            <div className="card-value">{TotalBelumDibayar}</div>
          </div>
        </div>

        {/* Tabel Data */}
        <table className="dashboard-table">
          <thead>
            <tr>
              <th className="right-align">No</th>
              <th className="center-align">Nama</th>
              <th className="center-align">Keterangan</th>
              <th className="center-align">NISN</th>
              <th className="center-align">No. HP</th>
              <th className="center-align">Deskripsi</th>
              <th className="center-align">Harga</th>
              <th className="center-align">Tanggal</th>
              <th className="center-align">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) =>
              editIndex === index ? (
                <tr key={item.id} className="editing-row">
                  <td className="right-align">{index + 1}</td>
                  <td className="left-align">
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                    />
                  </td>
                  <td className="left-align">
                    <input
                      type="text"
                      name="keterangan"
                      value={formData.keterangan}
                      onChange={handleChange}
                    />
                  </td>
                  <td className="left-align">
                    <input
                      type="text"
                      name="nisn"
                      value={formData.nisn}
                      onChange={handleChange}
                    />
                  </td>
                  <td className="left-align">
                    <input
                      type="text"
                      name="nohp"
                      value={formData.nohp}
                      onChange={handleChange}
                    />
                  </td>
                  <td className="left-align">
                    <input
                      type="text"
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleChange}
                    />
                  </td>
                  <td className="right-align">
                    <input
                      type="number"
                      name="harga"
                      value={formData.harga}
                      onChange={handleChange}
                    />
                  </td>
                  <td className="center-align">
                    <input
                      type="text"
                      name="tanggal"
                      placeholder="dd/mm/yyyy"
                      value={formData.tanggal}
                      onChange={handleChange}
                    />
                  </td>
                  <td className="center-align">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Dibayar">Dibayar</option>
                      <option value="Belum Dibayar">Belum Dibayar</option>
                    </select>
                  </td>
                  <td className="center-align">
                    <button
                      className="save-btn"
                      onClick={handleSaveEdit}
                      title="Simpan"
                    >
                      💾
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={handleCancelEdit}
                      title="Batal"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={item.id}>
                  <td className="right-align">{index + 1}</td>
                  <td className="left-align">{item.nama}</td>
                  <td className="left-align">{item.keterangan}</td>
                  <td className="left-align">{item.nisn}</td>
                  <td className="left-align">{item.nohp}</td>
                  <td className="left-align">{item.deskripsi}</td>
                  <td className="right-align">
                    Rp {item.harga.toLocaleString("id-ID")}
                  </td>
                  <td className="center-align">{item.tanggal}</td>
                  <td className="center-align">{item.status}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;