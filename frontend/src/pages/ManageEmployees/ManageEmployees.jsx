import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageEmployees.css";

export default function ManageEmployees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeePin, setNewEmployeePin] = useState("");
  const [newEmployeePassword, setNewEmployeePassword] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState("Cashier");

  // Mitarbeiter laden
  useEffect(() => {
    fetchEmployees();
  }, []);

const fetchEmployees = () => {
  fetch("http://localhost:3000/api/admin/users")
    .then(res => res.json())
    .then(data => {
      console.log("API Antwort:", data);
      setEmployees(data);
    })
    .catch(err => console.error("Fehler beim Laden:", err));
};


  // Mitarbeiter hinzufügen
  const handleAddEmployee = () => {
    const newEmp = {
      username: newEmployeeName,
      password: newEmployeePassword,
      pin: newEmployeePin,
      role: newEmployeeRole
    };

    fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmp)
    })
      .then(res => {
        if (!res.ok) throw new Error("Fehler beim Anlegen");
        return res.json();
      })
      .then(() => {
        setNewEmployeeName("");
        setNewEmployeePin("");
        setNewEmployeePassword("");
        setNewEmployeeRole("Cashier");
        fetchEmployees();
      })
      .catch(err => console.error(err));
  };

  // PIN zurücksetzen
  const resetEmployeePin = async (employee, newPinValue) => {
    const response = await fetch("http://localhost:3000/api/admin/reset-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: employee.strUsername,
        newPin: newPinValue
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `PIN-Reset fehlgeschlagen mit Status: ${response.status}`);
    }

    return response.json();
  };

  // Passwort zurücksetzen
  const resetEmployeePassword = async (employee, newPasswordValue) => {
    const response = await fetch("http://localhost:3000/api/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: employee.strUsername,
        newPassword: newPasswordValue
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Password-Reset fehlgeschlagen mit Status: ${response.status}`);
    }

    return response.json();
  };

  // Reset-Handler
  const handleReset = async (id, type) => {
    const employee = employees.find(emp => emp.idUser === id);
    if (!employee) return;

    let newValue = "";
    let actionName = "";

    if (type === "pin") {
      newValue = prompt(`Bitte neuen PIN für ${employee.strUsername} eingeben:`);
      actionName = "PIN";
    } else if (type === "password") {
      newValue = prompt(`Bitte neues Passwort für ${employee.strUsername} eingeben:`);
      actionName = "Passwort";
    }

    if (newValue !== null && newValue.trim() !== "") {
      try {
        if (type === "pin") {
          await resetEmployeePin(employee, newValue.trim());
        } else if (type === "password") {
          await resetEmployeePassword(employee, newValue.trim());
        }
        alert(`${actionName} für ${employee.strUsername} wurde geändert.`);
      } catch (error) {
        alert(`Fehler beim Ändern des ${actionName}s: ${error.message}`);
      }
    }
  };

  // Mitarbeiter löschen
  const handleDeleteEmployee = (username) => {
    fetch("http://localhost:3000/api/admin/delete-user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    })
      .then(res => {
        if (!res.ok) throw new Error("Fehler beim Löschen");
        return res.json();
      })
      .then(() => {
        fetchEmployees();
      })
      .catch(err => console.error(err));
  };

  // Navigation
  const handleLogout = () => {
    navigate("/");
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="manage-employees-container">
      <header className="manage-employees-header">
        <h1>👤 Mitarbeiter verwalten</h1>
        <div className="header-buttons">
          <button className="back-btn" onClick={handleBackToDashboard}>
            🔙 Zurück
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </header>

      <div className="add-employee-section">
        <h2>Mitarbeiter hinzufügen</h2>
        <input
          type="text"
          placeholder="Name des Mitarbeiters"
          value={newEmployeeName}
          onChange={(e) => setNewEmployeeName(e.target.value)}
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="PIN (4-stellig)"
          value={newEmployeePin}
          onChange={(e) => setNewEmployeePin(e.target.value)}
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="Passwort"
          value={newEmployeePassword}
          onChange={(e) => setNewEmployeePassword(e.target.value)}
          autoComplete="new-password"
        />
        <select
          value={newEmployeeRole}
          onChange={(e) => setNewEmployeeRole(e.target.value)}
        >
          <option value="Admin">Admin</option>
          <option value="Cashier">Kassier</option>
          <option value="Warehouse">Lagerist</option>
        </select>
        <button className="add-btn" onClick={handleAddEmployee}>
          Hinzufügen
        </button>
      </div>

      <div className="employee-list-section">
        <h2>Aktuelle Mitarbeiter</h2>
        <ul className="employee-list">
          {employees.map(emp => (
            <li key={emp.idUser} className="employee-item">
              <span>{emp.strUsername} ({emp.strRole})</span>
              <div className="action-buttons">
                <button 
                  className="reset-pin-btn" 
                  onClick={() => handleReset(emp.idUser, "pin")}
                >
                  PIN zurücksetzen
                </button>
                <button 
                  className="reset-password-btn" 
                  onClick={() => handleReset(emp.idUser, "password")}
                >
                  Passwort zurücksetzen
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDeleteEmployee(emp.strUsername)}
                >
                  Löschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
