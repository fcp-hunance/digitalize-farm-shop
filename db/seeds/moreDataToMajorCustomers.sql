-- Orders (more dates within August)
INSERT INTO `t_Order` (`idOrder`, `dateOrderDate`, `fkCustomer`, `decTotal`) VALUES
    (3, '2025-08-07', 1, 15.20),
    (4, '2025-08-08', 2, 30.50),
    (5, '2025-08-10', 3, 12.00),
    (6, '2025-08-15', 1, 50.00),
    (7, '2025-08-20', 3, 20.00),
    (8, '2025-08-22', 2, 25.00);

-- Product Orders
INSERT INTO `t_Product_Order` (`idProductOrder`, `fkProduct`, `fkOrder`, `intQuantity`) VALUES
    (5, 5, 3, 12),   -- 12 Eier for Order 3
    (6, 6, 4, 4),    -- 4 Fleisch for Order 4
    (7, 1, 5, 2),    -- 2 Äpfel for Order 5
    (8, 10, 6, 25),  -- 25 Möhren for Order 6
    (9, 12, 7, 3),   -- 3 Erdbeeren for Order 7
    (10, 8, 8, 10);  -- 10 Mais for Order 8

-- Delivery Notes
INSERT INTO `t_DeliveryNote` (`idDeliveryNote`, `dateDeliveryDate`, `dateReceiptDate`, `fkOrder`) VALUES
    (3, '2025-08-08', '2025-08-08', 3),
    (4, '2025-08-09', '2025-08-10', 4),
    (5, '2025-08-11', '2025-08-11', 5),
    (6, '2025-08-16', '2025-08-16', 6),
    (7, '2025-08-21', '2025-08-22', 7),
    (8, '2025-08-23', '2025-08-23', 8);

-- Invoices
INSERT INTO `t_Invoice` (`idInvoice`, `dateInvoiceDate`, `boolIsPaid`) VALUES
    (3, '2025-08-09', 1),
    (4, '2025-08-11', 0),
    (5, '2025-08-17', 1),
    (6, '2025-08-24', 0);

-- Invoice-DeliveryNote links
INSERT INTO `t_Invoice_DeliveryNote` (`idInvoiceDeliveryNote`, `fkInvoice`, `fkDeliveryNote`) VALUES
    (3, 3, 3),
    (4, 4, 4),
    (5, 5, 6),
    (6, 6, 8);
