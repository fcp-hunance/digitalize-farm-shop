const produktModel = require('../models/produktModel');

async function berechneGesamtbetrag(req, res) {
  const positionen = req.body.positionen;

  if (!Array.isArray(positionen)) {
    return res.status(400).json({ error: 'Ungültige Datenstruktur' });
  }

  let gesamtbetrag = 0;

  try {
    for (const pos of positionen) {
      const { id, menge } = pos;

      if (typeof id !== 'number' || typeof menge !== 'number') {
        return res.status(400).json({ error: 'ID und Menge müssen Zahlen sein' });
      }

      const produkt = await produktModel.getProduktById(id);

      if (!produkt) {
        return res.status(404).json({ error: `Produkt mit ID ${id} nicht gefunden` });
      }

      gesamtbetrag += produkt.preis * menge;
    }

    return res.json({ gesamtbetrag });

  } catch (error) {
    console.error('Fehler beim Berechnen:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
}

module.exports = {
  berechneGesamtbetrag,
};
