import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Warehouse.css";
import Modal from "../../components/Modal";

const Lager = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [monat, setMonat] = useState("");
  const [kundenId, setKundenId] = useState("");
  const [showModal, setShowModal] = useState(false);

  // GET: Produkte beim Laden der Seite
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/warehouse");
        if (!response.ok) throw new Error("Fehler beim Laden des Lagerbestands");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Fehler beim Abrufen der Produkte:", err);
        alert("Konnte Produkte nicht laden");
      }
    };
    fetchProducts();
  }, []);

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
  
  const handlePrint = async () => {
    if (!monat) {
      alert("Bitte wählen Sie einen Monat aus (YYYY-MM).");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/invoice/invoice.pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: parseInt(kundenId),
          month: monat
        })
      });

      if (!response.ok) throw new Error("Fehler beim Abrufen der Monatsrechnung");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Rechnung_${kundenId}_${monat}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      setShowModal(false);
    } catch (err) {
      console.error("Fehler beim Laden der Monatsrechnung:", err);
      alert("Fehler beim Laden der Monatsrechnung");
    }
  };
  
  const handleReview = async () => {
    if (!monat) {
      alert("Bitte wählen Sie einen Monat aus (YYYY-MM).");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/invoice/invoice.html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: parseInt(kundenId),
          month: monat
        })
      });

      if (!response.ok) throw new Error("Fehler beim Abrufen der Monatsrechnung");

      const html = await response.text();

      // Vorschau in neuem Tab öffnen
      const previewWindow = window.open("", "_blank");
      previewWindow.document.write(html);
      previewWindow.document.close();
      setShowModal(false);
    } catch (err) {
      console.error("Fehler beim Laden der Monatsrechnung:", err);
      alert("Fehler beim Laden der Monatsrechnung");
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // POST: Eingang/Ausgang
  const handleStockUpdate = async (artikel_id, menge, richtung) => {
    try {
      const response = await fetch("http://localhost:3000/api/warehouse/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artikel_id, menge, richtung })
      });

      if (!response.ok) throw new Error("Fehler beim Aktualisieren des Bestands");

      const updatedProduct = await response.json();

      // Update im Frontend-State
      setProducts((prev) =>
        prev.map((p) =>
          p.id === artikel_id
            ? { ...p, bestand: updatedProduct.intStock } // Angenommen Backend liefert intStock zurück
            : p
        )
      );
    } catch (err) {
      console.error(err);
      alert("Bestand konnte nicht aktualisiert werden");
    }
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
                  <button
                    className="action-btn-eingang"
                    onClick={() => {
                      const menge = parseInt(prompt("Menge für Eingang eingeben:", "1"));
                      if (!isNaN(menge) && menge > 0) handleStockUpdate(p.id, menge, "eingang");
                    }}
                  >
                    Eingang
                  </button>
                  <button
                    className="action-btn-ausgang"
                    onClick={() => {
                      const menge = parseInt(prompt("Menge für Ausgang eingeben:", "1"));
                      if (!isNaN(menge) && menge > 0) handleStockUpdate(p.id, menge, "ausgang");
                    }}
                  >
                    Ausgang
                  </button>
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
        <div className="monatsrechnung-inhalt" style={{ width: "fit-content", margin: "auto" }}>
          <label>
            Monat wählen (YYYY-MM):
            <input
              type="month"
              value={monat}
              onChange={(e) => setMonat(e.target.value)}
              className="month-input"
              style={{ marginLeft: "10px" }} 
            />
          </label> 
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
