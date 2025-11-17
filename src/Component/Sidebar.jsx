import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaSignOutAlt,
  FaChartBar,
  FaFolderOpen,
  FaChalkboard,
  FaMoneyBillWave,
  FaChartPie,
  FaArchive,
  FaClipboardList,
  FaMoon,
  FaSun,
} from "react-icons/fa";

// ==============================
//  ICON SEKOLAH DIGITAL (MODERN)
// ==============================
const IconSekolahDigital = () => (
  <div
    style={{
      width: "48px",
      height: "48px",
      background: "#1E40FB",
      borderRadius: "18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
    }}
  >
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="#FFD600"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 7C4 5.895 4.895 5 6 5H18C19.105 5 20 5.895 20 7V17C20 18.105 19.105 19 18 19H6C4.895 19 4 18.105 4 17V7ZM6 7V9H18V7H6ZM12 17C13.105 17 14 16.105 14 15C14 13.895 13.105 13 12 13C10.895 13 10 13.895 10 15C10 16.105 10.895 17 12 17Z" />
    </svg>
  </div>
);

export default function SidebarT() {
  const navigate = useNavigate();
  const location = useLocation();

  // Dark mode storage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleDarkModeToggle = () => setDarkMode((prev) => !prev);

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

  const sidebarMenu = [
    {
      section: "Dashboard",
      items: [
        {
          name: "Dashboard",
          icon: <FaChartBar className="text-cyan-300" />,
          path: "/dashboard",
        },
      ],
    },
    {
      section: "Database",
      items: [
        {
          name: "Kategori Data",
          icon: <FaFolderOpen className="text-yellow-300" />,
          path: "/kategoridata",
        },
        {
          name: "Kelas",
          icon: <FaChalkboard className="text-orange-300" />,
          path: "/datakelas",
        },
        {
          name: "Master Data",
          icon: <FaArchive className="text-green-300" />,
          path: "/masterdata",
        },
      ],
    },
    {
      section: "Keuangan",
      items: [
        {
          name: "Kategori Tagihan",
          icon: <FaChartPie className="text-purple-300" />,
          path: "/kategoritagihan",
        },
        {
          name: "Tagihan",
          icon: <FaMoneyBillWave className="text-green-300" />,
          path: "/tagihan",
        },
        {
          name: "Rekap Tagihan",
          icon: <FaClipboardList className="text-yellow-300" />,
          path: "/rekaptagihan",
        },
      ],
    },
  ];

  return (
    <div className="flex">
      <div
        className={`fixed top-0 left-0 h-full w-64 text-white p-6 flex flex-col justify-between shadow-xl transition-colors duration-300 
        ${darkMode ? "bg-gray-900" : "bg-blue-800"}`}
      >
        <div className="flex flex-col items-center mb-6 mt-2">
          <div
            className={`flex items-center justify-center w-16 h-16 rounded-2xl shadow-md mb-3 ${
              darkMode ? "bg-gray-800" : "bg-blue-700"
            }`}
          >
            {/* ICON SUDAH DIPERBAIKI */}
            <IconSekolahDigital />
          </div>

          <h1 className="text-xl font-bold tracking-wide text-center">
            Menu Keuangan
          </h1>
          <div className="w-12 h-[3px] bg-yellow-300 rounded-full mt-2"></div>
        </div>

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
                      ? darkMode
                        ? "bg-gray-700"
                        : "bg-blue-600"
                      : darkMode
                      ? "hover:bg-gray-800"
                      : "hover:bg-blue-600"
                  }`}
                >
                  {item.icon}
                  <span className="text-base font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Dark / Light Mode */}
        <div className="flex items-center justify-between mt-4 mb-4">
          <div className="flex items-center gap-2">
            {!darkMode ? (
              <FaSun className="text-yellow-300" />
            ) : (
              <FaMoon className="text-yellow-300" />
            )}

            <span className="text-sm font-medium">
              {!darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={darkMode}
              onChange={handleDarkModeToggle}
            />
            <div className="w-11 h-6 bg-gray-400 rounded-full transition duration-300 flex items-center">
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transform transition-all duration-300 ml-1 ${
                  darkMode ? "translate-x-5" : "translate-x-0"
                }`}
              ></div>
            </div>
          </label>
        </div>

        <div className="mt-4 flex justify-center mb-2">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 bg-red-600 w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:scale-105 hover:shadow-lg"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
