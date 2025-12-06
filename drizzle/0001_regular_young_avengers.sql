CREATE TABLE `submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` varchar(64) NOT NULL,
	`data` text NOT NULL,
	`status` enum('draft','submitted') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`submittedAt` timestamp,
	CONSTRAINT `submissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `submissions_token_unique` UNIQUE(`token`)
);
