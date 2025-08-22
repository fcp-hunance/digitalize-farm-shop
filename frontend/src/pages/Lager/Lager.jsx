import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Lager.css";

const Lager = () => {
  const navigate = useNavigate();
  const [kundenId, setKundenId] = useState("");

  const [produkte, setProdukte] = useState([
    { id: 1, name: "Äpfel", bestand: 120, einheit: "kg" },
    { id: 2, name: "Kartoffeln", bestand: 200, einheit: "kg" },
    { id: 3, name: "Milch", bestand: 50, einheit: "l" },
    { id: 4, name: "Brot", bestand: 80, einheit: "Stück" },
  ]);

  const handleLogout = () => {
    navigate("/");
  };
  
  // ✅ HIER IST DIE GEÄNDERTE LOGIK: "Rechnung" leitet auf eine Erstellungsseite weiter
  const handleRechnung = () => {
    if (kundenId.trim() !== "") {
      navigate(`/rechnung-erstellen/${kundenId}`);
    } else {
      alert("Bitte geben Sie eine Kunden-ID ein.");
    }
  };

  // ✅ HIER IST DIE GEÄNDERTE LOGIK: "Bestellung" leitet auf eine andere, separate Seite
  const handleBestellung = () => {
    if (kundenId.trim() !== "") {
      // Dummy-Weiterleitung zu einer Bestellübersicht
      navigate(`/deliveryNote/${kundenId}`);
    } else {
      alert("Bitte geben Sie eine Kunden-ID ein.");
    }
  };

  return (
    <div className="lager-container">
      <header className="lager-header">
        <h1>📦 Lagerverwaltung</h1>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
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
          <button className="search-btn" onClick={handleRechnung}>
            Lieferschein Erstellen
          </button>
          <button className="search-btn" onClick={handleBestellung}>
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
            {produkte.map((p) => (
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