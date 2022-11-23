CREATE TABLE `Test_Schmea`.`spacecraft` (
  `pkey` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `constellation` VARCHAR(45) NULL,
  `rx` DOUBLE NULL,
  `ry` DOUBLE NULL,
  `rz` DOUBLE NULL,
  `vx` DOUBLE NULL,
  `vy` DOUBLE NULL,
  `vz` DOUBLE NULL,
  PRIMARY KEY (`pkey`),
  UNIQUE INDEX `pkey_UNIQUE` (`pkey` ASC))
COMMENT = 'Spacecraft table from Spacecraft Module version 1';