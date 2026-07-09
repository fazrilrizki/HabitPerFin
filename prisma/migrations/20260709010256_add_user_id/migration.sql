-- AlterTable
ALTER TABLE `expense` ADD COLUMN `userId` VARCHAR(191) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `expense_categories` ADD COLUMN `userId` VARCHAR(191) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `wallet_managements` ADD COLUMN `userId` VARCHAR(191) NOT NULL DEFAULT 'system';
