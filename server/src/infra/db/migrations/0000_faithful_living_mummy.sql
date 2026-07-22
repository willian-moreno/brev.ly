CREATE TABLE "shortened_urls" (
	"id" text PRIMARY KEY NOT NULL,
	"unshortened_url" text NOT NULL,
	"slug" text NOT NULL,
	"total_visits" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shortened_urls_slug_unique" UNIQUE("slug")
);
