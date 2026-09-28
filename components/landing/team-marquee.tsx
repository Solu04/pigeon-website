const names=['Dotadams','Isele Doubra','Okiefe Gift','Daniel Oyewole'];
export function TeamMarquee(){
 return <section className="about-team" aria-labelledby="team-heading"><h2 id="team-heading" className="landing-display about-reveal">The team</h2><p className="sr-only">{names.join(', ')}</p>
 <div className="about-reveal" aria-hidden="true">{[0,1,2].map(row=><div className="team-marquee-row" key={row}><div className="team-marquee-track">{[0,1].map(copy=><div className="team-marquee-copy" key={copy}>{names.map((_,i)=><span key={i}>{names[(i+row)%names.length]}</span>)}</div>)}</div></div>)}</div>
 </section>;
}
