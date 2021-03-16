/*
  Warnings:

  - You are about to drop the column `name` on the `OfferingCategory` table. All the data in the column will be lost.
  - Added the required column `category` to the `OfferingCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OfferingCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Business_ownerId_unique";

-- AlterTable
ALTER TABLE "OfferingCategory" DROP COLUMN "name",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
