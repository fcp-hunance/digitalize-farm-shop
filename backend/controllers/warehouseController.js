const warehouseService = require("../services/warehouseService");

async function getIntStock(req, res) {
  try {
    const productID = parseInt(req.params.artikel_id, 10);
    console.log('Angefragte Artikel-ID:', productID); // Debug-Log
    if (isNaN(productID)) {
      return res.status(400).json({ error: "Ungültige Artikel-ID" });
    }
    const bestand = await warehouseService.getIntStock(productID);
    console.log('Gefundener Bestand:', bestand); // Debug-Log
    res.json({ artikel_id: productID, bestand });
  } catch (err) {
    console.error('Fehler in getIntStock:', err.message); // Debug-Log
    console.error('Stack Trace:', err.stack); // Debug-Log
    
    if (err.message.includes("nicht gefunden")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Interner Serverfehler", details: err.message }); // Fehlerdetails anzeigen
  }
}

async function updateIntStock(req, res) {
  try {
    const { artikel_id, menge, richtung } = req.body;

    if (!artikel_id || !menge || !richtung) {
      return res.status(400).json({ error: "Fehlende Felder im JSON" });
    }

    if (menge <= 0) {
      return res.status(400).json({ error: "Menge muss positiv sein" });
    }

    const neuerBestand = await warehouseService.updateIntStock(
      artikel_id,
      menge,
      richtung
    );

    res.json({
      artikel_id,
      neuerBestand,
    });
  } catch (err) {
    if (err.message.includes("negativ")) {
      return res.status(400).json({ error: err.message });
    }
    if (err.message.includes("Ungültige Richtung")) {
      return res.status(400).json({ error: err.message });
    }
    if (err.message.includes("nicht gefunden")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Interner Serverfehler" });
  }
}

async function addProduct(req, res) {
  try {
    const { name, preis = 0, initialerBestand = 0 } = req.body;

   // if (!artikelnummer ||  strProductName) {
   //   return res.status(400).json({ error: "Artikelnummer und strProductName sind erforderlich" });
   // }

    if (initialerBestand < 0) {
      return res.status(400).json({ error: "Initialer Bestand darf nicht negativ sein" });
    }

    const neuesProdukt = await warehouseService.addProduct({
      name,
      preis,
      intStock: initialerBestand
    });

    res.status(201).json({
      message: "Artikel erfolgreich hinzugefügt",
      produkt: neuesProdukt
    });
  } catch (err) {
    if (err.message.includes("bereits vorhanden")) {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: "Interner Serverfehler", details: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const productID = parseInt(req.params.artikel_id, 10);
    
    if (isNaN(productID)) {
      return res.status(400).json({ error: "Ungültige Artikel-ID" });
    }

    await warehouseService.deleteProduct(productID);

    res.json({ 
      message: "Artikel erfolgreich gelöscht",
      artikel_id: productID
    });
  } catch (err) {
    if (err.message.includes("nicht gefunden")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Interner Serverfehler", details: err.message });
  }
}
module.exports = {
  getIntStock,
  updateIntStock,
  addProduct,
  deleteProduct
};
