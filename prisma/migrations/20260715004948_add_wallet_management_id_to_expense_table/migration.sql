-- AlterTable
ALTER TABLE `expense` ADD COLUMN `wallet_management_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `expense_wallet_management_id_fkey` ON `expense`(`wallet_management_id`);

-- AddForeignKey
ALTER TABLE `expense` ADD CONSTRAINT `expense_wallet_management_id_fkey` FOREIGN KEY (`wallet_management_id`) REFERENCES `wallet_managements`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
