import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./DeliveryNote.css";

const DeliveryNote = () => {
  const navigate = useNavigate();
  const { kundenId } = useParams(); 
  
  const [lieferscheinItems, setLieferscheinItems] = useState([]);

  useEffect(() => {
    const dummyBestellung = [
      { id: 1, name: "Äpfel", menge: 5000, einheit: "Gramm", preis: "12.50" },
      { id: 2, name: "Brot", menge: 1, einheit: "Stück", preis: "2.00" },
    ];
    setLieferscheinItems(dummyBestellung);
  }, []);

  const handleLogout = () => {
    navigate("/");
  };
  
  const handlePrint = () => {
    alert("Lieferschein wird gedruckt...");
  };
  
  // Review-Button
  const handleReview = () => {
    alert("Vorschau des Lieferscheins wird angezeigt.");
    // Hier später die Logik für eine echte Vorschau hinzufügen
  };

  const gesamtsumme = lieferscheinItems
    .reduce((sum, item) => sum + parseFloat(item.preis), 0)
    .toFixed(2);

  return (
    <div className="kassier-container">
      <div className="header-bar">
        <h1>📃 Lieferschein</h1>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Abmelden
        </button>
      </div>

      <div className="delivery-info">
        <h3>Kunden-ID: {kundenId}</h3>
      </div>

      <div className="warenkorb">
        <h2>Bestellte Produkte</h2>
        <ul>
          {lieferscheinItems.map((item, index) => (
            <li key={index}>
              {item.name} - {item.menge} {item.einheit} - {item.preis} €
            </li>
          ))}
        </ul>
        <h3>Gesamtsumme: {gesamtsumme} €</h3>
      </div>
      
      <div className="delivery-buttons">
        <button className="print-button" onClick={handlePrint}>
          🖨️ Drucken
        </button>
       
        <button className="review-button" onClick={handleReview}>
          Vorschau
        </button>
        <button className="back-button" onClick={() => navigate("/lager")}>
          🔙 Zurück
        </button>
      </div>
    </div>
  );
};

export default DeliveryNote;