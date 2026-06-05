/*
  Warnings:

  - Made the column `name` on table `walletmanagements` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `walletmanagements` MODIFY `name` VARCHAR(191) NOT NULL;
