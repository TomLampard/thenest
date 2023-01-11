/*
  Warnings:

  - Made the column `fileId` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Post` MODIFY `fileId` VARCHAR(191) NOT NULL,
    MODIFY `contentHtml` TEXT NULL;
