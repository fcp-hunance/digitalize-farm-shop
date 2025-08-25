# Digitalize Farm Shop Frontend
A modern point-of-sale (POS) and management system for a farm shop. The application is role-based and centralizes data management to ensure smooth operations.

## Funktionen
- Role-Based Login: Various user roles (Admin, Cashier, Warehouse Worker) have access to specific areas.

- Centralized State Management: Utilizes the React Context API for global management of user and product data.

- Automatic Screen Lock: Protects the application from unauthorized access by automatically locking the screen after one minutes of inactivity.

- Cashier Functionality: Allows adding products from a catalog, calculating discounts, and processing payments.

- Employee Management: Allows Admins to add and delete employees, as well as reset their PINs and passwords.

- Warehouse Management: Separate interfaces for Admins (add/delete products) and Warehouse Workers (view inventory).

- Order & Invoice Management: Functionality for creating delivery notes and invoices based on a customer ID.

## Getting Started

### Prerequisites
Ensure that Node.js and a package manager like npm or yarn are installed on your system.

### Installation

### 1. Clone the repository:

```Bash
git clone https://github.com/dein-benutzername/digitalize-farm-shop-frontend.git
cd digitalize-farm-shop-frontend
```
### 2. Install dependencies:



```Bash

npm install
# or yarn install
```

### 3. Start the application in development mode:

```Bash

npm run dev
# or yarn dev
```

The application will be available at http://localhost:5173 or a similar port.

## Usage

### Login Credentials (Dummy)
Use these details to log in with different roles:

| Username |	Password |	Role	| Access Page |
|---|---|---|---|
| `Max Mustermann`| `password123` |	`Admin` |	`Dashboard` |
| `Erika Mustermann`| `password123` |	`Kassiererin` |	`Kasse` |
| `John Doe`| `password123` |	`Lagerist` |	`Lager` |



### Important Notes

- Autofill Issues: Input fields are configured with autoComplete="new-password" to bypass browser autofill features.

- Delivery Note/Order: Enter any customer ID in the input field to trigger the corresponding functions.

## Technologies Used

- React & Vite

- React Router

- Recharts (for charts on the Dashboard)

- React Context API (for centralized state management)

