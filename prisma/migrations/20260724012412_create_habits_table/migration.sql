-- CreateTable
CREATE TABLE `financial_goals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `targetAmount` DECIMAL(15, 2) NOT NULL,
    `targetDate` DATE NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL DEFAULT 'system',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `financial_goal_savings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DECIMAL(15, 2) NOT NULL,
    `transaction_date` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL DEFAULT 'system',
    `description` TEXT NULL,
    `financial_goal_id` INTEGER NOT NULL,
    `wallet_management_id` INTEGER NOT NULL,

    INDEX `financial_goal_saving_goal_id_fkey`(`financial_goal_id`),
    INDEX `financial_goal_saving_wallet_management_id_fkey`(`wallet_management_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `habits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `frequency` VARCHAR(191) NOT NULL DEFAULT 'daily',
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL DEFAULT 'system',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `habit_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `habit_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT true,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL DEFAULT 'system',

    INDEX `habit_log_habit_id_fkey`(`habit_id`),
    UNIQUE INDEX `habit_logs_habit_id_date_key`(`habit_id`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `financial_goal_savings` ADD CONSTRAINT `financial_goal_savings_financial_goal_id_fkey` FOREIGN KEY (`financial_goal_id`) REFERENCES `financial_goals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `financial_goal_savings` ADD CONSTRAINT `financial_goal_savings_wallet_management_id_fkey` FOREIGN KEY (`wallet_management_id`) REFERENCES `wallet_managements`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `habit_logs` ADD CONSTRAINT `habit_logs_habit_id_fkey` FOREIGN KEY (`habit_id`) REFERENCES `habits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
