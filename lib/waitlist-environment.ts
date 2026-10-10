import { env } from 'cloudflare:workers';

export type EmailSendResult = { messageId?: string };

export type EmailBinding = {
  send(message: {
    to: string;
    from: string;
    replyTo?: string;
    subject: string;
    html?: string;
    text: string;
    headers?: Record<string, string>;
  }): Promise<EmailSendResult>;
};

export type WaitlistQueueMessage = { jobId: string };

export type WaitlistEnvironment = {
  WAITLIST_NOTIFY_EMAIL?: EmailBinding;
  WAITLIST_OUTBOUND_EMAIL?: EmailBinding;
  WAITLIST_EMAIL_QUEUE?: Queue<WaitlistQueueMessage>;
  WAITLIST_NOTIFY_TO?: string;
  WAITLIST_NOTIFY_FROM?: string;
  WAITLIST_EMAIL_FROM?: string;
  WAITLIST_JOB_SECRET?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_HOSTNAMES?: string;
};

export function getWaitlistEnvironment(): WaitlistEnvironment {
  return env as unknown as WaitlistEnvironment;
}
