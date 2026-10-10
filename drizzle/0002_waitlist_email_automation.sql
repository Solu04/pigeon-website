ALTER TABLE `waitlist` ADD `email_verified_at` text;--> statement-breakpoint
ALTER TABLE `waitlist` ADD `verification_token_hash` text;--> statement-breakpoint
ALTER TABLE `waitlist` ADD `verification_expires_at` text;--> statement-breakpoint
ALTER TABLE `waitlist` ADD `reward_reserved` integer NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `waitlist` ADD `reward_position` integer;--> statement-breakpoint
ALTER TABLE `waitlist` ADD `email_status` text NOT NULL DEFAULT 'pending_verification';--> statement-breakpoint
ALTER TABLE `waitlist` ADD `email_sent_at` text;--> statement-breakpoint
ALTER TABLE `waitlist` ADD `email_message_id` text;--> statement-breakpoint
ALTER TABLE `waitlist` ADD `email_attempts` integer NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `waitlist` ADD `email_last_error` text;--> statement-breakpoint
ALTER TABLE `waitlist` ADD `email_updated_at` text;--> statement-breakpoint
ALTER TABLE `waitlist` ADD `verification_email_status` text NOT NULL DEFAULT 'queued';--> statement-breakpoint
ALTER TABLE `waitlist` ADD `verification_email_sent_at` text;--> statement-breakpoint
CREATE UNIQUE INDEX `waitlist_reward_position_unique` ON `waitlist` (`reward_position`);--> statement-breakpoint
CREATE UNIQUE INDEX `waitlist_verification_token_unique` ON `waitlist` (`verification_token_hash`);--> statement-breakpoint
CREATE TABLE `waitlist_email_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`kind` text NOT NULL,
	`status` text NOT NULL DEFAULT 'pending',
	`payload` text,
	`attempts` integer NOT NULL DEFAULT 0,
	`next_attempt_at` text NOT NULL,
	`message_id` text,
	`last_error` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`sent_at` text,
	FOREIGN KEY (`email`) REFERENCES `waitlist`(`email`) ON UPDATE no action ON DELETE cascade
);--> statement-breakpoint
CREATE UNIQUE INDEX `waitlist_email_jobs_email_kind_unique` ON `waitlist_email_jobs` (`email`,`kind`);--> statement-breakpoint
CREATE INDEX `waitlist_email_jobs_due_idx` ON `waitlist_email_jobs` (`status`,`next_attempt_at`);
