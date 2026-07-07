CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_email" varchar(320) NOT NULL,
	"project_name" varchar(255) NOT NULL,
	"total_users" integer NOT NULL,
	"active_users" integer NOT NULL,
	"churned_users" integer NOT NULL,
	"monthly_revenue" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_owner_project" ON "projects" USING btree ("owner_email","project_name");--> statement-breakpoint
CREATE INDEX "idx_owner_created" ON "projects" USING btree ("owner_email","created_at");