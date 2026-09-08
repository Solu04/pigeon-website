import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Pigeon — The world happens here', description: 'Prediction markets, made social. Join the Pigeon waitlist for early access.' };
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
