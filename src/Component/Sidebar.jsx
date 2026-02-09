import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
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

  // MODE TERANG / GELAP

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // SIMPAN MODE DI LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const sidebarRef = useRef(null);
const location = useLocation();

// SIMPAN & BALIKIN SCROLL SIDEBAR
useEffect(() => {
  const sidebar = sidebarRef.current;
  if (!sidebar) return;

  const savedScroll = sessionStorage.getItem("sidebar-scroll");
  if (savedScroll) {
    sidebar.scrollTop = Number(savedScroll);
  }

  const saveScroll = () => {
    sessionStorage.setItem("sidebar-scroll", sidebar.scrollTop);
  };

  sidebar.addEventListener("scroll", saveScroll);

  return () => {
    sidebar.removeEventListener("scroll", saveScroll);
  };
}, [location.pathname]);


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
<nav 
ref={sidebarRef}
className="flex-1 pr-2 overflow-y-auto scrollbar-hide space-y-6">

  {/* DASHBOARD */}
  <NavLink
  to="/dashboard"
  className={({ isActive }) =>
    `flex items-center gap-3 py-3 px-4 rounded-lg transition
     ${isActive ? "bg-white/20" : itemHoverClass}`
  }
>
  <FaChartBar className="text-cyan-300" />
  Dashboard
</NavLink>

  {/* DATABASE */}
  <div>
    <p className="px-4 text-xs font-bold tracking-widest text-white/60 mb-2">
      DATABASE
    </p>

    <div className="space-y-2 ml-2">
      <NavLink
  to="/kategoridata"
  className={({ isActive }) =>
    `flex items-center gap-3 py-2 px-4 rounded-lg transition
     ${isActive ? "bg-white/20" : itemHoverClass}`
  }
>
  <FaFolderOpen className="text-yellow-300" />
  Kategori Data
</NavLink>

      <NavLink
  to="/datakelas"
  className={({ isActive }) =>
    `flex items-center gap-3 py-2 px-4 rounded-lg transition
     ${isActive ? "bg-white/20" : itemHoverClass}`
  }
>
  <FaChalkboard className="text-orange-300" />
  Data Kelas
</NavLink>


      <NavLink
  to="/masterdata"
  className={({ isActive }) =>
    `flex items-center gap-3 py-2 px-4 rounded-lg transition
     ${isActive ? "bg-white/20" : itemHoverClass}`
  }
>
  <FaArchive className="text-green-300" />
  Master Data
</NavLink>

    </div>
  </div>

  {/* KEUANGAN */}
  <div>
    <p className="px-4 text-xs font-bold tracking-widest text-white/60 mb-2">
      KEUANGAN
    </p>

    <div className="space-y-2 ml-2">
      <NavLink
  to="/kategoritagihan"
  className={({ isActive }) =>
    `flex items-center gap-3 py-2 px-4 rounded-lg transition
     ${isActive ? "bg-white/20" : itemHoverClass}`
  }
>
  <FaChartPie className="text-purple-300" />
  Kategori Tagihan
</NavLink>

      <NavLink
  to="/tagihan"
  className={({ isActive }) =>
    `flex items-center gap-3 py-2 px-4 rounded-lg transition
     ${isActive ? "bg-white/20" : itemHoverClass}`
  }
>
  <FaMoneyBillWave className="text-green-300" />
  Tagihan
</NavLink>


      <NavLink
  to="/rekaptagihan"
  className={({ isActive }) =>
    `flex items-center gap-3 py-2 px-4 rounded-lg transition
     ${isActive ? "bg-white/20" : itemHoverClass}`
  }
>
  <FaClipboardList className="text-yellow-300" />
  Rekap Tagihan
</NavLink>

    </div>
  </div>

  {/* PRESENSI */}
  <div>
    <p className="px-4 text-xs font-bold tracking-widest text-white/60 mb-2">
      PRESENSI
    </p>

    <div className="space-y-2 ml-2">
      <NavLink
  to="/kategoriizin"
  className={({ isActive }) =>
    `flex items-center gap-3 py-2 px-4 rounded-lg transition
    ${isActive ? "bg-white/20" : itemHoverClass}`
  }
>
  <FaFileSignature className="text-slate-200" />
  Kategori Izin
</NavLink>

      <NavLink
  to="/rekappresensi"
  className={({ isActive }) =>
    `flex items-center gap-3 py-2 px-4 rounded-lg transition
    ${isActive ? "bg-white/20" : itemHoverClass}`
  }
>
  <FaRegCalendarCheck className="text-cyan-400" />
  Rekap Presensi
</NavLink>

    </div>
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
