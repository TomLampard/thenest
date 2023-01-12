/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `text` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Comment` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `text` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[likeId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fileId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentHtml` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likeId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentHtml` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userImage` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Comment_userId_idx` ON `Comment`;

-- DropIndex
DROP INDEX `Post_userId_idx` ON `Post`;

-- AlterTable
ALTER TABLE `Comment` DROP PRIMARY KEY,
    DROP COLUMN `text`,
    DROP COLUMN `userId`,
    ADD COLUMN `authorId` VARCHAR(191) NOT NULL,
    ADD COLUMN `content` TEXT NOT NULL,
    ADD COLUMN `contentHtml` TEXT NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `likeId` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Post` DROP COLUMN `text`,
    DROP COLUMN `userId`,
    ADD COLUMN `authorId` VARCHAR(191) NOT NULL,
    ADD COLUMN `content` TEXT NOT NULL,
    ADD COLUMN `contentHtml` TEXT NOT NULL,
    ADD COLUMN `hidden` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `title` VARCHAR(255) NOT NULL,
    MODIFY `fileId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `userImage` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Like`;

-- CreateTable
CREATE TABLE `Liked` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `commentId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Liked_postId_idx`(`postId`),
    INDEX `Liked_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Comment_likeId_key` ON `Comment`(`likeId`);

-- CreateIndex
CREATE INDEX `Comment_authorId_idx` ON `Comment`(`authorId`);

-- CreateIndex
CREATE INDEX `Comment_likeId_idx` ON `Comment`(`likeId`);

-- CreateIndex
CREATE UNIQUE INDEX `File_userId_key` ON `File`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Post_fileId_key` ON `Post`(`fileId`);

-- CreateIndex
CREATE INDEX `Post_authorId_idx` ON `Post`(`authorId`);

-- CreateIndex
CREATE FULLTEXT INDEX `Post_title_content_idx` ON `Post`(`title`, `content`);
