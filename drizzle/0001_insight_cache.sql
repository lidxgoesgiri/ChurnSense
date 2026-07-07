CREATE TABLE "insight_cache" (
	"cache_key" varchar(512) PRIMARY KEY NOT NULL,
	"insight" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_insight_expires" ON "insight_cache" USING btree ("expires_at");