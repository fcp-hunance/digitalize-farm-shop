import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import AppContent from "./AppContent"; // Importiere die App-Logik

function App() {
  const [warenkorb, setWarenkorb] = useState([]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          {/* Hier wird der AppContent gerendert und der Warenkorb übergeben */}
          <AppContent warenkorb={warenkorb} setWarenkorb={setWarenkorb} />
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;