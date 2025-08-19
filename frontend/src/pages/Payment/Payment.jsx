import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css"; // Optional, falls du eigene Styles willst

const Payment = ({ warenkorb, setWarenkorb }) => {
  const navigate = useNavigate();
  const [zahlungsart, setZahlungsart] = useState("bar");
  const [betrag, setBetrag] = useState("0.00");

  // Gesamtbetrag berechnen, wenn sich der Warenkorb ändert
  useEffect(() => {
    const gesamt = warenkorb
      .reduce((sum, item) => sum + parseFloat(item.preis), 0)
      .toFixed(2);
    setBetrag(gesamt);
  }, [warenkorb]);

  const handleZurueck = () => navigate("/");

  const handleZahlung = () => {
    alert(`Zahlung abgeschlossen!\nBetrag: ${betrag} €\nZahlungsart: ${zahlungsart}`);
    setWarenkorb([]); // Warenkorb leeren
    navigate("/");
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
                {item.name} - {item.menge} {item.einheit} - Rabatt: {item.rabatt} € - {item.preis} €
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="betrag-section">
        <label>Gesamtbetrag anpassen:</label>
        <input
          type="number"
          step="0.01"
          value={betrag}
          onChange={(e) => setBetrag(e.target.value)}
        />
      </div>

      <div className="zahlungsart-section">
        <h3>Zahlungsart auswählen:</h3>
        <label>
          <input
            type="radio"
            value="bar"
            checked={zahlungsart === "bar"}
            onChange={(e) => setZahlungsart(e.target.value)}
          />
          Barzahlung
        </label>
        <label>
          <input
            type="radio"
            value="karte"
            checked={zahlungsart === "karte"}
            onChange={(e) => setZahlungsart(e.target.value)}
          />
          Kartenzahlung
        </label>
      </div>

      <div className="bezahlen-buttons">
        <button onClick={handleZurueck}>🔙 Zurück</button>
        <button onClick={handleZahlung}>✅ Bezahlen</button>
      </div>
    </div>
  );
};

export default Payment;
