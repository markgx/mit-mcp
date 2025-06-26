CREATE TABLE `mits` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`order` integer NOT NULL,
	`date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
