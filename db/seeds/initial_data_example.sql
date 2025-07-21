-- Seed data for Digitalize Farm Shop

-- Insert some cashiers
INSERT INTO cashiers (name) VALUES 
  ('Alice'),
  ('Bob'),
  ('Charlie');

-- Insert some products
INSERT INTO products (name, unit, price_per_unit, stock_quantity) VALUES 
  ('Apple', 'kg', 2.50, 100),
  ('Milk', 'piece', 1.20, 50),
  ('Bread', 'piece', 1.00, 30),
  ('Potatoes', 'kg', 1.00, 200);

-- Insert a sample invoice
INSERT INTO invoices (customer_name, total) VALUES
  ('Farmers Market Ltd', 50.00);

-- Insert invoice items for the invoice
INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price) VALUES
  (1, 1, 10, 2.50),   -- 10 kg Apples
  (1, 2, 5, 1.20);    -- 5 Milk
