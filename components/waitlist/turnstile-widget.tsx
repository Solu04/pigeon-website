"use client";

import { useEffect, useRef, useState } from 'react';

type TurnstileApi = {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  remove(widgetId: string): void;
};

declare global { interface Window { turnstile?: TurnstileApi } }

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-pigeon-turnstile]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Turnstile failed to load')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.dataset.pigeonTurnstile = 'true';
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('Turnstile failed to load')), { once: true });
    document.head.appendChild(script);
  });
}

export function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let widgetId: string | undefined;
    async function render() {
      try {
        const [configResponse] = await Promise.all([fetch('/api/turnstile', { cache: 'no-store' }), loadTurnstileScript()]);
        if (!configResponse.ok) throw new Error('Turnstile configuration unavailable');
        const { siteKey } = await configResponse.json() as { siteKey?: string };
        if (cancelled || !siteKey || !containerRef.current || !window.turnstile) return;
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action: 'waitlist_signup',
          appearance: 'interaction-only',
          size: 'flexible',
          theme: 'dark',
          callback: (token: string) => { setError(false); onToken(token); },
          'expired-callback': () => onToken(''),
          'error-callback': () => { setError(true); onToken(''); },
        });
      } catch {
        if (!cancelled) { setError(true); onToken(''); }
      }
    }
    void render();
    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onToken]);

  return <div className="turnstile-field">
    <div ref={containerRef}/>
    {error && <p className="form-error" role="alert">Security check could not load. Check your connection and try again.</p>}
  </div>;
}
