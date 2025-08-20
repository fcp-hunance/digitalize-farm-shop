-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server-Version:               10.4.32-MariaDB
-- OS:                           Win64
-- HeidiSQL Version:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Create database
CREATE DATABASE IF NOT EXISTS `green`
  /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `green`;

-- Base tables without dependencies
CREATE TABLE IF NOT EXISTS `t_majorcustomer` (
  `CustomerID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Address` varchar(255) NOT NULL,
  `Phone` varchar(20) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`CustomerID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_person` (
  `PersonID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PersonID`),
  KEY `name_index` (`LastName`,`FirstName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_productgroup` (
  `GroupID` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `GroupName` varchar(100) NOT NULL,
  PRIMARY KEY (`GroupID`),
  UNIQUE KEY `GroupName` (`GroupName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_unit` (
  `UnitID` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `Unit` varchar(50) NOT NULL,
  PRIMARY KEY (`UnitID`),
  UNIQUE KEY `Unit` (`Unit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_invoice` (
  `InvoiceID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `InvoiceDate` date NOT NULL,
  `IsPaid` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`InvoiceID`),
  KEY `idx_invoice_date` (`InvoiceDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_vat` (
  `VATID` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `TaxRate` decimal(5,2) NOT NULL,
  `ValidFrom` date NOT NULL,
  `ValidUntil` date DEFAULT NULL,
  PRIMARY KEY (`VATID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dependent tables
CREATE TABLE IF NOT EXISTS `t_order` (
  `OrderID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `OrderDate` date NOT NULL,
  `CustomerID` int(10) unsigned NOT NULL,
  `TotalWeight` int(11) DEFAULT NULL,
  PRIMARY KEY (`OrderID`),
  KEY `CustomerID` (`CustomerID`),
  CONSTRAINT `t_order_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `t_majorcustomer` (`CustomerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_deliverynote` (
  `DeliveryNoteID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `DeliveryDate` date NOT NULL,
  `ReceiptDate` date DEFAULT NULL,
  `OrderID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`DeliveryNoteID`),
  KEY `OrderID` (`OrderID`),
  KEY `idx_delivery_date` (`DeliveryDate`),
  CONSTRAINT `t_deliverynote_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `t_order` (`OrderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_invoice_deliverynote` (
  `LinkID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `InvoiceID` int(10) unsigned NOT NULL,
  `DeliveryNoteID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`LinkID`),
  UNIQUE KEY `InvoiceID` (`InvoiceID`,`DeliveryNoteID`),
  KEY `DeliveryNoteID` (`DeliveryNoteID`),
  CONSTRAINT `t_invoice_deliverynote_ibfk_1` FOREIGN KEY (`InvoiceID`) REFERENCES `t_invoice` (`InvoiceID`),
  CONSTRAINT `t_invoice_deliverynote_ibfk_2` FOREIGN KEY (`DeliveryNoteID`) REFERENCES `t_deliverynote` (`DeliveryNoteID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_product` (
  `ProductID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ProductName` varchar(255) NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `GroupID` smallint(5) unsigned DEFAULT NULL,
  `UnitID` smallint(5) unsigned DEFAULT NULL,
  `StockLevel` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ProductID`),
  KEY `GroupID` (`GroupID`),
  KEY `UnitID` (`UnitID`),
  CONSTRAINT `t_product_ibfk_1` FOREIGN KEY (`GroupID`) REFERENCES `t_productgroup` (`GroupID`),
  CONSTRAINT `t_product_ibfk_2` FOREIGN KEY (`UnitID`) REFERENCES `t_unit` (`UnitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_product_order` (
  `ProductID` int(10) unsigned NOT NULL,
  `OrderID` int(10) unsigned NOT NULL,
  `Quantity` int(11) NOT NULL,
  PRIMARY KEY (`ProductID`,`OrderID`),
  KEY `OrderID` (`OrderID`),
  CONSTRAINT `t_product_order_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `t_product` (`ProductID`),
  CONSTRAINT `t_product_order_ibfk_2` FOREIGN KEY (`OrderID`) REFERENCES `t_order` (`OrderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `t_user` (
  `UserID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PersonID` int(10) unsigned DEFAULT NULL,
  `Username` varchar(30) NOT NULL,
  `PasswordHash` char(60) NOT NULL,
  `PIN` char(97) DEFAULT NULL,
  `Role` varchar(30) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `PersonID` (`PersonID`),
  CONSTRAINT `t_user_ibfk_1` FOREIGN KEY (`PersonID`) REFERENCES `t_person` (`PersonID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Restore settings
/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
