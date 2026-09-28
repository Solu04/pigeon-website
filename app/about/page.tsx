import type {Metadata} from 'next';
import {SiteHeader} from '@/components/site-header';
import {WaitlistProvider} from '@/components/waitlist/waitlist-provider';
import {WaitlistButton} from '@/components/waitlist/waitlist-button';
import {FaqSection} from '@/components/landing/faq-section';
import {Footer} from '@/components/landing/footer';
import {TeamMarquee} from '@/components/landing/team-marquee';
import {AboutRevealController} from '@/components/landing/about-reveal-controller';
import {getRequestOrigin,getSocialImage} from '@/lib/request-origin';
export async function generateMetadata():Promise<Metadata>{const origin=await getRequestOrigin();const image=getSocialImage(origin);return{title:'About',description:'Learn how Pigeon Arena turns predictions, public sentiment, and community conversation into a social way to understand what happens next.',openGraph:{title:'About Pigeon Arena',description:'Discover the mission, vision, and people behind Pigeon Arena.',url:`${origin}/about`,siteName:'Pigeon Arena',type:'website',images:[{url:image,width:2400,height:1260,alt:'Pigeon Arena'}]},twitter:{card:'summary_large_image',title:'About Pigeon Arena',description:'Discover the mission, vision, and people behind Pigeon Arena.',images:[image]}};}
export default function About(){
 return <WaitlistProvider><main className="about-page">
 <AboutRevealController/>
 <div className="about-pink"><SiteHeader light/>
 <section className="about-intro site-container"><div className="about-reveal about-load-reveal"><p className="about-eyebrow">Company</p><h1 className="landing-display">About<br/>Pigeon Arena</h1></div><div className="about-copy-card about-reveal about-load-reveal about-load-reveal-delayed"><p>Pigeon Arena is a social information platform where people engage with real-world events through both interactive prediction markets and a social feed. It combines forecasting, public sentiment, and community discussion, allowing users to express opinions, track collective belief, participate in structured markets across culture, sports, entertainment, politics, and global events.</p></div></section>
 <section className="about-statement site-container"><h2 className="landing-display about-reveal">What is Pigeon’s<br/>mission?</h2><div className="about-copy-card about-reveal"><p>We believe markets are more than financial tools - they are expressions of collective belief. Pigeon Arena is building a platform where people can participate in real-time markets around the world’s events, conversations, and trends, creating a new form of interactive information and sentiment for the modern internet.</p><a href="/operations" className="about-operate">How we operate <span aria-hidden="true">→</span></a></div></section>
 <section className="about-statement site-container"><h2 className="landing-display about-reveal">What is Pigeon’s<br/>vision?</h2><div className="about-copy-card about-reveal"><p>Pigeon Arena’s vision is a world where markets become a core way people understand real-world events and collective belief. By making public sentiment visible and interactive, we aim to create a new layer of the internet where information is not just consumed, but continuously shaped by participation across culture, sports, entertainment, politics, and global events.</p></div></section>
 <TeamMarquee/>
 <section className="about-invite"><div className="about-invite-card about-reveal"><div className="about-invite-copy"><h2>Join the Flock!</h2><p>Early supporters get rewarded. The first 50 people to join the waitlist will receive ₦1,000 in their Pigeon wallet to start trading when we launch.</p><WaitlistButton compact/></div><div className="about-sticker-card" aria-hidden="true">{['football_match_sticker_badge','55_yes_blue_burst_sticker','hot_take_comic_sticker','live_market_trend_sticker','crowd_says_yes_sticker_badge','join_the_flock_sticker_badge'].map((name,i)=><img key={name} className={'about-sticker about-sticker-'+i} src={'/images/stickers/'+name+'.png'} width={180} height={180} alt=""/>)}</div></div></section>
 </div><FaqSection/></main><Footer/></WaitlistProvider>;
}
