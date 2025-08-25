import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import "./Lager.css";

const Lager = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { products } = useProducts();

  const [kundenId, setKundenId] = useState("");

  const handleLieferscheinErstellen = () => {
    if (kundenId.trim() !== "") {
      navigate(`/rechnung-erstellen/${kundenId}`);
    } else {
      alert("Bitte geben Sie eine Kunden-ID ein.");
    }
  };

  const handleBestellungEinsehen = () => {
    if (kundenId.trim() !== "") {
      navigate(`/deliveryNote/${kundenId}`);
    } else {
      alert("Bitte geben Sie eine Kunden-ID ein.");
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="lager-container">
      <header className="lager-header">
        <h1>📦 Lagerverwaltung</h1>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Abmelden
        </button>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="Kunden-ID suchen..."
          value={kundenId}
          onChange={(e) => setKundenId(e.target.value)}
          className="search-input"
        />
        <div className="search-buttons">
          <button className="search-btn" onClick={handleLieferscheinErstellen}>
            Lieferschein Erstellen
          </button>
          <button className="search-btn" onClick={handleBestellungEinsehen}>
            Bestellungen einsehen
          </button>
        </div>
      </div>

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
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.bestand}</td>
                <td>{p.einheit}</td>
                <td>
                  <button className="action-btn-eingang"> Eingang</button>
                  <button className="action-btn-ausgang"> Ausgang</button>
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