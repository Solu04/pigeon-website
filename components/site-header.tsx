"use client";
import { useWaitlist } from './waitlist/waitlist-provider';
export function SiteHeader({light=false,currentPage=light?'about':'home'}:{light?:boolean;currentPage?:'home'|'about'|'operations'}){
 const {setDialog}=useWaitlist();
 return <header className={'site-header'+(light?' site-header--light':'')}>
 <a className="brand" href="/" aria-label="Pigeon home"><img src="/images/logo.png" width="83" height="50" alt="Pigeon"/></a>
 <nav className="navigation" aria-label="Main navigation"><a href="/" aria-current={currentPage==='home'?'page':undefined}>Home</a><span aria-hidden="true"/><a href="/about" aria-current={currentPage==='about'?'page':undefined}>About</a></nav>
 <button className="header-cta" onClick={()=>setDialog('waitlist')}>Join Waitlist</button></header>;
}
