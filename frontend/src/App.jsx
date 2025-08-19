import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Kassier from "./pages/Kassier/Kassier";
import Lager from "./pages/Lager/Lager";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kassier" element={<Kassier />} />
         <Route path="/lager" element={<Lager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


