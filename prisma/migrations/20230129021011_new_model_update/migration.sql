/*
  Warnings:

  - You are about to drop the column `postId` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `File_authorId_key` ON `File`;

-- DropIndex
DROP INDEX `File_authorId_postId_id_key` ON `File`;

-- DropIndex
DROP INDEX `Post_authorId_fileId_id_key` ON `Post`;

-- DropIndex
DROP INDEX `Post_authorId_key` ON `Post`;

-- AlterTable
ALTER TABLE `File` DROP COLUMN `postId`;

-- CreateIndex
CREATE INDEX `File_authorId_idx` ON `File`(`authorId`);

-- CreateIndex
CREATE UNIQUE INDEX `File_id_key` ON `File`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Post_id_key` ON `Post`(`id`);
