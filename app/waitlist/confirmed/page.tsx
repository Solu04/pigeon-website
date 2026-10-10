import Link from 'next/link';

export default async function WaitlistConfirmedPage({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  const { result } = await searchParams;
  const valid = result === 'reward' || result === 'standard';
  return <main style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', padding: 24, background: '#101010', color: '#fff' }}>
    <section style={{ width: 'min(100%, 620px)', padding: '48px 28px', borderRadius: 28, background: '#222', textAlign: 'center' }}>
      <p style={{ margin: '0 0 16px', opacity: .7 }}>Pigeon Arena</p>
      <h1 className="landing-display" style={{ margin: '0 0 24px', fontSize: 'clamp(52px, 10vw, 92px)', lineHeight: .9 }}>
        {valid ? 'EMAIL VERIFIED' : 'LINK EXPIRED'}
      </h1>
      <p style={{ maxWidth: 480, margin: '0 auto 28px', fontSize: 18, lineHeight: 1.5 }}>
        {result === 'reward' && 'You made the first 50. Your ₦1,000 Pigeon wallet reward is reserved, and your welcome email is on its way.'}
        {result === 'standard' && 'Your place on the Pigeon Arena waitlist is confirmed, and your welcome email is on its way.'}
        {!valid && 'This verification link is invalid or has expired. Submit the waitlist form again to request a new link.'}
      </p>
      <Link href="/" className="form-submit" style={{ display: 'inline-flex', textDecoration: 'none' }}>Back to Pigeon</Link>
    </section>
  </main>;
}
