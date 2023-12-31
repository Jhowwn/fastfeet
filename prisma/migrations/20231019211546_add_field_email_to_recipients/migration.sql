/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `recipients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `recipients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipients" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "recipients_email_key" ON "recipients"("email");
