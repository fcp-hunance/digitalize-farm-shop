-- ============================
-- INIT DATA FOR TESTING
-- ============================

-- 1. Customers
INSERT INTO t_majorcustomer (CustomerID, Address, Phone, Email) VALUES
(1, 'Customer One Address', '0123456789', 'customer1@example.com'),
(2, 'Customer Two Address', '0987654321', 'customer2@example.com');

-- 2. Products
INSERT INTO t_product (ProductID, Name, Price) VALUES
(1, 'Product A', 10.0),
(2, 'Product B', 15.5),
(3, 'Product C', 7.25);

-- 3. Orders
INSERT INTO t_order (OrderID, OrderDate, CustomerID, TotalWeight) VALUES
(1, '2025-08-01', 1, 5),
(2, '2025-08-05', 1, 3),
(3, '2025-08-03', 2, 4);

-- 4. Product-Order relations
INSERT INTO t_product_order (ProductID, OrderID, Quantity) VALUES
(1, 1, 2),
(2, 1, 1),
(3, 1, 3),
(1, 2, 1),
(3, 2, 2),
(2, 3, 2);

-- 5. Delivery Notes
INSERT INTO t_deliverynote (DeliveryNoteID, DeliveryDate, ReceiptDate, OrderID) VALUES
(1, '2025-08-02', NULL, 1),
(2, '2025-08-06', NULL, 2),
(3, '2025-08-04', NULL, 3);

-- 6. Invoices (monthly for customer 1)
INSERT INTO t_invoice (InvoiceID, InvoiceDate, IsPaid) VALUES
(1, '2025-08-31', 0);

-- 7. Link delivery notes to invoices
INSERT INTO t_invoice_deliverynote (LinkID, InvoiceID, DeliveryNoteID) VALUES
(1, 1, 1),
(2, 1, 2);

-- 8. Optional: another invoice for customer 2
INSERT INTO t_invoice (InvoiceID, InvoiceDate, IsPaid) VALUES
(2, '2025-08-31', 0);

INSERT INTO t_invoice_deliverynote (LinkID, InvoiceID, DeliveryNoteID) VALUES
(3, 2, 3);
