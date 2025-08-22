import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Kassier from "./pages/Kassier/Kassier";
import Lager from "./pages/Lager/Lager";
import Payment from "./pages/Payment/Payment";
import DeliveryNote from "./pages/DeliveryNote/DeliveryNote";
import RechnungErstellen from "./pages/LieferscheinErstellen/LieferscheinErstellen"; // Neue Komponente

function App() {
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
        <Route path="/deliveryNote/:kundenId" element={<DeliveryNote />} />
        <Route path="/bestelluebersicht/:kundenId" element={<div>Bestellübersicht für KundenID</div>} />
        <Route path="/rechnung-erstellen/:kundenId" element={<RechnungErstellen />} />
        <Route
          path="/payment"
          element={<Payment warenkorb={warenkorb} setWarenkorb={setWarenkorb} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;