# 🌱 Digitalize Farm Shop - Backend API

Dieses Repository enthält den **Express.js Backend-Server** für den Digitalize Farm Shop.  
Es stellt REST-APIs für Kasse, Lager, Benutzerverwaltung, Rechnungen, Quittungen und Admin-Funktionen bereit.

---

## 📦 Anforderungen

- **Node.js** (v16+ empfohlen)
- **npm** oder **yarn**
- **MariaDB** (Zugangsdaten via `.env` konfigurierbar)

---

## ⚙️ Setup

1. Zum Backend-Ordner wechseln:
```bash
cd backend
Abhängigkeiten installieren:
```
```bash

npm install
Umgebungsvariablen konfigurieren:
```
```bash
cp .env.example .env
Trage anschließend DB-Credentials, Port, JWT-Secret etc. ein.
```
Datenbank einrichten:

```bash

mysql -u user -p digitalize_farm_shop < db/schema.sql
mysql -u user -p digitalize_farm_shop < db/seeds/initData.sql
mysql -u user -p digitalize_farm_shop < db/migrations/.
```
▶️ Server starten
Entwicklung (mit Hot-Reload via nodemon):

```bash
npm run dev
```
Produktion:

```bash
npm start
```
Standard-URL:


http://localhost:3000
📁 Projektstruktur
```bash

backend/
├── controllers/   # Business-Logik
├── models/        # Datenbankabfragen
├── routes/        # Express Routen
├── tools/         # Hilfsfunktionen (z.B. Hashing)
├── db.js          # MariaDB Verbindung
├── index.js       # Hauptserver
├── .env           # Umgebungsvariablen
└── README.md      # Projektdokumentation
```
🌐 API Übersicht
Route	Beschreibung
/api/auth	Benutzer-Registrierung, Login, Auth
/api/cashDesk	Verkauf, Artikel, Tickets
/api/warehouse	Lagerverwaltung, Bestellungen, Wareneingang
/api/dashboard	Reporting, Produkte & Benutzerverwaltung
/api/invoice	Rechnungen (PDF & HTML)
/api/receipt	Quittungen (PDF & HTML)
/api/admin	Admin-Tools: User-Management

🔑 Authentifizierung
1. Benutzer anlegen
POST /api/auth/register

Beispiel-Request:

```json

{
  "username": "marten",
  "password": "meinPasswort123",
  "pin": "1234",
  "role": "Admin"
}
```
2. Login
POST /api/auth/login

Request:

```json

{
  "username": "marten",
  "password": "meinPasswort123"
}

```
Response (inkl. Token):

```json

{
  "message": "Login successful",
  "token": "jwt-token-hier",
  "user": "marten",
  "role": "Admin"
}
```
📦 Warehouse API
Base URL: http://localhost:3000/api/warehouse

Get Product Stock
GET /:artikel_id

```json

{
  "artikel_id": 1,
  "bestand": 120
}
```
Update Product Stock
POST /update

```json

{
  "productID": 1,
  "menge": 10,
  "richtung": "eingang"
}
Antwort:

```json

{
  "message": "Stock updated successfully",
  "newStock": 130
}
```
Bestellung & Lieferschein
POST /order

```json

{
  "idCustomer": 1,
  "items": [
    { "idProduct": 1, "quantity": 5 },
    { "idProduct": 2, "quantity": 2 }
  ],
  "decTotal": 30.5
}
```
Antwort:

```json

{
  "success": true,
  "idOrder": 10,
  "idDeliveryNote": 9
}
```
📑 Rechnungen & Quittungen
Monatliche Rechnung erstellen
POST /api/invoice/monthly.pdf

```json

{
  "customerId": 1,
  "month": "2025-08"
}
```
Quittung erstellen
POST /api/receipt/receipt.pdf

```json

{
  "idUser": 2,
  "items": [
    { "idProduct": 1, "quantity": 2 },
    { "idProduct": 4, "quantity": 1 }
  ],
  "total": 20
}
```
🛠️ Admin API
Base URL: http://localhost:3000/api/admin

Passwort zurücksetzen
POST /reset-password

```json

{
  "username": "cashier1",
  "newPassword": "new_password_123"
}
```
PIN zurücksetzen
POST /reset-pin

```json

{
  "username": "cashier1",
  "newPin": "4321"
}
```
Benutzer löschen
DELETE /delete-user

```json

{
  "username": "user_to_delete"
}
```
🧪 Testing
Tests können mit Postman oder einem vergleichbaren Tool durchgeführt werden.

Beispiel-Requests siehe API-Abschnitte oben.

📜 Lizenz
MIT License