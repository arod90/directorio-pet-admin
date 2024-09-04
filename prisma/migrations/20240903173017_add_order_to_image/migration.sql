/*
  Warnings:

  - Added the required column `order` to the `BlogImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BlogImage` ADD COLUMN `order` INTEGER NOT NULL;
