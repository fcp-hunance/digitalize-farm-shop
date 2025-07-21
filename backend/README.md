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
## API Overview (Example)

    /api/cashdesk - Manage sales, items, tickets

    /api/warehouse - Inventory management, invoices

    /api/dashboard - Reporting and analytics

    (Expand with detailed endpoints as you implement)
## Testing
    Add testing instructions here (if tests are implemented).
## License   
MIT License