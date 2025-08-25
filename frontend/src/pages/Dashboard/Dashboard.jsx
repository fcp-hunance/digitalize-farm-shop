import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import "./Dashboard.css";

const Dashboard = () => {
  const [filter, setFilter] = useState("Woche");
  const navigate = useNavigate();
  // Den Hook direkt aufrufen, um die Werte zu erhalten
  const { user, roleContext, logout } = useAuth();

  // Dummy-Daten (später Backend)
  const data = [
    { name: "Mo", eigene: 40, kommission: 24, zukauf: 30 },
    { name: "Di", eigene: 30, kommission: 13, zukauf: 22 },
    { name: "Mi", eigene: 20, kommission: 98, zukauf: 40 },
    { name: "Do", eigene: 27, kommission: 39, zukauf: 50 },
    { name: "Fr", eigene: 18, kommission: 48, zukauf: 60 },
    { name: "Sa", eigene: 23, kommission: 38, zukauf: 70 },
    { name: "So", eigene: 34, kommission: 43, zukauf: 90 },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const handleNavigation = (event) => {
    const value = event.target.value;
    if (value === "Mitarbeiter") {
      navigate("/mitarbeiter");
    } else if (value === "Lagerverwaltung") {
      navigate("/warehouse-management");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>📊 Statistik</h1>
        <div className="header-right">
          <div className="user-info">👤 Benutzer: {user}</div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Filter und  Dropdown-Menü */}
      <div className="filter-and-nav-section">
        <div className="filter-section">
          <label>Zeitraum: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>Tag</option>
            <option>Woche</option>
            <option>Monat</option>
            <option>Jahr</option>
          </select>
        </div>



        {/* Neues Dropdown-Menü, nur für Admin sichtbar */}
        {roleContext === 'admin' && (
            <div className="navigation-section">
                <select onChange={handleNavigation} defaultValue="">
                    <option value="" disabled hidden>Verwalten</option>
                    <option value="Mitarbeiter">Mitarbeiter verwalten</option>
                    <option value="Lagerverwaltung">Lagerverwaltung</option>
                </select>
            </div>
        )}
      </div>

      {/* Statistik-Karten */}
      <div className="stats-grid">
        <div className="stat-card eigene-produkte">
          <h2>Eigene Produkte</h2>
          <p>123 Stück verkauft</p>
        </div>
        <div className="stat-card kommissionsware">
          <h2>Kommissionsware</h2>
          <p>75 Stück verkauft</p>
        </div>
        <div className="stat-card zukaufsprodukte">
          <h2>Zukaufsprodukte</h2>
          <p>210 Stück verkauft</p>
        </div>
      </div>

      {/* Diagramm */}
      <div className="chart-container">
        <h2>Verkäufe nach Wochentag</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="eigene" fill="#2e7d32" name="Eigene Produkte" />
            <Bar dataKey="kommission" fill="#0277bd" name="Kommissionsware" />
            <Bar dataKey="zukauf" fill="#f57c00" name="Zukaufsprodukte" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;