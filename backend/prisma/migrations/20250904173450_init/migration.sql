/*
  Warnings:

  - The `birthday` column on the `Contact` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Contact" ADD COLUMN     "avatar" TEXT,
DROP COLUMN "birthday",
ADD COLUMN     "birthday" TIMESTAMP(3),
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "company" DROP NOT NULL;
