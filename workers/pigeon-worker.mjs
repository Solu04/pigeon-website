import application from './index.js';

function internalRequest(path, body, environment) {
  const origin = environment.PIGEON_SITE_URL || 'https://pigeonarena.com';
  return new Request(new URL(path, origin), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-pigeon-job-secret': environment.WAITLIST_JOB_SECRET || '',
    },
    body: JSON.stringify(body),
  });
}

async function callInternal(path, body, environment, context) {
  return application.fetch(internalRequest(path, body, environment), environment, context);
}

const worker = {
  fetch: application.fetch.bind(application),
  async queue(batch, environment, context) {
    for (const message of batch.messages) {
      try {
        const response = await callInternal('/api/internal/waitlist-email', message.body, environment, context);
        if (response.ok) message.ack();
        else message.retry({ delaySeconds: 60 });
      } catch (error) {
        console.error('Waitlist queue dispatch failed', error);
        message.retry({ delaySeconds: 60 });
      }
    }
  },
  async scheduled(_controller, environment, context) {
    context.waitUntil((async () => {
      const response = await callInternal('/api/internal/waitlist-sweep', {}, environment, context);
      if (!response.ok) console.error('Waitlist email sweep failed', response.status, await response.text());
    })());
  },
};

export default worker;
