# Backend - Digitalize Farm Shop

This folder contains the Express.js backend API server for the Digitalize Farm Shop.

## Requirements

- Node.js (v16+ recommended)
- npm or yarn
- Access to MariaDB server (credentials configured via `.env`)

## Backend Setup
1. Go to the backend folder:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. Configure environment variables:   
Copy .env.example to .env and edit values for DB connection, port, etc.
```bash
cp .env.example .env
```
4. Run migrations (if applicable):   
```bash
mysql -u user -p digitalize_farm_shop < db/schema.sql
mysql -u user -p digitalize_farm_shop < db/migrations/20250721_add_column.sql
```
## Running the server
Development mode (with hot reload via nodemon):
```bash
npm run dev
```
Production mode:
```
npm start
```
## 📁 Project Structure
```
kassensystem-backend/
├── controllers/ # Controller logic for routes
├── models/ # Database queries
├── routes/ # Express routes
├── tools/ # Utility functions (e.g., hashing)
├── db.js # MariaDB database connection
├── index.js # Main server file
├── .env # Environment variables
└── README.md # Project documentation
```
---

## API Overview
- /api/auth - Mange Users Register, Login and Authentication
- /api/cashDeck - Manage sales, items, tickets
- /api/warehouse - Inventory management, invoices
- /api/warehouse/order - Put an order and generate the Delivery Note
- /api/dashboard - Reporting and analytics, Produts and Users management
- /api/invoice - Generate the invoice (PDF and preview as HTML)
- /api/receipt - Generate the Receipt (PDF and preview as HTML)
(Expand with detailed endpoints as you implement)
    
### 1. Create a User

First, the admin needs to create a user using the dashboard.  
This can be done via the following route:

POST http://localhost:3000/api/auth/register


**Request body example:**

```json
{
  "username": "marten",
  "password": "meinPasswort123",
  "pin": "1234",
  "role": "Admin"
}
```
The password will be hashed and stored in the database along with a unique ID and the username.
The user data is saved in a table called cashiers. (This table name can be changed later if needed.)


### 2. Login
Once a user has been created, they can log in using:

POST http://localhost:3000/api/auth/login

Request Body: 
```json
{
  "username": "marten",
  "password": "meinPasswort123"
}
```

If the credentials are correct, the server will respond with:
```json
{
  "message": "Erfolgreich angemeldet",
  "user": {
    "id": 1,
    "username": "marten"
  }
}

```
TODO in this response will be also created a Token for authentication.
// Generate a JWT token for authentication, here a Password is needed (Put JWT_SECRET variable in .env), userRole will be became from DB.
```js
  const token = jwt.sign(
      { username, role: userRole },
      JWT_SECRET,
      { expiresIn: '10h' }
  );
```
Then will be sended this token to the client.
```
res.status(200).json({ message: 'Login successful', token, user: username, role: userRole });
```
# Warehouse API Documentation

## Base URL
`http://localhost:3000/api/warehouse`

## Endpoints

### 1. Get Product Stock
**GET** `/:artikel_id`

Retrieves the current stock level for a specific product.

**Path Parameter:**
- `artikel_id` (integer) - Product ID

**Response:**
```json
{
  "artikel_id": 1,
  "bestand": 120
}
``` 

Error Responses:

400 Bad Request - Invalid product ID

```json
{"error": "Ungültige Artikel-ID"}
```
404 Not Found - Product not found

```json
{"error": "Artikel nicht gefunden"}
```
500 Internal Server Error - Server error

```json
{"error": "Interner Serverfehler"}
```
2. Update Product Stock
POST /update

Updates the stock level for a product (increase or decrease).

Request Body:

```json
{
  "productID": 1,
  "menge": 10,
  "richtung": "eingang"
}
```
Fields:

productID (integer) - Product ID to update

menge (integer) - Quantity to add/remove

richtung (string) - Direction: "eingang" (incoming) or "ausgang" (outgoing)

Success Response:

```json
{
  "message": "Stock updated successfully",
  "newStock": 130
}
```
Error Responses:

400 Bad Request - Invalid parameters

```json
{"error": "Ungültige Richtung"}
```
400 Bad Request - Negative stock not allowed

```json
{"error": "Stock cannot be negative"}
```
404 Not Found - Product not found

```json
{"error": "Artikel nicht gefunden"}
```
500 Internal Server Error - Server error

```json
{"error": "Interner Serverfehler"}
```
Example Usage
Get stock:

bash
```bash
curl http://localhost:3000/api/warehouse/1
Update stock (add 10):
```

bash
```bash
curl -X POST http://localhost:3000/api/warehouse/update \
  -H "Content-Type: application/json" \
  -d '{"productID": 1, "menge": 10, "richtung": "eingang"}'
Update stock (remove 5):
```
bash
```bash
curl -X POST http://localhost:3000/api/warehouse/update \
  -H "Content-Type: application/json" \
  -d '{"productID": 1, "menge": 5, "richtung": "ausgang"}'
```

### Delivery
```
POST http://localhost:3000/api/wareHouse/order/delivery.pdf
POST http://localhost:3000/api/wareHouse/order/delivery.html
```
```json
{
  "idOrder": 1
}
```
```
### 5. Generate Monthly Invoice
This route create the invoice in PDF, or a preview in HTML:
POST http://localhost:3000/api/invoice/monthly.pdf or http://localhost:3000/api/invoice/monthly.html
In body the items list:
```
```json
{
  "customerId": 1,
  "month": "2025-08"
}
```
### 6 Create Receipt
This route create the receipt in PDF, or a preview in HTML, and save the data in the DB:
POST http://localhost:3000/api/receipt/receipt.pdf or http://localhost:3000/api/receipt/receipt.html
In body the items list:

```json
{
    "idUser": 2,
    "items": [
        { "idProduct": 1, "quantity": 2 },
        { "idProduct": 4, "quantity": 1 },
        { "idProduct": 8, "quantity": 0.5 }
    ],
    "total": 20
}
```
## Notes
Should we put all the DB Logic in a File? Maybe could Cantez complete this with all needed SQL Queries.
## Testing
    Add testing instructions here (if tests are implemented for exampled with POSTMAN).
## License   
MIT License


