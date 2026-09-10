import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://pigeon-early-access-hero.hamzaataboh1.chatgpt.site'),
  title: { default: 'Pigeon Arena — Social Prediction Markets', template: '%s | Pigeon Arena' },
  description: 'Predict real-world events, back your position, join conversations, and see what the crowd believes on Pigeon Arena.',
  icons: { icon: [{url:'/favicon.png',type:'image/png'}], apple: [{url:'/webclip.png',type:'image/png'}] },
};
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
