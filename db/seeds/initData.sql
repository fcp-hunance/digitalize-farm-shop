-- Persons
INSERT INTO `t_Person` (`idPerson`, `strFirstName`, `strLastName`, `strPhone`, `strAddress`) VALUES
    (1, 'Hans', 'Hahn', '+49 151 3456789', 'Dorfplatz 5, 67890 Kleinstadt'),
    (2, 'Sandra', 'Hahn', '+49 170 1234567', 'Dorfplatz 5, 67890 Kleinstadt'),
    (3, 'Thomas', 'Krupp', '+49 175 9865324', 'Nebenstraße 45, 12346 Musterstadt'),
    (4, 'Birgitt', 'Bock', '+49 176 2345678', 'Gartenweg 8, 54321 Beispielort')
    

-- Product Groups
INSERT INTO `t_ProductGroup` (`idGroup`, `strGroupName`) VALUES
    (1, 'Eigene'),
    (2, 'Kommission'),
    (3, 'Externe');

-- Units
INSERT INTO `t_Unit` (`idUnit`, `strUnit`) VALUES
    (1, 'kg'),
    (2, 'Stück'),
    (3, 'Liter');

-- Products (unchanged names, just corrected columns)
INSERT INTO `t_Product` (`idProduct`, `strProductName`, `decPrice`, `fkGroup`, `fkUnit`, `intStock`) VALUES
   	(1, 'Äpfel', 2.50, 1, 1, 120),      -- per kg
    (2, 'Kartoffeln', 1.20, 1, 1, 200), -- per kg
    (3, 'Milch', 1.10, 1, 3, 180),       -- per liter
    (4, 'Brot', 3.20, 2, 2, 15),        -- per loaf
    (5, 'Eier', 2.80, 3, 2, 30),        -- per 10 pcs
    (6, 'Fleisch', 12.50, 3, 1, 20),    -- per kg
    (7, 'Honig', 6.90, 2, 3, 30),       -- per jar (liter unit)
    (8, 'Mais', 1.50, 1, 1, 150),       -- per kg
    (9, 'Salat', 1.80, 1, 2, 70),       -- per head (Stück)
    (10, 'Möhren', 2.00, 1, 1, 110),    -- per kg 
    (11, 'Brötchen', 0.40, 2, 2, 45),  -- per piece
    (12, 'Erdbeeren', 3.90, 2, 1, 30);  -- per kg

-- Major Customers
INSERT INTO `t_MajorCustomer` (`idCustomer`, `strAddress`, `strPhone`, `strEmail`) VALUES
    (1, 'Hauptstraße 1, Musterstadt', '0123456789', 'sandra@example.com'),
    (2, 'Gartenweg 2, Beispielort', '0987654321', 'birgitt@example.com'),
    (3, 'Dorfplatz 5, Kleinstadt', '0112233445', 'hans@example.com');

-- VAT Rates
INSERT INTO `t_Vat` (`idVAT`, `decTaxRate`, `dateValidFrom`, `dateValidUntil`) VALUES
    (1, 7.00, '2020-01-01', NULL),
    (2, 19.00, '2020-01-01', NULL);

-- Orders
INSERT INTO `t_Order` (`idOrder`, `dateOrderDate`, `fkCustomer`, `decTotal`) VALUES
    (1, '2025-08-01', 1, 25.50),
    (2, '2025-08-02', 2, 40.00);

-- Product Orders
INSERT INTO `t_Product_Order` (`idProductOrder`, `fkProduct`, `fkOrder`, `intQuantity`) VALUES
    (1, 1, 1, 5),   -- 5 Äpfel for Order 1
    (2, 4, 1, 2),   -- 2 Brot for Order 1
    (3, 2, 2, 10),  -- 10 Kartoffeln for Order 2
    (4, 3, 2, 3);   -- 3 Milch for Order 2

-- Delivery Notes
INSERT INTO `t_DeliveryNote` (`idDeliveryNote`, `dateDeliveryDate`, `dateReceiptDate`, `fkOrder`) VALUES
    (1, '2025-08-03', '2025-08-03', 1),
    (2, '2025-08-04', '2025-08-05', 2);

-- Invoices
INSERT INTO `t_Invoice` (`idInvoice`, `dateInvoiceDate`, `boolIsPaid`) VALUES
    (1, '2025-08-05', 1),
    (2, '2025-08-06', 0);

-- Invoice-DeliveryNote links
INSERT INTO `t_Invoice_DeliveryNote` (`idInvoiceDeliveryNote`, `fkInvoice`, `fkDeliveryNote`) VALUES
    (1, 1, 1),
    (2, 2, 2);
