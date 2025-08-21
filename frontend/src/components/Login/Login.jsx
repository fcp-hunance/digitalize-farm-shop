import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css"; // ✅ Korrigierter CSS-Import

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, employees } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    if (login(username, password)) {
      const loggedInUser = employees.find(emp => emp.name === username);
      if (loggedInUser.role === "Admin") {
        navigate("/dashboard");
      } else if (loggedInUser.role === "Kassier") {
        navigate("/kassier");
      } else if (loggedInUser.role === "Lagerist") {
        navigate("/lager");
      } else {
        alert("❌ Unbekannte Rolle");
      }
    } else {
      alert("❌ Falsche Login-Daten");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Einloggen</button>
      </form>
    </div>
  );
};

export default Login;