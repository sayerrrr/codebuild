/*
  Warnings:

  - You are about to drop the column `title` on the `Business` table. All the data in the column will be lost.
  - Made the column `name` on table `Business` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "title",
ADD COLUMN     "tagline" TEXT,
ALTER COLUMN "name" SET NOT NULL;
