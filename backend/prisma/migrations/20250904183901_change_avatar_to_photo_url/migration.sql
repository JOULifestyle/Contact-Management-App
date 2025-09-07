/*
  Warnings:

  - You are about to drop the column `avatar` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Contact" DROP COLUMN "avatar",
ADD COLUMN     "photoUrl" TEXT;
