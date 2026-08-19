CREATE TABLE `access_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_hash` text NOT NULL,
	`device_hash` text,
	`status` text DEFAULT 'active' NOT NULL,
	`activated_at` integer,
	`created_at` integer NOT NULL,
	`expires_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `access_orders_order_hash_unique` ON `access_orders` (`order_hash`);
--> statement-breakpoint
PRAGMA optimize;
