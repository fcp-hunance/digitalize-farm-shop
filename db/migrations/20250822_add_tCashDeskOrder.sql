-- Migration: Add CashDeskOrder and Product_CashDeskOrder tables

USE `Hofladen`;

-- Table for cash desk orders (transactions at POS)
CREATE TABLE IF NOT EXISTS `t_CashDeskOrder` (
  `idCashDeskOrder` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fkUser` INT(10) UNSIGNED NOT NULL,
  `decTotal` DECIMAL(10,2) NOT NULL,
  `dateCreated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idCashDeskOrder`),
  KEY `idx_CashDeskOrder_User` (`fkUser`),
  CONSTRAINT `fk_CashDeskOrder_User`
    FOREIGN KEY (`fkUser`) REFERENCES `t_User` (`idUser`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for linking products to a cash desk order
CREATE TABLE IF NOT EXISTS `t_Product_CashDeskOrder` (
  `idProductCashDeskOrder` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fkProduct` INT(10) UNSIGNED NOT NULL,
  `fkCashDeskOrder` INT(10) UNSIGNED NOT NULL,
  `intQuantity` INT(11) NOT NULL,
  PRIMARY KEY (`idProductCashDeskOrder`),
  KEY `idx_ProductCashDeskOrder_Product` (`fkProduct`),
  KEY `idx_ProductCashDeskOrder_Order` (`fkCashDeskOrder`),
  CONSTRAINT `fk_ProductCashDeskOrder_Product`
    FOREIGN KEY (`fkProduct`) REFERENCES `t_Product` (`idProduct`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_ProductCashDeskOrder_CashDeskOrder`
    FOREIGN KEY (`fkCashDeskOrder`) REFERENCES `t_CashDeskOrder` (`idCashDeskOrder`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
