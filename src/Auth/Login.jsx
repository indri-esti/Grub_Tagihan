import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && password) {
      Swal.fire({
        title: "Login Berhasil!",
        text: "Selamat, Login Berhasil.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/dashboard");
      });
    } else {
      Swal.fire("Error", "Mohon isi semua field", "error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        {/* Judul Login */}
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
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Input Email */}
          <div className="input-group">
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Input Password + Icon Mata */}
          <div className="input-group password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              title={showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center" }}>
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
