import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./ManageEmployees.css";

const ManageEmployees = () => {
  const navigate = useNavigate();
  const { employees, addEmployee, deleteEmployee, resetPin, resetPassword, logout } = useAuth();

  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeePin, setNewEmployeePin] = useState("");
  const [newEmployeePassword, setNewEmployeePassword] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState("Kassier");

  const handleAddEmployee = () => {
    if (newEmployeeName && newEmployeePin && newEmployeePassword) {
      const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
      const newEmployee = {
        id: newId,
        name: newEmployeeName,
        pin: newEmployeePin,
        password: newEmployeePassword,
        role: newEmployeeRole,
      };
      addEmployee(newEmployee);
      setNewEmployeeName("");
      setNewEmployeePin("");
      setNewEmployeePassword("");
    } else {
      alert("Bitte füllen Sie alle Felder aus.");
    }
  };

  const handleReset = (id, type) => {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;

    let newValue = "";
    if (type === 'pin') {
      newValue = prompt(`Bitte neuen PIN für ${employee.name} eingeben:`);
      if (newValue !== null && newValue.trim() !== "") {
        resetPin(id, newValue);
        alert(`PIN für ${employee.name} wurde geändert.`);
      }
    } else if (type === 'password') {
      newValue = prompt(`Bitte neues Passwort für ${employee.name} eingeben:`);
      if (newValue !== null && newValue.trim() !== "") {
        resetPassword(id, newValue);
        alert(`Passwort für ${employee.name} wurde geändert.`);
      }
    }
  };

  const handleDeleteEmployee = (id) => {
    deleteEmployee(id);
  };

  const handleLogout = () => {
    logout();
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
        <select value={newEmployeeRole} onChange={(e) => setNewEmployeeRole(e.target.value)}>
          <option value="Admin">Admin</option>
          <option value="Kassier">Kassier</option>
          <option value="Lagerist">Lagerist</option>
        </select>
        <button className="add-btn" onClick={handleAddEmployee}>
          Hinzufügen
        </button>
      </div>

      <div className="employee-list-section">
        <h2>Aktuelle Mitarbeiter</h2>
        <ul className="employee-list">
          {employees.map(emp => (
            <li key={emp.id} className="employee-item">
              <span>{emp.name} ({emp.role})</span>
              <div className="action-buttons">
                <button 
                  className="reset-pin-btn" 
                  onClick={() => handleReset(emp.id, 'pin')}
                >
                  PIN zurücksetzen
                </button>
                <button 
                  className="reset-password-btn" 
                  onClick={() => handleReset(emp.id, 'password')}
                >
                  Passwort zurücksetzen
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDeleteEmployee(emp.id)}
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
};

export default ManageEmployees;