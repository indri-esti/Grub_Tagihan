// ✅ SidebarT.jsx (biarkan tetap seperti ini)
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SidebarT() {
  const navigate = useNavigate();

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

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-60 bg-gray-800 text-white p-4 flex flex-col justify-between shadow-lg">
        <div>
          <div className="text-2xl font-bold mb-8 text-center">
            Menu Keuangan
          </div>

          <nav className="space-y-3">
            <Link
              to="/dashboard"
              className="block py-2 px-3 rounded hover:bg-blue-600 transition-colors"
            >
              Dashboard
            </Link>

            <Link
              to="/tagihan"
              className="block py-2 px-3 rounded hover:bg-blue-600 transition-colors"
            >
              Tagihan
            </Link>

            <Link
              to="/jenistagihan"
              className="block py-2 px-3 rounded hover:bg-blue-600 transition-colors"
            >
              Jenis Tagihan
            </Link>
          </nav>
        </div>

        <div
          onClick={handleLogout}
          className="block py-2 px-3 rounded hover:bg-red-600 cursor-pointer text-center"
        >
          Logout
        </div>
      </div>
    </div>
  );
}
