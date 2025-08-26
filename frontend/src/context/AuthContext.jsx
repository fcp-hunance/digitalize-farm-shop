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
  
  // Ein Ref zur Speicherung des Timers
  const timeoutRef = useRef(null);

  const [employees, setEmployees] = useState([
    { id: 1, name: "Hans", pin: "1234", password: "1234", role: "admin" },
    { id: 2, name: "Sandra", pin: "1234", password: "1234", role: "cashier" },
    { id: 3, name: "Petra", pin: "1234", password: "1234", role: "cashier" },
    { id: 4, name: "Thomas", pin: "1234", password: "1234", role: "warehouse" },
  ]);

  const [isLocked, setIsLocked] = useState(false);
  const LOCK_TIMEOUT = 1 * 60 * 1000; // 1 Minute zum Testen

  const login = async (username, password) => {
  try {
    const response = await axios.post("http://localhost:3000/api/auth/login", {
      username,
      password,
    });
    console.log("Login. Response from backend: "+JSON.stringify(response.data));

    if (response.status === 200) {
      const data = response.data;

      // Save user info in context
      setUser(data.user);
      setRoleContext(data.role);
      setAuth({ token: data.token });

      // Optionally store token in localStorage
      localStorage.setItem("token", data.token);

      return data;
    }
  } catch (err) {
    console.error("Login fehlgeschlagen:", err);
    return false;
  }
};


  const logout = (message) => {
    setModalMessage(message);
    setAuth(null);
    setUser("");
    setRoleContext("");
    localStorage.removeItem('token');
    clearTimeout(timeoutRef.current);
  };
  
  // const addEmployee = (newEmployee) => {
  //   setEmployees([...employees, newEmployee]);
  // };

  // const deleteEmployee = (id) => {
  //   setEmployees(employees.filter(emp => emp.id !== id));
  // };

  // const resetPin = (id, newPin) => {
  //   setEmployees(employees.map(emp => (emp.id === id ? { ...emp, pin: newPin } : emp)));
  // };

  // const resetPassword = (id, newPassword) => {
  //   setEmployees(employees.map(emp => (emp.id === id ? { ...emp, password: newPassword } : emp)));
  // };

  const unlockScreen = (pin) => {
    const employee = employees.find(emp => emp.pin === pin);
    if (employee) {
        setIsLocked(false);
        return true;
    }
    return false;
  };
  
  // USEEFFECT-HOOK FÜR TIMER
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
  }, [user, isLocked]); // Abhängigkeiten 

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
        // employees,
        // addEmployee,
        // deleteEmployee,
        // resetPin,
        // resetPassword,
        // isLocked,
        unlockScreen
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);