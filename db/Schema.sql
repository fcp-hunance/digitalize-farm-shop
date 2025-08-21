-- Create database
CREATE DATABASE IF NOT EXISTS `Hofladen`
  /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `Hofladen`;

-- Base tables without dependencies
CREATE TABLE IF NOT EXISTS `t_MajorCustomer` (
  `idCustomer` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `strAddress` VARCHAR(255) NOT NULL,
  `strPhone` VARCHAR(30) NOT NULL,
  `strEmail` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idCustomer`),
  UNIQUE KEY `uq_MajorCustomer_Email` (`strEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_Person` (
  `idPerson` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `strFirstName` VARCHAR(50) NOT NULL,
  `strLastName` VARCHAR(50) NOT NULL,
  `strPhone` VARCHAR(30) DEFAULT NULL,
  `strAddress` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`idPerson`),
  KEY `idx_Person_Name` (`strLastName`,`strFirstName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_ProductGroup` (
  `idGroup` SMALLINT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `strGroupName` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idGroup`),
  UNIQUE KEY `uq_ProductGroup_Name` (`strGroupName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_Unit` (
  `idUnit` SMALLINT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `strUnit` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`idUnit`),
  UNIQUE KEY `uq_Unit_Name` (`strUnit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_Invoice` (
  `idInvoice` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `dateInvoiceDate` DATE NOT NULL,
  `boolIsPaid` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`idInvoice`),
  KEY `idx_Invoice_Date` (`dateInvoiceDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_Vat` (
  `idVAT` TINYINT(3) UNSIGNED NOT NULL AUTO_INCREMENT,
  `decTaxRate` DECIMAL(5,2) NOT NULL,
  `dateValidFrom` DATE NOT NULL,
  `dateValidUntil` DATE DEFAULT NULL,
  PRIMARY KEY (`idVAT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_Order` (
  `idOrder` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `dateOrderDate` DATE NOT NULL,
  `fkCustomer` INT(10) UNSIGNED NOT NULL,
  `decTotal` DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (`idOrder`),
  KEY `idx_Order_Customer` (`fkCustomer`),
  CONSTRAINT `fk_Order_Customer` FOREIGN KEY (`fkCustomer`) REFERENCES `t_MajorCustomer` (`idCustomer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_DeliveryNote` (
  `idDeliveryNote` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `dateDeliveryDate` DATE NOT NULL,
  `dateReceiptDate` DATE DEFAULT NULL,
  `fkOrder` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`idDeliveryNote`),
  KEY `idx_DeliveryNote_Order` (`fkOrder`),
  KEY `idx_DeliveryNote_Date` (`dateDeliveryDate`),
  CONSTRAINT `fk_DeliveryNote_Order` FOREIGN KEY (`fkOrder`) REFERENCES `t_Order` (`idOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_Invoice_DeliveryNote` (
  `idInvoiceDeliveryNote` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fkInvoice` INT(10) UNSIGNED NOT NULL,
  `fkDeliveryNote` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`idInvoiceDeliveryNote`),
  UNIQUE KEY `uq_Invoice_DeliveryNote` (`fkInvoice`,`fkDeliveryNote`),
  KEY `idx_InvoiceDeliveryNote_DeliveryNote` (`fkDeliveryNote`),
  CONSTRAINT `fk_InvoiceDeliveryNote_Invoice` FOREIGN KEY (`fkInvoice`) REFERENCES `t_Invoice` (`idInvoice`),
  CONSTRAINT `fk_InvoiceDeliveryNote_DeliveryNote` FOREIGN KEY (`fkDeliveryNote`) REFERENCES `t_DeliveryNote` (`idDeliveryNote`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_Product` (
  `idProduct` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `strProductName` VARCHAR(255) NOT NULL,
  `decPrice` DECIMAL(10,2) NOT NULL,
  `fkGroup` SMALLINT(5) UNSIGNED DEFAULT NULL,
  `fkUnit` SMALLINT(5) UNSIGNED DEFAULT NULL,
  `intStock` INT(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`idProduct`),
  KEY `idx_Product_Group` (`fkGroup`),
  KEY `idx_Product_Unit` (`fkUnit`),
  CONSTRAINT `fk_Product_Group` FOREIGN KEY (`fkGroup`) REFERENCES `t_ProductGroup` (`idGroup`),
  CONSTRAINT `fk_Product_Unit` FOREIGN KEY (`fkUnit`) REFERENCES `t_Unit` (`idUnit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_Product_Order` (
  `idProductOrder` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fkProduct` INT(10) UNSIGNED NOT NULL,
  `fkOrder` INT(10) UNSIGNED NOT NULL,
  `intQuantity` INT(11) NOT NULL,
  PRIMARY KEY (`idProductOrder`),
  KEY `idx_ProductOrder_Product_Order` (`fkProduct`,`fkOrder`),
  CONSTRAINT `fk_ProductOrder_Product` FOREIGN KEY (`fkProduct`) REFERENCES `t_Product` (`idProduct`),
  CONSTRAINT `fk_ProductOrder_Order` FOREIGN KEY (`fkOrder`) REFERENCES `t_Order` (`idOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `t_User` (
  `idUser` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fkPerson` INT(10) UNSIGNED DEFAULT NULL,
  `strUsername` VARCHAR(30) NOT NULL,
  `strPasswordHash` CHAR(60) NOT NULL,
  `strPIN` CHAR(64) DEFAULT NULL,
  `strRole` ENUM('admin','cashier','warehouse') NOT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `uq_User_Username` (`strUsername`),
  UNIQUE KEY `uq_User_Person` (`fkPerson`),
  CONSTRAINT `fk_User_Person` FOREIGN KEY (`fkPerson`) REFERENCES `t_Person` (`idPerson`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

