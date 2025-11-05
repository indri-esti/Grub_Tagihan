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

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const matchedUser = storedUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (matchedUser) {
      Swal.fire({
        title: "Login Berhasil!",
        text: `Selamat datang, ${matchedUser.fullName}!`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
        navigate("/dashboard");
      });
    } else {
      Swal.fire("Error", "Email atau password salah!", "error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Input Email */}
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

          {/* Input Password */}
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
