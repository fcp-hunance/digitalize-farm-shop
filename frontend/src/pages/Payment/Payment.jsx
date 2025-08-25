import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";

const Payment = ({ warenkorb, setWarenkorb }) => {
  const navigate = useNavigate();
  const [zahlungsart, setZahlungsart] = useState("bar");
  const [gesamtbetrag, setGesamtbetrag] = useState("0.00");
  const [rabatt, setRabatt] = useState("0.00");
  const [zuZahlenderBetrag, setZuZahlenderBetrag] = useState("0.00");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Berechne den Gesamtbetrag nur einmal beim Laden der Komponente
    const gesamt = warenkorb.reduce(
      (sum, item) => sum + parseFloat(item.preis),
      0
    );
    setGesamtbetrag(gesamt.toFixed(2));
  }, [warenkorb]);

  useEffect(() => {
    // Berechne den zu zahlenden Betrag, wenn sich der Gesamtbetrag oder der Rabatt ändert
    const finalAmount = Math.max(0, parseFloat(gesamtbetrag) - parseFloat(rabatt));
    setZuZahlenderBetrag(finalAmount.toFixed(2));
  }, [gesamtbetrag, rabatt]);

  const handleZurueck = () => navigate("/kassier");

  const handleZahlung = () => {
    setShowModal(true);
  };

  const handleKassenbonDrucken = () => {
    // ✅ HIER IST DIE ÄNDERUNG: Weiterleitung zur Kassier-Seite
    setShowModal(false);
    setWarenkorb([]);
    navigate("/kassier");
  };

  // Inline Modal-Komponente
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

  return (
    <div className="bezahlen-container">
      <h1>💳 Bezahlen</h1>

      {warenkorb.length === 0 ? (
        <p>Der Warenkorb ist leer.</p>
      ) : (
        <div className="warenkorb-liste">
          <h3>Warenkorb:</h3>
          <ul>
            {warenkorb.map((item, index) => (
              <li key={index}>
                {item.name} - {item.menge} {item.einheit} - Rabatt:{" "}
                {item.rabatt} € - {item.preis} €
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Abschnitt für Beträge und Rabatt */}
      <div className="betrag-section">
        <label>Gesamtbetrag (Warenkorb):</label>
        <input type="number" step="0.01" value={gesamtbetrag} disabled />
      </div>

      <div className="betrag-section">
        <label>Rabatt in €:</label>
        <input
          type="number"
          step="0.01"
          value={rabatt}
          onChange={(e) => setRabatt(e.target.value)}
        />
      </div>

      <div className="betrag-section">
        <label>Zu zahlender Betrag:</label>
        <input type="number" step="0.01" value={zuZahlenderBetrag} disabled />
      </div>

      <div className="zahlungsart-section">
        <h3>Zahlungsart auswählen:</h3>
        <button
          className={
            zahlungsart === "bar" ? "payment-button active" : "payment-button"
          }
          onClick={() => setZahlungsart("bar")}
        >
          Barzahlung
        </button>
        <button
          className={
            zahlungsart === "karte"
              ? "payment-button active"
              : "payment-button"
          }
          onClick={() => setZahlungsart("karte")}
        >
          Kartenzahlung
        </button>
      </div>

      <div className="bezahlen-buttons">
        <button onClick={handleZurueck}>🔙 Zurück</button>
        <button onClick={handleZahlung}>✅ Bezahlen</button>
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Zahlung erfolgreich!"
      >
        <p>
          Gesamtbetrag: **{zuZahlenderBetrag} €**
          <br />
          Zahlungsart: **
          {zahlungsart === "bar" ? "Barzahlung" : "Kartenzahlung"}**
        </p>
        <button onClick={handleKassenbonDrucken}>Kassenbon drucken</button>
      </Modal>
    </div>
  );
};

export default Payment;