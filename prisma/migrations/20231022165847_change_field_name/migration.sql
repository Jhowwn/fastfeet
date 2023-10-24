/*
  Warnings:

  - You are about to drop the column `user_id` on the `delivery` table. All the data in the column will be lost.
  - Added the required column `courier_id` to the `delivery` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "delivery" DROP CONSTRAINT "delivery_user_id_fkey";

-- AlterTable
ALTER TABLE "delivery" DROP COLUMN "user_id",
ADD COLUMN     "courier_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "delivery" ADD CONSTRAINT "delivery_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
