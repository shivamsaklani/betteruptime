/*
  Warnings:

  - The primary key for the `WebsiteTick` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "WebsiteTick" DROP CONSTRAINT "WebsiteTick_pkey",
ADD CONSTRAINT "WebsiteTick_pkey" PRIMARY KEY ("id", "createdAt");
