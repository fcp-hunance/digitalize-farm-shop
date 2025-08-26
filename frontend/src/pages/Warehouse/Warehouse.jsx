import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import "./Warehouse.css";

// Interne Modal-Komponente
const Modal = ({ show, onClose, title, children }) => {
  if (!show) {
    return null;
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="modal-title">{title}</h4>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

const Lager = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { products } = useProducts();

  const [kundenId, setKundenId] = useState("");
  const [showModal, setShowModal] = useState(false);

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
  
  const handleMonatsrechnung = () => {
    if (kundenId.trim() !== "") {
      setShowModal(true);
    } else {
      alert("Bitte geben Sie eine Kunden-ID ein.");
    }
  };
  
  const handlePrint = () => {
      alert("Monatsrechnung wird gedruckt...");
      setShowModal(false);
  };
  
  const handleReview = () => {
      alert("Vorschau wird geschlossen.");
      setShowModal(false);
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
          <button className="search-btn" onClick={handleMonatsrechnung}>
            Monatsrechnung
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
      
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={`Monatsrechnung für Kunden-ID: ${kundenId}`}
      >
        <div className="monatsrechnung-inhalt">
            <h3>Produkte auf Rechnung:</h3>
            <ul>
                {products.map((p) => (
                    <li key={p.id}>
                        {p.name} - {p.bestand} {p.einheit}
                    </li>
                ))}
            </ul>
        </div>
        <div className="modal-buttons">
            <button className="print-button" onClick={handlePrint}>
                🖨️ Drucken
            </button>
            <button className="review-button" onClick={handleReview}>
                Vorschau
            </button>
        </div>
      </Modal>
    </div>
  );
};

export default Lager;