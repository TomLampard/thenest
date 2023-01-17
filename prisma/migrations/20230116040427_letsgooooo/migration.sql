/*
  Warnings:

  - You are about to drop the column `userId` on the `Liked` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Liked` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Liked_userId_idx` ON `Liked`;

-- AlterTable
ALTER TABLE `Liked` DROP COLUMN `userId`,
    ADD COLUMN `authorId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Liked_authorId_idx` ON `Liked`(`authorId`);
