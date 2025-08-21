import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ Auth-Context importieren
import { useProducts } from "../../context/ProductContext";
import "./WarehouseManagement.css";

const WarehouseManagement = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ Logout-Funktion aus dem Kontext holen
  const { products, addProduct, deleteProduct } = useProducts();

  const [newProduktName, setNewProduktName] = useState("");
  const [newProduktBestand, setNewProduktBestand] = useState("");
  const [newProduktEinheit, setNewProduktEinheit] = useState("kg");

  const handleAddProduct = () => {
    if (newProduktName && newProduktBestand) {
      const newProduct = {
        name: newProduktName,
        bestand: parseInt(newProduktBestand),
        einheit: newProduktEinheit,
      };
      addProduct(newProduct);
      setNewProduktName("");
      setNewProduktBestand("");
      setNewProduktEinheit("kg");
    } else {
      alert("Bitte füllen Sie alle Felder aus.");
    }
  };

  const handleDeleteProduct = (id) => {
    deleteProduct(id);
  };
  
  const handleBackToDashboard = () => {
      navigate("/dashboard");
  };
  
  // ✅ Korrigierte Logout-Funktion
  const handleLogout = () => {
      logout(); // Sitzungsdaten löschen
      navigate("/"); // Zur Login-Seite leiten
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
        <select value={newProduktEinheit} onChange={(e) => setNewProduktEinheit(e.target.value)}>
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
                  <button className="delete-btn" onClick={() => handleDeleteProduct(p.id)}>
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