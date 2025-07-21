# Database - Digitalize Farm Shop

This folder contains the database schema, migration scripts, and seed data for the MariaDB database.

---

## Setup

1. Create a MariaDB database:

   ```sql
   CREATE DATABASE digitalize_farm_shop;

    Import schema:

    mysql -u your_user -p digitalize_farm_shop < schema.sql

2. Run migrations (if applicable):

    Follow the instructions for migration scripts in the migrations/ folder.

3. Insert seed data (optional):   
**note:** Initial or test data inserts  
    mysql -u your_user -p digitalize_farm_shop < seeds/initial_data.sql

4. Files

    schema.sql: Initial SQL to create tables and indexes

    migrations/: Scripts to update the schema version by version

    seeds/: Initial or test data inserts

5. Notes

    Make sure your backend .env matches the database connection credentials.

    You can use migration tools like Knex or Sequelize if you prefer managing schema updates programmatically.

6. License   
MIT License