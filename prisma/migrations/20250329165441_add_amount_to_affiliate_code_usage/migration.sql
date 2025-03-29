/*
  Warnings:

  - Added the required column `amount` to the `AffiliateCodeUsage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AffiliateCodeUsage" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;
