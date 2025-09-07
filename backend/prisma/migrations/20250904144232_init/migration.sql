/*
  Warnings:

  - Added the required column `birthday` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Contact" ADD COLUMN     "birthday" TEXT NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "company" TEXT NOT NULL;
