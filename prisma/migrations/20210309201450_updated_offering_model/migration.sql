-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "offeringId" DROP NOT NULL;
