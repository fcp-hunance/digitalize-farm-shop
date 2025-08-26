import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useProducts } from './context/ProductContext';
import LockScreen from './components/LockScreen/LockScreen';
import Login from './components/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Kassier from './pages/Checkout/Checkout';
import Lager from './pages/Warehouse/Warehouse';
import Payment from './pages/Payment/Payment';
import DeliveryNote from './pages/DeliveryNote/DeliveryNote';
import RechnungErstellen from './pages/DeliveryNoteCreation/DeliveryNoteCreation';
import ManageEmployees from './pages/ManageEmployees/ManageEmployees';
import WarehouseManagement from './pages/WarehouseManagement/WarehouseManagement';

const AppContent = ({ warenkorb, setWarenkorb }) => {
    const { isLocked } = useAuth();

    return (
        <>
            {isLocked && <LockScreen />}
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
        </>
    );
};

export default AppContent;