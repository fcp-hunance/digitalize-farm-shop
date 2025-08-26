import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css"; // ✅ Korrigierter CSS-Import

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, roleContext } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = await login(username, password);
    if (!data) {
      alert("❌ Login fehlgeschlagen");
      return;
    }

    // redirect based on role from response
    switch (data.role) {
      case "admin":
        navigate("/dashboard");
        break;
      case "cashier":
        navigate("/kassier");
        break;
      case "warehouse":
        navigate("/lager");
        break;
      default:
        alert("❌ Unbekannte Rolle");
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