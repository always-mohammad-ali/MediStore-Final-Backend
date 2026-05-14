/*
  Warnings:

  - You are about to drop the column `medicineId` on the `orders` table. All the data in the column will be lost.
  - Made the column `userId` on table `reviews` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_medicineId_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "medicineId";

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "parentId" TEXT,
ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Order-Items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order-Items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Order-Items_orderId_idx" ON "Order-Items"("orderId");

-- CreateIndex
CREATE INDEX "Order-Items_medicineId_idx" ON "Order-Items"("medicineId");

-- AddForeignKey
ALTER TABLE "Order-Items" ADD CONSTRAINT "Order-Items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order-Items" ADD CONSTRAINT "Order-Items_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "reviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;
