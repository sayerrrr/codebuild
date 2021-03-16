-- CreateEnum
CREATE TYPE "OrderState" AS ENUM ('PAID', 'REFUNDED', 'PENDING');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "offeringId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "note" TEXT NOT NULL,
    "state" "OrderState" NOT NULL DEFAULT E'PENDING',

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD FOREIGN KEY ("offeringId") REFERENCES "Offering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
