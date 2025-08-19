import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Kassier.css";

const Kassier = ({ warenkorb, setWarenkorb }) => {
  const navigate = useNavigate();

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

 
  const [modalProdukt, setModalProdukt] = useState(null);
  const [menge, setMenge] = useState("");
  const [rabatt, setRabatt] = useState("");

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

  const gesamtsumme = warenkorb
    .reduce((sum, item) => sum + parseFloat(item.preis), 0)
    .toFixed(2);

  return (
    <div className="kassier-container">
      <h1>🛒 Biohofladen Schlarb</h1>

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

        <button className="komplettstorno-button" onClick={komplettStorno}>
          🗑 Storno
        </button>
        <button
          className="zahlen-button"
          onClick={() => navigate("/payment")}
        >
          💳 Bezahlen
        </button>
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

export default Kassier;
