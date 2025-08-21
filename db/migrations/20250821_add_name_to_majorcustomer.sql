-- Migration: add strName to t_MajorCustomer and update initial data
ALTER TABLE `t_MajorCustomer`
ADD COLUMN `strName` VARCHAR(100) NOT NULL AFTER `idCustomer`;

-- Update existing initial data with customer names
UPDATE `t_MajorCustomer` SET `strName` = 'Sandra Müller' WHERE `idCustomer` = 1;
UPDATE `t_MajorCustomer` SET `strName` = 'Birgitt Schmidt' WHERE `idCustomer` = 2;
UPDATE `t_MajorCustomer` SET `strName` = 'Hans Becker' WHERE `idCustomer` = 3;

-- Optional: insert new customers with strName
INSERT INTO `t_MajorCustomer` (`strName`, `strAddress`, `strPhone`, `strEmail`) VALUES
  ('Maria Fischer', 'Bahnhofstraße 12, Stadtburg', '0123987654', 'maria@example.com'),
  ('Thomas Weber', 'Ringstraße 7, Dorfstadt', '0176123456', 'thomas@example.com');