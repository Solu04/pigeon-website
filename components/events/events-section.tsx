import { EventStream } from './event-stream';
import { WaitlistButton } from '@/components/waitlist/waitlist-button';

const events = [
  ['fifa', 'FIFA World Cup'], ['uefa', 'UEFA'], ['premier-league', 'Premier League'],
  ['afcon', 'AFCON'], ['grammy', 'Grammy Awards'], ['formula-one', 'Formula 1'],
  ['wwe', 'WWE'], ['bbnaija', 'BBNaija'], ['nba', 'NBA Finals'],
  ['elections', 'World Elections'], ['headies', 'Headies'], ['tech', 'Tech & Science'],
] as const;

export function EventsSection() {
  return <section className="events-section" aria-labelledby="events-heading">
    <div className="site-container events-layout">
      <EventStream>
        <ul className="events-list">
          {events.map(([id,label],index)=><li key={id} className="event-row" style={{transform:`translate(-${Math.round(100 * Math.abs(2 * index / 12 - 1))}px, ${index * 63}px)`}}>
            <span>{label}</span><img src={'/images/events/'+id+(['fifa','uefa','premier-league'].includes(id)?'.svg':'.png')} width={52} height={52} alt=""/>
          </li>)}
        </ul>
      </EventStream>
      <div className="events-copy">
        <h2 id="events-heading">World’s biggest<br/>events. One place.</h2>
        <p>From sports and politics to entertainment and finance, trade the events shaping the world.</p>
        <WaitlistButton compact/>
      </div>
    </div>
  </section>;
}
