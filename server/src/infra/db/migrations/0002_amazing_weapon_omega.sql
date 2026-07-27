ALTER TABLE "shortened_urls" RENAME TO "urls";--> statement-breakpoint
ALTER TABLE "urls" DROP CONSTRAINT "shortened_urls_slug_unique";--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_slug_unique" UNIQUE("slug");