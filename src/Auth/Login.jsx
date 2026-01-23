import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../config/api";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire("Peringatan", "Email dan password wajib diisi", "warning");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      const user = response.data;

      Swal.fire({
        title: "Login Berhasil!",
        text: `Selamat datang, ${user.nama}`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // simpan token & user
        localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/dashboard");
      });
    } catch (error) {
      Swal.fire(
        "Login Gagal",
        error.response?.data?.message || "Email atau password salah",
        "error"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group password-wrapper">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <div className="password-box">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-login"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="register-text">
          Belum punya akun?{" "}
          <Link className="test1" to="/Register">
            Daftar Dulu !
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
