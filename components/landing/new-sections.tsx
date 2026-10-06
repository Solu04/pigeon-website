import { ViewAnimation, Reveal } from './view-animation';
import { SocialCards } from './social-cards';
import { FaqSection } from './faq-section';

export function NewSections() {
  return <>
    <SocialCards />
    <section className="rewards-section site-container" aria-labelledby="rewards-heading">
      <header className="rewards-heading"><h2 id="rewards-heading" className="landing-display">Be among the first</h2><p><strong>Early supporters get rewarded.</strong> The first 50 people to join the waitlist will receive ₦1,000 in their Pigeon wallet to start trading when we launch.</p></header>
      <div className="rewards-grid">
        <article className="reward-feature reward-feature--topics"><h3>Built for<br/>everyone.</h3><p>Whether you’re into football, elections, crypto or entertainment</p><ViewAnimation className="reward-topics-art" src="/images/sections/topic-pills.svg" width={329} height={442} alt="Topics including football, crypto, elections, entertainment, economics, tech and science"/></article>
        <article className="reward-feature reward-feature--opinions"><h3>Real<br/>opinions.</h3><p>Markets move because people believe.</p><ViewAnimation className="reward-opinions-art" src="/images/sections/opinion-bars.svg" width={329} height={216} alt="The crowd’s Yes, No and Undecided positions"/></article>
        <article className="reward-feature reward-feature--early"><h3>Be<br/>early.</h3><p>Join Pigeon Arena to see what the world currently believes in.</p><ViewAnimation className="reward-status-art" src="/images/sections/waitlist-progress-synced-smooth.svg" width={289} height={157} alt="Illustration of early-access waitlist progress"/></article>
      </div>
    </section>
    <section className="fair-section site-container" aria-labelledby="fair-heading">
      <h2 id="fair-heading" className="landing-display">Designed for<br/>fair markets.</h2>
      <Reveal className="fair-grid">{[
        ['Transparent Markets','Every trade updates prices publicly.'],
        ['Fast Execution','Orders execute instantly.'],
        ['Smart Resolution','Markets settle after verified outcomes.'],
        ['Fair payouts','Get paid based on the outcome you backed.'],
      ].map(([title,description],index)=><article className="fair-card" key={title}><h3>{title}</h3><p>{description}</p><img src={'/images/sections/fair-market-'+(index+1)+'.png'} width={190} height={397} alt={title+' in the Pigeon app'} loading="lazy"/></article>)}</Reveal>
    </section>
    <FaqSection />
  </>;
}
