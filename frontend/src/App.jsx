import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Kassier from "./pages/Kassier/Kassier";
import Lager from "./pages/Lager/Lager";
import Payment from "./pages/Payment/Payment";

function App() {
  // Warenkorb-Zustand hier definieren
  const [warenkorb, setWarenkorb] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route 
          path="/kassier" 
          element={<Kassier warenkorb={warenkorb} setWarenkorb={setWarenkorb} />} 
        />
        <Route path="/lager" element={<Lager />} />
        <Route 
          path="/payment" 
          element={<Payment warenkorb={warenkorb} setWarenkorb={setWarenkorb} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



