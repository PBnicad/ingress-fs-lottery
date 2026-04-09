CREATE TABLE `lotteries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_url` text NOT NULL,
	`event_title` text NOT NULL,
	`seed` integer NOT NULL,
	`winner_count` integer NOT NULL,
	`agents` text NOT NULL,
	`winners` text NOT NULL,
	`created_at` text NOT NULL
);
