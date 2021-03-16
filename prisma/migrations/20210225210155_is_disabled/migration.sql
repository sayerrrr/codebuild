-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "isDisabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Offering" ADD COLUMN     "isDisabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isDisabled" BOOLEAN NOT NULL DEFAULT false;
