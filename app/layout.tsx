import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pigeon-arena.hamza-logs.workers.dev'),
  title: { default: 'Pigeon Arena — Social Prediction Markets', template: '%s | Pigeon Arena' },
  description: 'Predict real-world events, back your position, join conversations, and see what the crowd believes on Pigeon Arena.',
  icons: { icon: [{url:'/favicon-light.png',type:'image/png',media:'(prefers-color-scheme: light)'},{url:'/favicon-dark.png',type:'image/png',media:'(prefers-color-scheme: dark)'}], apple: [{url:'/webclip.png',type:'image/png'}] },
};
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
