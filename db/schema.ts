import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
export const waitlist = sqliteTable('waitlist', {
  email: text('email').primaryKey(),
  createdAt: text('created_at').notNull(),
  name: text('name'),
  interests: text('interests'),
  launchAmount: text('launch_amount'),
  emailVerifiedAt: text('email_verified_at'),
  verificationTokenHash: text('verification_token_hash'),
  verificationExpiresAt: text('verification_expires_at'),
  rewardReserved: integer('reward_reserved').notNull().default(0),
  rewardPosition: integer('reward_position'),
  emailStatus: text('email_status').notNull().default('pending_verification'),
  emailSentAt: text('email_sent_at'),
  emailMessageId: text('email_message_id'),
  emailAttempts: integer('email_attempts').notNull().default(0),
  emailLastError: text('email_last_error'),
  emailUpdatedAt: text('email_updated_at'),
  verificationEmailStatus: text('verification_email_status').notNull().default('queued'),
  verificationEmailSentAt: text('verification_email_sent_at'),
}, (table) => [
  uniqueIndex('waitlist_reward_position_unique').on(table.rewardPosition),
  uniqueIndex('waitlist_verification_token_unique').on(table.verificationTokenHash),
]);

export const waitlistEmailJobs = sqliteTable('waitlist_email_jobs', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  kind: text('kind').notNull(),
  status: text('status').notNull().default('pending'),
  payload: text('payload'),
  attempts: integer('attempts').notNull().default(0),
  nextAttemptAt: text('next_attempt_at').notNull(),
  messageId: text('message_id'),
  lastError: text('last_error'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  sentAt: text('sent_at'),
}, (table) => [
  uniqueIndex('waitlist_email_jobs_email_kind_unique').on(table.email, table.kind),
]);
