import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  FaSignOutAlt,
  FaChartBar,
  FaFolderOpen,
  FaChalkboard,
  FaMoneyBillWave,
  FaCoins,
  FaChartPie,
  FaArchive,
  FaServer,
  FaClipboardList,
  FaFileSignature,
  FaUserCheck,
  FaMoon,
  FaSun,
  FaSchool,
  FaClipboardCheck,
  FaRegCalendarCheck,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

// ICON HEADER
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
  const Location = useLocation();

  // CEK HALAMAN AKTIF
  const isActive = (path) => Location.pathname === path;

  // DARK MODE
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // DROPDOWN
  const [openDatabase, setOpenDatabase] = useState(() => {
    return localStorage.getItem("openDatabase") === "true";
  });

  const [openKeuangan, setOpenKeuangan] = useState(() => {
    return localStorage.getItem("openKeuangan") === "true";
  });

  const [openPresensi, setOpenPresensi] = useState(() => {
    return localStorage.getItem("openPresensi") === "true";
  });

  // SAVE MODE
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // SAVE DROPDOWN
  useEffect(() => {
    localStorage.setItem("openDatabase", openDatabase);
  }, [openDatabase]);

  useEffect(() => {
    localStorage.setItem("openKeuangan", openKeuangan);
  }, [openKeuangan]);

  useEffect(() => {
    localStorage.setItem("openPresensi", openPresensi);
  }, [openPresensi]);

  // LOGOUT
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

  // STYLE
  const sidebarBgClass = darkMode ? "bg-gray-900" : "bg-blue-800";
  const itemHoverClass = darkMode ? "hover:bg-gray-800" : "hover:bg-blue-600";

  return (
    <div className="flex">
      <div
        className={`
          ${sidebarBgClass}
          fixed top-0 left-0 h-full w-64 text-white
          p-6 flex flex-col justify-between shadow-xl
          transition-colors duration-300
          overflow-y-hidden
        `}
      >
        {/* HEADER */}
        <div className="flex flex-col items-center py-6 border-b border-white/10">
        <IconSekolahDigital darkMode={darkMode} />
        <h1 className="mt-3 font-bold tracking-wide">School Web</h1>
      </div>

        {/* MENU */}
        <nav className="space-y-4 flex-1 pr-2">
          {/* DASHBOARD */}
          <div>
            <Link
              to="/dashboard"
              className={`flex items-center justify-between w-full py-2.5 px-4 rounded-lg ${itemHoverClass}`}
            >
              <span className="flex items-center gap-3">
                <FaChartBar className="text-cyan-300" /> Dashboard
              </span>
            </Link>

            {isActive("/dashboard") && (
              <div className="w-24 h-[3px] bg-white rounded-full ml-10"></div>
            )}
          </div>

          {/* DATABASE */}
          <div>
            <button
              onClick={() => setOpenDatabase(!openDatabase)}
              className={`flex items-center justify-between w-full py-2.5 px-4 rounded-lg ${itemHoverClass}`}
            >
              <span className="flex items-center gap-3">
                <FaServer className="text-[#FFA726]" /> Database
              </span>
              <FaChevronDown
  className={`transition-transform duration-300 ${
    openDatabase ? "rotate-180" : ""
  }`}
/>
            </button>

            {(isActive("/kategoridata") ||
              isActive("/datakelas") ||
              isActive("/masterdata")) && (
              <div className="w-24 h-[3px] bg-white rounded-full ml-10"></div>
            )}

            {openDatabase && (
              <div className="ml-6 mt-2 space-y-2">
                <Link
                  to="/kategoridata"
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm ${itemHoverClass}`}
                >
                  <FaFolderOpen className="text-yellow-300" /> Kategori Data
                </Link>

                <Link
                  to="/datakelas"
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm ${itemHoverClass}`}
                >
                  <FaChalkboard className="text-orange-300" /> Data Kelas
                </Link>

                <Link
                  to="/masterdata"
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm ${itemHoverClass}`}
                >
                  <FaArchive className="text-green-300" /> Master Data
                </Link>
              </div>
            )}
          </div>

          {/* KEUANGAN */}
          <div>
            <button
              onClick={() => setOpenKeuangan(!openKeuangan)}
              className={`flex items-center justify-between w-full py-2.5 px-4 rounded-lg ${itemHoverClass}`}
            >
              <span className="flex items-center gap-3">
                <FaCoins className="text-yellow-300" /> Keuangan
              </span>
              <FaChevronDown
  className={`transition-transform duration-300 ${
    openKeuangan ? "rotate-180" : ""
  }`}
/>
            </button>

            {(isActive("/kategoritagihan") ||
              isActive("/tagihan") ||
              isActive("/rekaptagihan")) && (
              <div className="w-24 h-[3px] bg-white rounded-full ml-10"></div>
            )}

            {openKeuangan && (
              <div className="ml-6 mt-2 space-y-2">
                <Link
                  to="/kategoritagihan"
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm ${itemHoverClass}`}
                >
                  <FaChartPie className="text-purple-300" /> Kategori Tagihan
                </Link>

                <Link
                  to="/tagihan"
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm ${itemHoverClass}`}
                >
                  <FaMoneyBillWave className="text-green-300" /> Tagihan
                </Link>

                <Link
                  to="/rekaptagihan"
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm ${itemHoverClass}`}
                >
                  <FaClipboardList className="text-yellow-300" /> Rekap Tagihan
                </Link>
              </div>
            )}
          </div>

          {/* PRESENSI */}
          <div>
            <button
              onClick={() => setOpenPresensi(!openPresensi)}
              className={`flex items-center justify-between w-full py-2.5 px-4 rounded-lg ${itemHoverClass}`}
            >
              <span className="flex items-center gap-3">
                <FaClipboardCheck className="text-purple-200" /> Presensi
              </span>
              <FaChevronDown
  className={`transition-transform duration-300 ${
    openPresensi ? "rotate-180" : ""
  }`}
/>
            </button>

            {(isActive("/kategoriizin") ||
              isActive("/presensisemua") ||
              isActive("/rekappresensi")) && (
              <div className="w-24 h-[3px] bg-white rounded-full ml-10"></div>
            )}

            {openPresensi && (
              <div className="ml-6 mt-2 space-y-2">
                <Link
                  to="/kategoriizin"
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm ${itemHoverClass}`}
                >
                  <FaFileSignature className="text-slate-200" /> Kategori Izin
                </Link>

                <Link
                  to="/rekappresensi"
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm ${itemHoverClass}`}
                >
                  <FaRegCalendarCheck className="text-cyan-400" /> Rekap
                  Presensi
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* TOGGLE MODE */}
        <div className="flex items-center justify-between mt-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/10">
              {darkMode ? (
                <FaMoon className="text-yellow-300" />
              ) : (
                <FaSun className="text-yellow-300" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium">
                {darkMode ? "Dark Mode" : "Bright Mode"}
              </div>
              <div className="text-xs text-gray-300">
                {darkMode ? "Gelap" : "Terang"}
              </div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full flex items-center transition">
              <div
                className={`w-5 h-5 bg-white rounded-full shadow ml-1 transition-transform duration-300 ${
                  darkMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </label>
        </div>

        {/* LOGOUT */}
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
