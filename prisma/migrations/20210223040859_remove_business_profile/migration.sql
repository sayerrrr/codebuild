/*
  Warnings:

  - You are about to drop the `BusinessProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BusinessProfile" DROP CONSTRAINT "BusinessProfile_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Offering" DROP CONSTRAINT "Offering_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_senderId_fkey";

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "address" TEXT,
    "logoUrl" TEXT,
    "coverUrl" TEXT,
    "socialLinks" TEXT[],
    "phoneNumber" TEXT,
    "creditAmount" INTEGER NOT NULL,
    "creditScore" INTEGER NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "handle" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- DropTable
DROP TABLE "BusinessProfile";

-- CreateIndex
CREATE UNIQUE INDEX "Business.handle_unique" ON "Business"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Business_ownerId_unique" ON "Business"("ownerId");

-- AddForeignKey
ALTER TABLE "Business" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offering" ADD FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD FOREIGN KEY ("recipientId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD FOREIGN KEY ("senderId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
