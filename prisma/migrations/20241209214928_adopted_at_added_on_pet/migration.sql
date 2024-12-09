/*
  Warnings:

  - Added the required column `adopted_at` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "adopted_at" TIMESTAMP(3) NOT NULL;
