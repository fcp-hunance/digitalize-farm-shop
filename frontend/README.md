# Digitalize Farm Shop Frontend
Ein modernes Point-of-Sale (POS) und Verwaltungssystem für einen Hofladen. Die Anwendung ist rollenbasiert und zentralisiert die Datenverwaltung, um einen reibungslosen Betrieb zu gewährleisten.

## Funktionen
Rollenbasiertes Login: Verschiedene Benutzerrollen (Admin, Kassierer, Lagerist) haben Zugriff auf spezifische Bereiche.

Zentralisierte Zustandsverwaltung: Nutzt das React Context API für die globale Verwaltung von Benutzer- und Produktdaten.

Automatischer Sperrbildschirm: Schützt die Anwendung vor unbefugtem Zugriff durch automatische Bildschirmsperre nach 5 Minuten Inaktivität.

Kassenfunktion: Ermöglicht das Hinzufügen von Produkten aus einem Katalog, die Berechnung von Rabatten und die Abwicklung von Zahlungen.

Mitarbeiterverwaltung: Ermöglicht Admins, Mitarbeiter hinzuzufügen, zu löschen sowie deren PINs und Passwörter zurückzusetzen.

Lagerverwaltung: Separate Oberflächen für Admins (Produkt hinzufügen/löschen) und Lageristen (Warenbestand einsehen).

Bestell- & Rechnungsverwaltung: Funktion zum Erstellen von Lieferscheinen und Rechnungen basierend auf einer Kunden-ID.

## Erste Schritte

### Voraussetzungen
Stelle sicher, dass Node.js und ein Paketmanager wie npm oder yarn auf deinem System installiert sind.

### Installation

### 1. Klone das Repository:

```Bash
git clone https://github.com/dein-benutzername/digitalize-farm-shop-frontend.git
cd digitalize-farm-shop-frontend
```
### 2. Installiere die Abhängigkeiten:



```Bash

npm install
# oder yarn install
```

### 3. Starte die Anwendung im Entwicklungsmodus:

```Bash

npm run dev
# oder yarn dev
```

Die Anwendung wird unter http://localhost:5173 oder einem ähnlichen Port verfügbar sein.

## Nutzung

### Login-Daten (Dummy)
Verwende diese Daten, um dich mit verschiedenen Rollen anzumelden:

|Benutzername|	Passwort|	Rolle	|Zugriffsseite|
|---|---|---|---|
| `Max Mustermann`| `password123` |	`Admin` |	`Dashboard` |
| `Erika Mustermann`| `password123` |	`Kassiererin` |	`Kasse` |
| `John Doe`| `password123` |	`Lagerist` |	`Lager` |



### Wichtige Hinweise

- Autofill-Probleme: Die Eingabefelder sind mit autoComplete="new-password" konfiguriert, um die Autofill-Funktion von Browsern zu umgehen.
- Lieferschein/Bestellung: Gib eine beliebige Kunden-ID in das Eingabefeld ein, um die entsprechenden Funktionen auszulösen.

## Verwendete Technologien

- React & Vite

- React Router

- Recharts (für Diagramme auf dem Dashboard)

- React Context API (für zentrales State Management)

