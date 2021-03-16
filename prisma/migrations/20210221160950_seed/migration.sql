/*
  Warnings:

  - You are about to drop the column `dateResetPasswordRequest` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "dateResetPasswordRequest",
ADD COLUMN     "resetPasswordExpiry" TIMESTAMP(3);
