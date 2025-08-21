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
- /api/kasse - Manage sales, items, tickets
- /api/lager - Inventory management, invoices
- /api/dashboard - Reporting and analytics, Produts and Users management
(Expand with detailed endpoints as you implement)
    
### 1. Create a User

First, the admin needs to create a user using the dashboard.  
This can be done via the following route:

POST http://localhost:3000/api/auth/register


**Request body example:**

```json
{
  "username": "marten",
  "password": "meinPasswort123"
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

### 3. Calculate Total Price from Products
This route calculates the total price of selected products from the database:

POST http://localhost:3000/api/kasse/berechnen

Request body example:
```json
{
  "positionen": [
    { "id": 1, "menge": 2 },
    { "id": 2, "menge": 1 }
  ]
}
```
If all products exist, the server responds with:
```json
{
  "gesamtbetrag": 7.2
}
```
The gesamtbetrag will vary depending on the product prices stored in the database.
### Create Order and Delivery Note
This route create the order and the delivery note in PDF, or a preview in HTML and send the info to the database:
POST http://localhost:3000/api/wareHouse/order

In body the customerId and items list:
```
{
  "customerId": 1,
  "items": [
    { "productId": 1, "quantity": 5 },
    { "productId": 2, "quantity": 2 }
  ]
}

```
POST http://localhost:3000/api/wareHouse/order/delivery.pdf
POST http://localhost:3000/api/wareHouse/order/delivery.html
```
{
  "orderId": 1
}
```
### Generate Monthly Invoice
This route create the invoice in PDF, or a preview in HTML:
POST http://localhost:3000/api/invoice/monthly.pdf or http://localhost:3000/api/invoice/monthly.html
In body the items list:
```
{
  "customerId": 1,
  "month": "2025-08"
}
```
## Notes
Should we put all the DB Logic in a File? Maybe could Cantez complete this with all needed SQL Queries.
## Testing
    Add testing instructions here (if tests are implemented for exampled with POSTMAN).
## License   
MIT License


