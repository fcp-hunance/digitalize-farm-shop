import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext"; // ✅ Import des neuen Kontexts
import Login from "./components/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Kassier from "./pages/Kassier/Kassier";
import Lager from "./pages/Lager/Lager";
import Payment from "./pages/Payment/Payment";
import DeliveryNote from "./pages/DeliveryNote/DeliveryNote";
import RechnungErstellen from "./pages/LieferscheinErstellen/LieferscheinErstellen";
import ManageEmployees from "./pages/ManageEmployees/ManageEmployees";
import WarehouseManagement from "./pages/WarehouseManagement/WarehouseManagement";

function App() {
  const [warenkorb, setWarenkorb] = useState([]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider> {/* ✅ Den ProductProvider hinzufügen */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/kassier"
              element={<Kassier warenkorb={warenkorb} setWarenkorb={setWarenkorb} />}
            />
            <Route path="/lager" element={<Lager />} />
            <Route path="/warehouse-management" element={<WarehouseManagement />} />
            <Route path="/deliveryNote/:kundenId" element={<DeliveryNote />} />
            <Route path="/bestelluebersicht/:kundenId" element={<div>Bestellübersicht für KundenID</div>} />
            <Route path="/rechnung-erstellen/:kundenId" element={<RechnungErstellen />} />
            <Route path="/mitarbeiter" element={<ManageEmployees />} />
            <Route
              path="/payment"
              element={<Payment warenkorb={warenkorb} setWarenkorb={setWarenkorb} />}
            />
          </Routes>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;