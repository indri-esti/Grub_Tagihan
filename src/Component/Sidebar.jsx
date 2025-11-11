import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaSignOutAlt,
  FaChartBar,
  FaFolderOpen,
  FaChalkboard,
  FaMoneyBillWave,
  FaChartPie,
  FaWallet,
  FaArchive,
  FaClipboardList,
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

  // ✅ Struktur menu sidebar
  const sidebarMenu = [
    {
      section: "Dashboard",
      items: [
        {
          name: "Dashboard",
          icon: <FaChartBar className="text-cyan-300 drop-shadow-md" />,
          path: "/dashboard",
        },
      ],
    },
    {
      section: "Database",
      items: [
        {
          name: "Kategori Data",
          icon: <FaFolderOpen className="text-yellow-300 drop-shadow-md" />,
          path: "/kategoridata",
        },
        {
          name: "Kelas",
          icon: <FaChalkboard  className="text-orange-300 drop-shadow-md" />,
          path: "/datakelas",
        },
        {
          name: "Master Data",
          icon: <FaArchive className="text-green-300 drop-shadow-md" />,
          path: "/masterdata",
        },
      ],
    },
    {
      section: "Keuangan",
      items: [
        {
          name: "Kategori Tagihan",
          icon: <FaChartPie className="text-purple-300 drop-shadow-md" />,
          path: "/kategoritagihan",
        },
        {
          name: "Tagihan",
          icon: <FaMoneyBillWave className="text-green-300 drop-shadow-md" />,
          path: "/tagihan",
        },
        {
          name: "Rekap Tagihan",
          icon: <FaClipboardList className="text-yellow-300 drop-shadow-md" />,
          path: "/rekaptagihan",
        },
      ],
    },
  ];

  return (
    <div className="flex">
      {/* ✅ Sidebar tetap di kiri */}
      <div className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-indigo-900 via-blue-800 to-blue-600 text-white p-6 flex flex-col justify-between shadow-2xl">
        
        {/* Header Sidebar */}
        <div className="flex flex-col items-center mb-6 mt-2">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-md mb-3">
            <FaWallet className="text-4xl text-yellow-300 drop-shadow-md" />
          </div>
          <h1 className="text-xl font-bold tracking-wide text-center">Menu Keuangan</h1>
          <div className="w-12 h-[3px] bg-yellow-300 rounded-full mt-2"></div>
        </div>

        {/* ✅ Menu Navigasi */}
        <nav className="space-y-4 mt-1 flex-1 overflow-y-auto overflow-x-hidden pr-2">
          {sidebarMenu.map((group, i) => (
            <div key={i}>
              <h3 className="text-sm uppercase tracking-wide text-gray-300 font-semibold mb-2">
                {group.section}
              </h3>
              {group.items.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all duration-300 ${
                    location.pathname === item.path
                      ? "bg-blue-600 shadow-lg scale-[1.03]"
                      : "hover:bg-blue-600 hover:scale-[1.02]"
                  }`}
                >
                  {item.icon}
                  <span className="text-base font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Tombol Logout */}
        <div className="mt-6 flex justify-center mb-2">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 bg-red-700 bg-gradient-to-r from-red-500 to-red-700 w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:scale-105 hover:shadow-lg"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
