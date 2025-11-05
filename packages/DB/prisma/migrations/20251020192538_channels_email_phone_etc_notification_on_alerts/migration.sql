-- DropForeignKey
ALTER TABLE "public"."Region" DROP CONSTRAINT "Region_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."WebEvents" DROP CONSTRAINT "WebEvents_website_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Website" DROP CONSTRAINT "Website_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."WebsiteTick" DROP CONSTRAINT "WebsiteTick_region_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."WebsiteTick" DROP CONSTRAINT "WebsiteTick_website_id_fkey";

-- CreateTable
CREATE TABLE "public"."Channels" (
    "id" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "channelDetails" TEXT NOT NULL,
    "level" "public"."eventlevel" NOT NULL,
    "website_id" TEXT NOT NULL,
    "monitor" BOOLEAN NOT NULL DEFAULT true,
    "lastSent" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Channels_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Website" ADD CONSTRAINT "Website_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebEvents" ADD CONSTRAINT "WebEvents_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "public"."Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Region" ADD CONSTRAINT "Region_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebsiteTick" ADD CONSTRAINT "WebsiteTick_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "public"."Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebsiteTick" ADD CONSTRAINT "WebsiteTick_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "public"."Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Channels" ADD CONSTRAINT "Channels_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "public"."Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
