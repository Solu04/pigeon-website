import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { WaitlistProvider } from '@/components/waitlist/waitlist-provider';
import { FaqSection } from '@/components/landing/faq-section';
import { Footer } from '@/components/landing/footer';

export const metadata: Metadata = {
  title: 'How Pigeon Arena Works',
  description: 'Understand Pigeon Arena contracts, market pricing, trading positions, outcome resolution, multi-choice markets, and fees.',
  openGraph: { title:'How Pigeon Arena Works', description:'Understand Pigeon Arena contracts, pricing, market resolution, and fees.', images:[{url:'/images/meta/opengraph.png',width:2400,height:1260,alt:'Pigeon Arena'}] },
  twitter: { card:'summary_large_image', title:'How Pigeon Arena Works', description:'Understand Pigeon Arena contracts, pricing, market resolution, and fees.', images:['/images/meta/opengraph.png'] },
};

export default function Operations() {
  return <WaitlistProvider>
    <main className="operations-page">
      <SiteHeader currentPage="operations" />
      <header className="operations-intro site-container">
        <p className="operations-eyebrow">Company</p>
        <h1 className="landing-display">Operations</h1>
        <p className="operations-summary">Pigeon Arena runs on simple market-based contracts that let users participate in real-world outcomes in a structured way.</p>
      </header>
      <div className="operations-content site-container">
        <div className="operations-reading-column">
          <section aria-labelledby="contracts-heading">
            <h2 id="contracts-heading">Contract system</h2>
            <p>Every market on Pigeon Arena is made up of standardized units called contracts. Each contract has a fixed base value of ₦100.</p>
            <p>When you participate in a market, you are not placing a bet on an outcome directly. Instead, you are buying contracts tied to a specific outcome in that market.</p>
            <p>For example, in a market like <strong><em>“Will Team A win the match?”</em></strong> or <strong><em>“Which candidate will win the election?”</em></strong>, each possible outcome has its own set of contracts.</p>
          </section>
          <section aria-labelledby="pricing-heading">
            <h2 id="pricing-heading">How pricing works</h2>
            <p>Contract prices fluctuate between <strong>₦0 and ₦100</strong>, and directly represent the <strong>market-implied probability</strong> of that outcome happening.</p>
            <ul><li>A price of <strong>₦20</strong> = roughly <strong>20% probability</strong></li><li>A price of <strong>₦65</strong> = roughly <strong>65% probability</strong></li><li>A price of <strong>₦100</strong> = roughly <strong>100% probability (certainty)</strong></li></ul>
            <p>Prices move up when users buy a contract (belief increases), and move down when users sell (belief decreases or weakens).</p>
          </section>
          <section aria-labelledby="participation-heading">
            <h2 id="participation-heading">What users are doing</h2>
            <p>Users are essentially doing three things:</p>
            <ul><li>Buying contracts when they believe an outcome is more likely than the current price suggests</li><li>Selling contracts when they believe the market is overestimating an outcome</li><li>Updating positions as new information changes public sentiment</li></ul>
            <p>So the product is not “guessing outcomes” — it is <strong>trading belief about outcomes.</strong></p>
          </section>
          <section aria-labelledby="resolution-heading">
            <h2 id="resolution-heading">What happens at resolution</h2>
            <p>When the real-world event ends:</p>
            <ul><li>The correct outcome settles at <strong>₦100</strong></li><li>All other outcomes settle at <strong>₦0</strong></li></ul>
            <p>This creates a clean payoff system based on which belief turned out to be correct.</p>
            <h3>Simple mental model</h3>
            <p>A clean way to think about it is:</p>
            <p>Each contract is a probability token priced from <strong>₦0–₦100</strong> that represents how likely the crowd believes an outcome is.</p>
          </section>
          <section aria-labelledby="multi-choice-heading">
            <h2 id="multi-choice-heading">Multi-choice markets</h2>
            <p>Instead of limiting markets to simple yes-or-no outcomes, Pigeon Arena supports multi-choice markets.</p>
            <p>In a multi-choice market, users select from several possible outcomes within a single unified market. Each option competes within the same pool, and prices adjust based on demand and belief. This allows more complex real-world events — like elections, sports results, or cultural outcomes — to be represented more accurately.</p>
            <p>Users can enter or exit positions at any time by buying or selling contracts tied to their chosen outcome.</p>
          </section>
          <section aria-labelledby="fees-heading">
            <h2 id="fees-heading">Fees</h2>
            <p>Pigeon Arena applies a simple and transparent fee structure:</p>
            <ul><li>A <strong>1% fee is charged when buying contracts</strong></li><li>A <strong>1% fee is charged when selling contracts</strong></li></ul>
            <p>These fees help to maintain the platform, support liquidity, and ensure continuous market stability while keeping participation accessible and low-cost.</p>
          </section>
          <section aria-labelledby="overview-heading">
            <h2 id="overview-heading">Overview</h2>
            <p>Instead of passively consuming news and opinions, users express conviction, track shifting sentiment, and gain insight into what people collectively believe about future outcomes — creating a real-time layer of public information.</p>
            <p>Built for the modern internet, Pigeon Arena expands participation beyond traditional betting platforms, offering a broader, more social way to understand the world as it unfolds.</p>
          </section>
        </div>
      </div>
      <FaqSection />
    </main>
    <Footer />
  </WaitlistProvider>;
}
