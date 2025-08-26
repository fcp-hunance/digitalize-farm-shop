import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import "./WarehouseManagement.css";

const WarehouseManagement = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Logout-Funktion aus dem Kontext holen

  const [products, setProducts] = useState([]);
  const [newProduktName, setNewProduktName] = useState("");
  const [newProduktBestand, setNewProduktBestand] = useState("");
  const [newProduktEinheit, setNewProduktEinheit] = useState("kg");

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Hilfsfunktion: Einheit → fkUnit
  const mapEinheitToFkUnit = (einheit) => {
    switch (einheit) {
      case "kg": return 1;
      case "Stück": return 2;
      case "l": return 3;
      default: return 0;
    }
  };

  // GET: Lagerbestand beim Laden der Seite
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

  // POST: Produkt hinzufügen
  const handleAddProduct = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/warehouse/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduktName,
          preis: 0,
          initialerBestand: parseInt(newProduktBestand, 10) || 0,
          fkUnit: mapEinheitToFkUnit(newProduktEinheit),
        }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Hinzufügen");
      }

      const added = await response.json();

      setProducts((prev) => [
        ...prev,
        {
          id: added.id,
          name: added.name,
          bestand: added.intStock,
          einheit: newProduktEinheit,
        },
      ]);

      // Felder zurücksetzen
      setNewProduktName("");
      setNewProduktBestand("");
      setNewProduktEinheit("kg");
    } catch (err) {
      console.error(err);
      alert("Produkt konnte nicht hinzugefügt werden");
    }
  };

  // DELETE: Produkt löschen
  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/warehouse/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Fehler beim Löschen");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Produkt konnte nicht gelöscht werden");
    }
  };

  return (
    <div className="lager-container">
      <header className="lager-header">
        <h1>📦 Lagerverwaltung</h1>
        <div className="header-buttons">
          <button className="back-btn" onClick={handleBackToDashboard}>
            🔙 Zurück
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Abmelden
          </button>
        </div>
      </header>

      <div className="add-product-section">
        <h2>Produkt hinzufügen</h2>
        <input
          type="text"
          placeholder="Produktname"
          value={newProduktName}
          onChange={(e) => setNewProduktName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Bestand"
          value={newProduktBestand}
          onChange={(e) => setNewProduktBestand(e.target.value)}
        />
        <select
          value={newProduktEinheit}
          onChange={(e) => setNewProduktEinheit(e.target.value)}
        >
          <option value="kg">kg</option>
          <option value="l">l</option>
          <option value="Stück">Stück</option>
        </select>
        <button className="add-btn" onClick={handleAddProduct}>
          Hinzufügen
        </button>
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
                    className="delete-btn"
                    onClick={() => handleDeleteProduct(p.id)}
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarehouseManagement;
