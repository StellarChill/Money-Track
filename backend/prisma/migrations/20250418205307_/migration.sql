/*
  Warnings:

  - You are about to drop the column `typeId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `TransactionType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `isIncome` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_typeId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "typeId",
ADD COLUMN     "isIncome" BOOLEAN NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- DropTable
DROP TABLE "TransactionType";
