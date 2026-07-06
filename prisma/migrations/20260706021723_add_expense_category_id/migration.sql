/*
  Warnings:

  - Added the required column `expense_category_id` to the `expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `expense` ADD COLUMN `expense_category_id` INTEGER NOT NULL,
    MODIFY `transaction_date` DATE NOT NULL;

-- CreateIndex
CREATE INDEX `expense_expense_category_id_fkey` ON `expense`(`expense_category_id`);

-- AddForeignKey
ALTER TABLE `expense` ADD CONSTRAINT `expense_expense_category_id_fkey` FOREIGN KEY (`expense_category_id`) REFERENCES `expense_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
