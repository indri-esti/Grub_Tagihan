import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaSignOutAlt,
  FaChartBar,
  FaMoneyBillWave,
  FaChartPie,
  FaWallet,
} from "react-icons/fa";

export default function SidebarT() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin ingin keluar?",
      text: "Anda akan logout dari aplikasi.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        Swal.fire({
          icon: "success",
          title: "Berhasil Logout!",
          text: "Anda akan diarahkan ke halaman login.",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/login");
      }
    });
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaChartBar className="text-cyan-300 drop-shadow-md" />,
      path: "/dashboard",
    },
    {
      name: "Tagihan",
      icon: <FaMoneyBillWave className="text-green-300 drop-shadow-md" />,
      path: "/tagihan",
    },
    {
      name: "Jenis Tagihan",
      icon: <FaChartPie className="text-purple-300 drop-shadow-md" />,
      path: "/jenistagihan",
    },
  ];

  return (
    <div className="flex">
      {/* ✅ Perbaikan di sini: hapus ‘= b.bind(this)’ */}
      <div className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-indigo-900 via-blue-800 to-blue-600 text-white p-6 flex flex-col justify-between shadow-2xl">

        {/* Header */}
        <div className="flex flex-col items-center mb-6 mt-2">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-md mb-3">
            <FaWallet className="text-4xl text-yellow-300 drop-shadow-md" />
          </div>
          <h1 className="text-xl font-bold tracking-wide">Menu Keuangan</h1>
          <div className="w-12 h-[3px] bg-yellow-300 rounded-full mt-2"></div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mt-1 flex-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 ${
                location.pathname === item.path
                  ? "bg-blue-600 shadow-lg scale-[1.03]"
                  : "hover:bg-blue-600 hover:scale-[1.02]"
              }`}
            >
              {item.icon}
              <span className="text-base font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-6 flex justify-center mb-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-700 px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:scale-105 hover:shadow-lg"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
