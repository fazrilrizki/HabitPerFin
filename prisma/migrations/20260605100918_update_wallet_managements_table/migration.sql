/*
  Warnings:

  - You are about to drop the `walletmanagements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `walletmanagements`;

-- CreateTable
CREATE TABLE `wallet_managements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `initial_balance` DECIMAL(15, 2) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
