import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Kassier = ({warenkorb, setWarenkorb}) => {
  const navigate = useNavigate();
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
  const [modalProdukt, setModalProdukt] = useState(null);
  const [menge, setMenge] = useState("");
  const [rabatt, setRabatt] = useState("");

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

  // Store quantity in the original unit (kg or Stück)
    const mengeInEinheit = modalProdukt.einheit === "kg" ? mengeNum / 1000 : mengeNum; // convert g -> kg

    const neuerArtikel = {
      id: modalProdukt.id,
      name: modalProdukt.name,
      menge: mengeInEinheit,
      einheit: modalProdukt.einheit,
      rabatt: rabattNum,
      preis: gesamtpreis.toFixed(2),
    };

    setWarenkorb([...warenkorb, neuerArtikel]);
    setModalProdukt(null);
    setMenge("");
    setRabatt("");
  };

  const zeilenStorno = (index) => {
    const neuerWarenkorb = [...warenkorb];
    neuerWarenkorb.splice(index, 1);
    setWarenkorb(neuerWarenkorb);
  };

  const komplettStorno = () => {
    setWarenkorb([]);
  };

  const gesamtsumme = warenkorb.length === 0 ? 0 
  : warenkorb.reduce((sum, item) => sum + parseFloat(item.preis), 0).toFixed(2);


  const handleLogout = () => {
    setWarenkorb([]);
    navigate("/");
  };

  return (
    <div className="kassier-container">
      <div className="header-bar">
        <h1>🛒 Biohofladen Hahn</h1>
        <button className="logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>
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
        <h2>Verkauf</h2>
        <ul>
          {warenkorb.map((item, index) => (
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

        <h3>Gesamtsumme: {gesamtsumme} €</h3>
        <div className="kasse-btns">
          <button className="komplettstorno-button" onClick={komplettStorno}>
            🗑 Storno
          </button>
          <button
            className="zahlen-button"
            onClick={() => navigate("/payment")}
            disabled={warenkorb.length === 0}
          >
            💳 Bezahlen
          </button>  
        </div>
      </div>

      {/* Modal */}
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
              type="text"
              placeholder="Rabatt in €"
              value={rabatt}
              onChange={(e) => {
                const val = e.target.value.replace(",", ".");
                setRabatt(val);
              }}
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

export default Kassier;