import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [roleContext, setRoleContext] = useState("");
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState("");
  const location = useLocation();
  
  // ✅ Neu: Ein Ref zur Speicherung des Timers
  const timeoutRef = useRef(null);

  const [employees, setEmployees] = useState([
    { id: 1, name: "Max Mustermann", pin: "1234", password: "password123", role: "Admin" },
    { id: 2, name: "Erika Mustermann", pin: "5678", password: "password123", role: "Kassier" },
    { id: 3, name: "John Doe", pin: "9012", password: "password123", role: "Lagerist" },
  ]);

  const [isLocked, setIsLocked] = useState(false);
  const LOCK_TIMEOUT = 1 * 60 * 1000; // 1 Minute zum Testen

  const login = (username, password) => {
    const foundUser = employees.find(
      (emp) => emp.name === username && emp.password === password
    );
    if (foundUser) {
      setUser(foundUser.name);
      setRoleContext(foundUser.role);
      setAuth({ token: "dummy-token" });
      return true;
    }
    return false;
  };

  const logout = (message) => {
    setModalMessage(message);
    setAuth(null);
    setUser("");
    setRoleContext("");
    localStorage.removeItem('token');
    clearTimeout(timeoutRef.current);
  };
  
  const addEmployee = (newEmployee) => {
    setEmployees([...employees, newEmployee]);
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const resetPin = (id, newPin) => {
    setEmployees(employees.map(emp => (emp.id === id ? { ...emp, pin: newPin } : emp)));
  };

  const resetPassword = (id, newPassword) => {
    setEmployees(employees.map(emp => (emp.id === id ? { ...emp, password: newPassword } : emp)));
  };

  const unlockScreen = (pin) => {
    const employee = employees.find(emp => emp.pin === pin);
    if (employee) {
        setIsLocked(false);
        return true;
    }
    return false;
  };
  
  // ✅ KORRIGIERTER USEEFFECT-HOOK FÜR TIMER
  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsLocked(true);
        console.log("Bildschirm wurde gesperrt."); // Debugging-Hilfe
      }, LOCK_TIMEOUT);
    };

    const handleActivity = () => {
      if (user && !isLocked) { // Nur zurücksetzen, wenn ein Benutzer eingeloggt ist und der Bildschirm nicht gesperrt ist
        resetTimer();
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);

    // Initialen Timer nur starten, wenn ein Benutzer eingeloggt ist
    if (user) {
        resetTimer(); 
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [user, isLocked]); // Abhängigkeiten korrigiert

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        roleContext, 
        auth, 
        login, 
        logout, 
        modalMessage,
        employees,
        addEmployee,
        deleteEmployee,
        resetPin,
        resetPassword,
        isLocked,
        unlockScreen
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);