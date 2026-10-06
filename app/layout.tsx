import type { Metadata } from 'next';
import './globals.css';
import {HeadingRevealController} from '@/components/heading-reveal-controller';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pigeon-arena.hamza-logs.workers.dev'),
  title: { default: 'Pigeon Arena — Social Prediction Markets', template: '%s | Pigeon Arena' },
  description: 'Predict real-world events, back your position, join conversations, and see what the crowd believes on Pigeon Arena.',
  icons: { icon: [{url:'/favicon-light.png?v=20260928',type:'image/png',media:'(prefers-color-scheme: light)'},{url:'/favicon-dark.png?v=20260928',type:'image/png',media:'(prefers-color-scheme: dark)'}], shortcut: [{url:'/favicon-dark.png?v=20260928',type:'image/png'}], apple: [{url:'/webclip.png',type:'image/png'}] },
};
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="en"><body><HeadingRevealController/>{children}</body></html>; }
