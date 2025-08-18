import { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// This Component isn't yet completed
// Create the context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [roleContext, setRoleContext] = useState("");
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState("");
  const location = useLocation();
  const timeoutRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL;

  const getStoredToken = () => {
    const token = localStorage.getItem('token');
    return {token}
  }

  const isTokenValid = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000;
      if (Date.now() >= expirationTime) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Invalid token: ", error);
      return false;
    }
  };

  const startTknExpTimer = (token) => {
    const decodedToken = jwtDecode(token);
    const expirationTime = decodedToken.exp * 1000 - Date.now();
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      logout("Your session has expired. Please log in again.");
    }, expirationTime);
  }

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const { token, user, role } = response.data;
      localStorage.setItem('tokenP', token);
      setAuth({ token });
      setUser(username);
      setRoleContext(role);
      startTknExpTimer(token);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network error');
    }
  };

  const logout = (message) => {
    setModalMessage(message)
    setAuth(null);
    setUser("");
    setRoleContext("");
    localStorage.removeItem('token');
    clearTimeout(timeoutRef.current);
  };

  return (
    <AuthContext.Provider value={{ user, roleContext, auth, login, logout, modalMessage }}>
      {!loading && children}  {/* Ensure app content is rendered only after loading is complete */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);