ALTER TABLE `access_orders` ADD `access_type` text DEFAULT 'order' NOT NULL;--> statement-breakpoint
ALTER TABLE `access_orders` ADD `completed_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `access_orders` ADD `max_completions` integer;