-- CreateTable
CREATE TABLE `incomes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DECIMAL(15, 2) NOT NULL,
    `descrption` TEXT NOT NULL,
    `transaction_date` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL DEFAULT 'system',
    `wallet_management_id` INTEGER NOT NULL,

    INDEX `income_wallet_management_id_fkey`(`wallet_management_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `incomes` ADD CONSTRAINT `incomes_wallet_management_id_fkey` FOREIGN KEY (`wallet_management_id`) REFERENCES `wallet_managements`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
