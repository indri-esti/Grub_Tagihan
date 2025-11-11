import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.css";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      Swal.fire("Error", "Mohon isi semua field", "error");
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Error", "Password dan konfirmasi password tidak cocok", "error");
      return;
    }

    // Ambil akun lama dari localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Cek apakah email sudah digunakan
    const isEmailUsed = storedUsers.some((user) => user.email === email);

    if (isEmailUsed) {
      Swal.fire("Error", "Email sudah terdaftar, silakan login.", "error");
      return;
    }

    // Tambah akun baru
    const newUser = { fullName, email, password };
    storedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(storedUsers));

    Swal.fire({
      title: "Akun anda telah dibuat!",
      text: "Silakan login dengan akun baru Anda.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      navigate("/login");
    });

    // Reset form
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2
          style={{
            marginBottom: "30px",
            fontSize: "2.2rem",
            fontWeight: "700",
            color: "#2c3e50",
            textAlign: "center",
            letterSpacing: "1px",
          }}
        >
          Register
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group password-wrapper">
            <label className="input-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {/* KONFIRMASI PASSWORD */}
          <div className="input-group password-wrapper">
            <label className="input-label">Konfirmasi Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmasi Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              title={showConfirmPassword ? "Sembunyikan Password" : "Tampilkan Password"}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button type="submit" className="register-btn">
            Daftar
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Sudah punya akun?{" "}
          <Link className="test" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
