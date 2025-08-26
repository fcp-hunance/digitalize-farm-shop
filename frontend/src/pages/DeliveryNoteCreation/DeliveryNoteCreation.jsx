import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Checkout/Checkout.css";
import "./DeliveryNoteCreation.css";

const LieferscheinErstellen = () => {
  const navigate = useNavigate();
  const { kundenId } = useParams();

  const [produkte, setProdukte] = useState([]);
  const emojiMap = {
    "Äpfel": "🍎",
    "Kartoffeln": "🥔",
    "Milch": "🥛",
    "Brot": "🍞",
    "Eier": "🥚",
    "Fleisch": "🥩",
    "Honig": "🍯",
    "Mais": "🌽",
    "Salat": "🥗",
    "Möhren": "🥕",
    "Brötchen": "🥯",
    "Erdbeeren": "🍓",
  };

  const [rechnungItems, setRechnungItems] = useState([]);
  const [modalProdukt, setModalProdukt] = useState(null);
  const [menge, setMenge] = useState("");
  const [rabatt, setRabatt] = useState("");
  const [rechnungsRabatt, setRechnungsRabatt] = useState(0);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderData, setOrderData] = useState(null); 

  useEffect(() =>  {
    const fetchProdukte = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/cashDesk/products");
        console.error(response);
        if (!response.ok) {
          throw new Error("Fehler beim Laden der Produkte");
        }
        const data = await response.json();

        // Map API data to UI format
        const mappedProdukte = data.map((item) => {
          const emoji = emojiMap[item.strProductName] || ""; // fallback: no emoji
          return {
          id: item.idProduct,
          name: `${emoji} ${item.strProductName}`,
          preis: parseFloat(item.decPrice),
          einheit: mapUnit(item.fkUnit),
          };
        });

        setProdukte(mappedProdukte);
      } catch (err) {
        console.error("Fehler beim Laden der Produkte:", err);
      }
    };

    fetchProdukte();
  }, []);
  
  const mapUnit = (fkUnit) => {
    switch (fkUnit) {
      case 1:
        return "kg";
      case 2:
        return "Stück";
      case 3:
        return "l";
      default:
        return "Stück";
    }
  };

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

    const mengeInEinheit = modalProdukt.einheit === "kg" ? mengeNum / 1000 : mengeNum; // convert g -> kg

    const neuerArtikel = {
      id: modalProdukt.id,
      name: modalProdukt.name,
      menge: mengeInEinheit,
      einheit: modalProdukt.einheit,
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

  const handleBestatigen = async () => {
    if (rechnungItems.length === 0) {
      alert("⚠️ Es können keine Bestellungen ohne Produkte eingereicht werden!");
      return;
    }
    try {
      const body = {
        idCustomer: Number(kundenId), // nutze KundenId aus useParams
        items: rechnungItems.map((item) => ({
          idProduct: item.id,
          quantity: item.menge,
        })),
        decTotal: parseFloat(gesamtsummeNachRabatt),
      };

      const response = await fetch("http://localhost:3000/api/wareHouse/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Absenden der Bestellung");
      }

      const data = await response.json();
      alert("Bestellung eingereicht ✅");

      setOrderData(data); // speichert idOrder, idDeliveryNote
      setOrderSubmitted(true); // versteckt Bestätigen und zeigt die anderen Buttons
    } catch (err) {
      alert("❌ Fehler beim Absenden: " + err.message);
    }
  };
  

  const handleLieferscheinDrucken = () => {
    if (!orderData) return;
    alert(`Lieferschein Nr. ${orderData.idDeliveryNote} wird gedruckt.`);
    komplettStorno();
    navigate('/lager');
  };
  
  const handleLieferscheinPreview = () => {
    if (!orderData) return;
    alert(`Vorschau für Lieferschein Nr. ${orderData.idDeliveryNote}`);
    komplettStorno();
    navigate('/lager');
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

        <div className="lieferschein-buttons">
          <button className="komplettstorno-button" onClick={komplettStorno}>
            🗑 Storno
          </button>
          {orderSubmitted ? (
            <>
              <button className="print-button" onClick={handleLieferscheinDrucken}>
                🖨️ Rechnung drucken
              </button>
              <button className="review-button" onClick={handleLieferscheinPreview}>
                Vorschau
              </button>
            </>
          ) : (
            <button
              className="bestatigen-button"
              onClick={handleBestatigen}
              disabled={rechnungItems.length === 0}
            >
              ✅ Bestätigen
            </button>
          )}
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