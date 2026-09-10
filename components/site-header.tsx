"use client";
import { useWaitlist } from './waitlist/waitlist-provider';
export function SiteHeader({light=false}:{light?:boolean}){
 const {setDialog}=useWaitlist();
 return <header className={'site-header'+(light?' site-header--light':'')}>
 <a className="brand" href="/" aria-label="Pigeon home"><img src="/images/logo.png" width="83" height="50" alt="Pigeon"/></a>
 <nav className="navigation" aria-label="Main navigation"><a href="/" aria-current={light?undefined:'page'}>Home</a><span aria-hidden="true"/><a href="/about" aria-current={light?'page':undefined}>About</a></nav>
 <button className="header-cta" onClick={()=>setDialog('waitlist')}>Join Waitlist</button></header>;
}
