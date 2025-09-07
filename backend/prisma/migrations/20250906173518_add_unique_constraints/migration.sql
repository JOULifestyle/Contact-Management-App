/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contact_name_key" ON "public"."Contact"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "public"."Contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_phone_key" ON "public"."Contact"("phone");
