CREATE INDEX "unshortened_url_idx" ON "urls" USING btree ("unshortened_url");--> statement-breakpoint
CREATE UNIQUE INDEX "slug_idx" ON "urls" USING btree ("slug");