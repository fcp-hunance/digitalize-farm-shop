-- Exportiere Daten aus Tabelle green.t_person: ~3 rows (ungefähr)
INSERT INTO `t_person` (`PersonID`, `FirstName`, `LastName`, `DateOfBirth`, `Phone`, `Address`) VALUES
	(1, 'Sandra ', 'Stock', '2025-04-19', NULL, NULL),
	(2, 'Birgitt ', 'Bock', '2025-07-19', NULL, NULL),
	(3, 'Hans', 'Hahn', '2025-08-23', NULL, NULL);

-- Exportiere Daten aus Tabelle green.t_product: ~12 rows (ungefähr)
INSERT INTO `t_product` (`ProductID`, `ProductName`, `Price`, `GroupID`, `UnitID`, `StockLevel`) VALUES
	(1, 'Äpfel', 0.00, 2, NULL, 0),
	(2, 'Kartoffeln', 0.00, 3, NULL, 0),
	(3, 'Milch ', 0.00, 1, NULL, 0),
	(4, 'Brot', 0.00, 2, NULL, 0),
	(5, 'Eier', 0.00, 4, NULL, 0),
	(6, 'Fleisch', 0.00, 3, NULL, 0),
	(7, 'Honig', 0.00, 2, NULL, 0),
	(8, 'Mais', 0.00, 2, NULL, 0),
	(9, 'Salat', 0.00, 2, NULL, 0),
	(10, 'Möhren', 0.00, 3, NULL, 0),
	(11, 'Brötchen', 0.00, 2, NULL, 0),
	(12, 'Erdbeeren', 0.00, 3, NULL, 0);

-- Exportiere Daten aus Tabelle green.t_productgroup: ~4 rows (ungefähr)
INSERT INTO `t_productgroup` (`GroupID`, `GroupName`) VALUES
	(1, 'Liter'),
	(2, 'Stück'),
	(3, 'Gramm'),
	(4, 'Einheit');

-- Exportiere Daten aus Tabelle green.t_user: ~3 rows (ungefähr)
INSERT INTO `t_user` (`UserID`, `PersonID`, `Username`, `PasswordHash`, `PIN`) VALUES
	(91, 1, 'Sandra', '', NULL),
	(92, 2, 'Birgitt', '', NULL),
	(93, 3, 'Hans', '', NULL);