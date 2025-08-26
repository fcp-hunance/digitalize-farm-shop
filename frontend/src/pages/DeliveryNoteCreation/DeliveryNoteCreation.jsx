import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Checkout/Checkout.css";
import "./DeliveryNoteCreation.css";

const LieferscheinErstellen = () => {
  const navigate = useNavigate();
  const { kundenId } = useParams();

  const produkte = [
    { id: 1, name: "🍎 Äpfel", preis: 2.5, einheit: "kg" },
    { id: 2, name: "🥔 Kartoffeln", preis: 1.8, einheit: "kg" },
    { id: 3, name: "🥛 Milch", preis: 1.2, einheit: "l" },
    { id: 4, name: "🍞 Brot", preis: 2.0, einheit: "Stück" },
    { id: 5, name: "🥚 Eier", preis: 0.35, einheit: "Stück" },
    { id: 6, name: "🥩 Fleisch", preis: 12.0, einheit: "kg" },
    { id: 7, name: "🍯 Honig", preis: 4.5, einheit: "Stück" },
    { id: 8, name: "🌽 Mais", preis: 1.2, einheit: "Stück" },
    { id: 9, name: "🥗 Salat", preis: 1.5, einheit: "Stück" },
    { id: 10, name: "🥕 Möhren", preis: 2.0, einheit: "kg" },
    { id: 11, name: "🥯 Brötchen", preis: 0.4, einheit: "Stück" },
    { id: 12, name: "🍓 Erdbeeren", preis: 4.5, einheit: "kg" },
  ];

  const [rechnungItems, setRechnungItems] = useState([]);
  const [modalProdukt, setModalProdukt] = useState(null);
  const [menge, setMenge] = useState("");
  const [rabatt, setRabatt] = useState("");
  
  const [rechnungsRabatt, setRechnungsRabatt] = useState(0);

  const berechnePreis = (produkt, menge) => {
    if (produkt.einheit === "kg") {
      return (menge / 1000) * produkt.preis;
    } else {
      return menge * produkt.preis;
    }
  };

  const hinzufuegen = () => {
    let mengeNum = Number(menge);
    let rabattNum = Number(rabatt);
    if (!mengeNum || mengeNum <= 0) return;

    if (!rabattNum || rabattNum < 0) rabattNum = 0;

    let gesamtpreis = berechnePreis(modalProdukt, mengeNum) - rabattNum;
    if (gesamtpreis < 0) gesamtpreis = 0;

    const neuerArtikel = {
      name: modalProdukt.name,
      menge: mengeNum,
      einheit: modalProdukt.einheit === "kg" ? "g" : modalProdukt.einheit,
      rabatt: rabattNum,
      preis: gesamtpreis.toFixed(2),
    };

    setRechnungItems([...rechnungItems, neuerArtikel]);
    setModalProdukt(null);
    setMenge("");
    setRabatt("");
  };

  const zeilenStorno = (index) => {
    const neuerWarenkorb = [...rechnungItems];
    neuerWarenkorb.splice(index, 1);
    setRechnungItems(neuerWarenkorb);
  };

  const komplettStorno = () => {
    setRechnungItems([]);
    setRechnungsRabatt(0);
  };

  const gesamtsummeArtikel = rechnungItems
    .reduce((sum, item) => sum + parseFloat(item.preis), 0);

  const gesamtsummeNachRabatt = Math.max(0, gesamtsummeArtikel - rechnungsRabatt).toFixed(2);

  const handleLogout = () => {
    navigate("/");
  };
 // Print Lieferschein 
const handleLieferscheinDrucken = async () => {
    if (rechnungItems.length === 0) {
      alert("Die Rechnung ist leer. Bitte fügen Sie Produkte hinzu.");
      return;
    }

    try {
      const items = rechnungItems.map(item => {
        const matchingProdukt = produkte.find(p => p.name === item.name);
        return {
          idProduct: matchingProdukt ? matchingProdukt.id : null,
          quantity: item.menge,
        };
      });

      const orderBody = {
        idCustomer: parseInt(kundenId),
        items,
        decTotal: parseFloat(gesamtsummeNachRabatt),
      };

      const orderResponse = await fetch("http://localhost:3000/api/wareHouse/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderBody),
      });

      if (!orderResponse.ok) {
        throw new Error("Fehler beim Erstellen der Bestellung.");
      }
      
      const orderData = await orderResponse.json();
      const idOrder = orderData.idOrder;
      const invoiceResponse = await fetch("http://localhost:3000/api/wareHouse/order/delivery.pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idOrder }),
      });

      if (!invoiceResponse.ok) {
        throw new Error("Fehler beim Generieren des Lieferscheins.");
      }
      
      const pdfBlob = await invoiceResponse.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');

      komplettStorno();
      navigate('/lager');

    } catch (err) {
      console.error(err);
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };

  //Preview Lieferschein
 const handleLieferscheinPreview = async () => {
    if (rechnungItems.length === 0) {
      alert("Der Lieferschein ist leer. Bitte fügen Sie Produkte hinzu.");
      return;
    }

    try {
      const items = rechnungItems.map(item => {
        const matchingProdukt = produkte.find(p => p.name === item.name);
        return {
          idProduct: matchingProdukt ? matchingProdukt.id : null, 
          quantity: item.menge,
        };
      });

      const orderBody = {
        idCustomer: parseInt(kundenId),
        items,
        decTotal: parseFloat(gesamtsummeNachRabatt),
      };

      const orderResponse = await fetch("http://localhost:3000/api/wareHouse/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderBody),
      });

      if (!orderResponse.ok) {
        throw new Error("Fehler beim Erstellen der Bestellung.");
      }
      
      const orderData = await orderResponse.json();
      const idOrder = orderData.idOrder;
      const deliveryNoteResponse = await fetch("http://localhost:3000/api/wareHouse/order/delivery.html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idOrder }),
      });

      if (!deliveryNoteResponse.ok) {
        throw new Error("Fehler beim Generieren des Lieferscheins.");
      }

      const html = await deliveryNoteResponse.text();
      const newWindow = window.open();
      newWindow.document.write(html);
      newWindow.document.close();
      
     

    } catch (err) {
      console.error(err);
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <div className="kassier-container">
      <div className="header-bar">
        <h1>🧾 Lieferschein erstellen</h1>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Abmelden
        </button>
      </div>

      <div className="delivery-info">
        <h3>Kunden-ID: {kundenId}</h3>
      </div>

      <div className="produkt-grid">
        {produkte.map((produkt) => (
          <button
            key={produkt.id}
            className="produkt-button"
            onClick={() => setModalProdukt(produkt)}
          >
            {produkt.name}
          </button>
        ))}
      </div>

      <div className="warenkorb">
        <h2>Lieferungscheinpositionen</h2>
        <ul>
          {rechnungItems.map((item, index) => (
            <li key={index}>
              {item.name} - {item.menge} {item.einheit} - Rabatt: {item.rabatt} € -{" "}
              {item.preis} €
              <button
                className="storno-button"
                onClick={() => zeilenStorno(index)}
              >
                Zeilenstorno
              </button>
            </li>
          ))}
        </ul>

        <div className="summen-section">
          <div className="summe-zeile">
            <span>Gesamtsumme:</span>
            <span>{gesamtsummeArtikel.toFixed(2)} €</span>
          </div>
          <div className="rabatt-zeile">
            <label htmlFor="rechnungs-rabatt">Rabatt in €:</label>
            <input
              id="rechnungs-rabatt"
              type="number"
              step="0.01"
              value={rechnungsRabatt}
              onChange={(e) => setRechnungsRabatt(Number(e.target.value))}
            />
          </div>
          <div className="summe-zeile">
            <span>** Zu zahlender Betrag: </span>
            <span> ** {gesamtsummeNachRabatt} € ** </span>
          </div>
        </div>

        <div className="rechnung-buttons">
          <button className="komplettstorno-button" onClick={komplettStorno}>
            🗑 Storno
          </button>
          <button className="print-button" onClick={handleLieferscheinDrucken}>
            🖨️ Lieferschein drucken
          </button>
          <button className="review-button" onClick={handleLieferscheinPreview}>
            Vorschau
          </button>
          <button className="back-button" onClick={() => navigate("/lager")}>
            🔙 Zurück
          </button>
        </div>
      </div>

      {modalProdukt && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{modalProdukt.name} hinzufügen</h2>
            <input
              type="number"
              placeholder={
                modalProdukt.einheit === "kg"
                  ? "Menge in Gramm"
                  : `Menge in ${modalProdukt.einheit}`
              }
              value={menge}
              onChange={(e) => setMenge(e.target.value)}
            />
            <input
              type="number"
              placeholder="Rabatt in €"
              value={rabatt}
              onChange={(e) => setRabatt(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={hinzufuegen}>✅ Hinzufügen</button>
              <button onClick={() => setModalProdukt(null)}>❌ Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LieferscheinErstellen;