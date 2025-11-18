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
  FaSchool,
} from "react-icons/fa";

/**
 * SidebarT.jsx
 * - Light mode: sidebar biru
 * - Dark mode: sidebar gelap (hitam/abu)
 * - Single source of truth: `darkMode` state (no tailwind `dark:` usage)
 * - Icon Sekolah digital tanpa gambar (FaSchool)
 */

const IconSekolahDigital = ({ darkMode }) => (
  <div
    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg
      ${darkMode ? "bg-gray-800" : "bg-blue-700"}`}
  >
    <FaSchool className="text-yellow-300 text-4xl" />
  </div>
);

export default function SidebarT() {
  const navigate = useNavigate();
  const location = useLocation();

  // localStorage-driven dark mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    // persist
    localStorage.setItem("darkMode", darkMode);
    // also set html class for other global styles if you use them elsewhere
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
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
        { name: "Dashboard", icon: <FaChartBar className="text-cyan-300" />, path: "/dashboard" },
      ],
    },
    {
      section: "Database",
      items: [
        { name: "Kategori Data", icon: <FaFolderOpen className="text-yellow-300" />, path: "/kategoridata" },
        { name: "Kelas", icon: <FaChalkboard className="text-orange-300" />, path: "/datakelas" },
        { name: "Master Data", icon: <FaArchive className="text-green-300" />, path: "/masterdata" },
      ],
    },
    {
      section: "Keuangan",
      items: [
        { name: "Kategori Tagihan", icon: <FaChartPie className="text-purple-300" />, path: "/kategoritagihan" },
        { name: "Tagihan", icon: <FaMoneyBillWave className="text-green-300" />, path: "/tagihan" },
        { name: "Rekap Tagihan", icon: <FaClipboardList className="text-yellow-300" />, path: "/rekaptagihan" },
      ],
    },
  ];

  // helpers for classes based on darkMode & active
  const sidebarBgClass = darkMode ? "bg-gray-900" : "bg-blue-800";
  const headerLineClass = "bg-yellow-300";
  const itemActiveClass = (isActive) =>
    isActive ? (darkMode ? "bg-gray-700 text-white" : "bg-blue-600 text-white") : "";
  const itemHoverClass = darkMode ? "hover:bg-gray-800" : "hover:bg-blue-600";

  return (
    <div className="flex">
      <div
        className={`${sidebarBgClass} fixed top-0 left-0 h-full w-64 text-white p-6 flex flex-col justify-between shadow-xl transition-colors duration-300`}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6 mt-2">
          <IconSekolahDigital darkMode={darkMode} />

          <h1 className="text-xl font-bold tracking-wide text-center mt-3">
            Menu Keuangan
          </h1>

          <div className={`w-12 h-[3px] ${headerLineClass} rounded-full mt-2`}></div>
        </div>

        {/* Navigation */}
        <nav className="space-y-4 mt-1 flex-1 overflow-y-auto pr-2">
          {sidebarMenu.map((group, gi) => (
            <div key={gi}>
              <h3 className="text-sm uppercase tracking-wide text-gray-300 font-semibold mb-2">
                {group.section}
              </h3>

              {group.items.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={idx}
                    to={item.path}
                    className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all duration-200
                      ${itemActiveClass(isActive)} ${!isActive ? itemHoverClass : ""}`}
                  >
                    {item.icon}
                    <span className="text-base font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Dark mode toggle */}
        <div className="flex items-center justify-between mt-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/10">
              {darkMode ? <FaMoon className="text-yellow-300" /> : <FaSun className="text-yellow-300" />}
            </div>
            <div>
              <div className="text-sm font-medium">{darkMode ? "Dark Mode" : "Light Mode"}</div>
              <div className="text-xs text-gray-300">{darkMode ? "Gelap" : "Terang"}</div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={darkMode}
              onChange={handleDarkModeToggle}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full flex items-center transition">
              <div
                className={`w-5 h-5 bg-white rounded-full shadow ml-1 transition-transform duration-300 ${darkMode ? "translate-x-5" : "translate-x-0"}`}
              />
            </div>
          </label>
        </div>

        {/* Logout */}
        <div className="mt-4 flex justify-center mb-2">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 bg-red-600 w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:scale-105"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
