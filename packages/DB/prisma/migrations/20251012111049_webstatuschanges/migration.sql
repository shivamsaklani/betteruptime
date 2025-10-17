/*
  Warnings:

  - The values [unkown] on the enum `webstatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."eventlevel" AS ENUM ('low', 'mid', 'high', 'threat');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."webstatus_new" AS ENUM ('up', 'down', 'degraded');
ALTER TABLE "public"."WebsiteTick" ALTER COLUMN "status" TYPE "public"."webstatus_new" USING ("status"::text::"public"."webstatus_new");
ALTER TYPE "public"."webstatus" RENAME TO "webstatus_old";
ALTER TYPE "public"."webstatus_new" RENAME TO "webstatus";
DROP TYPE "public"."webstatus_old";
COMMIT;

-- CreateTable
CREATE TABLE "public"."WebEvents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" "public"."eventlevel" NOT NULL,
    "website_id" TEXT NOT NULL,
    "duration" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebEvents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."WebEvents" ADD CONSTRAINT "WebEvents_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "public"."Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
