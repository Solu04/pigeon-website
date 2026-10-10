import { firstNameFromName } from '@/lib/waitlist-security';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function emailShell(content: string) {
  return `<!doctype html><html><body style="margin:0;background:#f4f1eb;color:#111;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden">Welcome to Pigeon Arena.</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1eb"><tr><td align="center" style="padding:32px 16px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border-radius:24px"><tr><td style="padding:40px 32px;font-size:17px;line-height:1.55">${content}</td></tr></table><p style="margin:18px 0 0;color:#68625c;font-size:12px">Pigeon Arena · Move With The Flock.</p></td></tr></table></body></html>`;
}

function paragraphs(lines: string[]) {
  return lines.map((line) => line ? `<p style="margin:0 0 20px">${line}</p>` : '<div style="height:2px"></div>').join('');
}

export function verificationEmail(input: { name: string | null; verifyUrl: string }) {
  const firstName = firstNameFromName(input.name);
  const safeName = escapeHtml(firstName);
  const safeUrl = escapeHtml(input.verifyUrl);
  const text = [
    `Hello, ${firstName}`,
    '',
    'One quick step: confirm your email to secure your place on the Pigeon Arena waitlist.',
    '',
    'Only verified signups are counted toward the first 50 reward spots.',
    '',
    `Confirm your email: ${input.verifyUrl}`,
    '',
    'This link expires in 24 hours.',
    '',
    '— Pigeon Arena',
  ].join('\n');
  const html = emailShell([
    `<p style="margin:0 0 20px">Hello, ${safeName}</p>`,
    '<p style="margin:0 0 20px">One quick step: confirm your email to secure your place on the Pigeon Arena waitlist.</p>',
    '<p style="margin:0 0 24px">Only verified signups are counted toward the first 50 reward spots.</p>',
    `<p style="margin:0 0 24px"><a href="${safeUrl}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#ff6257;color:#111;text-decoration:none;font-weight:700">Confirm my email</a></p>`,
    '<p style="margin:0 0 20px;color:#68625c;font-size:14px">This link expires in 24 hours.</p>',
    '<p style="margin:0">— Pigeon Arena</p>',
  ].join(''));
  return { subject: 'Confirm your Pigeon Arena waitlist spot', text, html };
}

export function welcomeEmail(input: { name: string | null; rewardReserved: boolean }) {
  const firstName = firstNameFromName(input.name);
  const common = [
    `Hello, ${firstName}`,
    '',
    'You’re in! 🎉',
    '',
  ];
  if (input.rewardReserved) {
    common.push(
      'You made the cut. Your spot is secured, and we’ve reserved ₦1,000 in seed capital for your Pigeon wallet to start predicting on day one.',
      '',
    );
  }
  common.push(
    'Welcome to Pigeon Arena — prediction markets, made social.',
    '',
    'Pigeon is a place to talk about what’s happening, share what you think, see what everyone else thinks, and trade on the outcomes you believe in.',
    '',
    'We’re still building.',
    '',
    'And since you’re here early, you’ll be among the first to know when Pigeon Arena is ready to fly.',
    '',
    'Move With The Flock.',
    '',
    '— Pigeon Arena',
  );
  const safeLines = common.map((line) => escapeHtml(line));
  return {
    subject: input.rewardReserved ? 'You made the cut — welcome to Pigeon Arena' : 'You’re in — welcome to Pigeon Arena',
    text: common.join('\n'),
    html: emailShell(paragraphs(safeLines)),
  };
}
