import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Lager.css";

const Lager = () => {
  const navigate = useNavigate();

  // Dummy-Daten (später aus Backend/API laden)
  const [produkte, setProdukte] = useState([
    { id: 1, name: "Äpfel", bestand: 120, einheit: "kg" },
    { id: 2, name: "Kartoffeln", bestand: 200, einheit: "kg" },
    { id: 3, name: "Milch", bestand: 50, einheit: "l" },
    { id: 4, name: "Brot", bestand: 80, einheit: "Stück" },
  ]);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="lager-container">
      {/* Header */}
      <header className="lager-header">
        <h1>📦 Lagerverwaltung</h1>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </header>

      {/* Tabelle */}
      <div className="lager-content">
        <h2>Warenbestände</h2>
        <table className="lager-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Produkt</th>
              <th>Bestand</th>
              <th>Einheit</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {produkte.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.bestand}</td>
                <td>{p.einheit}</td>
                <td>
                  <button className="action-btn"> Eingang</button>
                  <button className="action-btn"> Ausgang</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lager;

