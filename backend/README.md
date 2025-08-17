# Kassensystem Backend

This project represents the backend of a web-based cashier system.  
My part of the project includes the backend logic for:

- The cashier system
- The stock system
- The admin dashboard

It is developed using **Node.js**, **Express**, and **MariaDB**.

## 🔧 Technologies Used

The following technologies are used:

- Node.js
- Express
- MariaDB
- dotenv
- bcrypt (for hashing passwords)

## 📁 Project Structure

kassensystem-backend/
├── controllers/ # Controller logic for routes
├── models/ # Database queries
├── routes/ # Express routes
├── tools/ # Utility functions (e.g., hashing)
├── db.js # MariaDB database connection
├── index.js # Main server file
├── .env # Environment variables
└── README.md # Project documentation


---

## 1. Create a User

First, the admin needs to create a user using the dashboard.  
This can be done via the following route:

POST http://localhost:3000/auth/register


**Request body example:**

```json
{
  "username": "marten",
  "password": "meinPasswort123"
}
```
The password will be hashed and stored in the database along with a unique ID and the username.
The user data is saved in a table called benutzer. (This table name can be changed later if needed.)



## 2. Login
Once a user has been created, they can log in using:

POST http://localhost:3000/auth/login


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


## 3. Calculate Total Price from Products
This route calculates the total price of selected products from the database:



POST http://localhost:3000/kasse/berechne


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



