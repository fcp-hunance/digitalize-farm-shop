import React from "react";
import { useNavigate } from "react-router-dom";
import "./Kassier.css";

const Kassier = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="kassier-container">
      <header className="kassier-header">
        <h1>💰 Kassier-Bereich</h1>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </header>

      <div className="kassier-content">
        <p>Hier kann Kassier 1 Bestellungen verwalten oder Kassenabschlüsse machen.</p>
        {/* später Tabellen / POS-Logik einfügen */}
      </div>
    </div>
  );
};

export default Kassier;
