"use client";
import { useEffect, useState } from 'react';
import { useWaitlist } from './waitlist/waitlist-provider';
export function SiteHeader({light=false,currentPage=light?'about':'home'}:{light?:boolean;currentPage?:'home'|'about'|'operations'}){
 const {setDialog}=useWaitlist();
 const [menuOpen,setMenuOpen]=useState(false);
 useEffect(()=>{
  if(!menuOpen)return;
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const closeOnEscape=(event:KeyboardEvent)=>{if(event.key==='Escape')setMenuOpen(false)};
  window.addEventListener('keydown',closeOnEscape);
  return()=>{document.body.style.overflow=previousOverflow;window.removeEventListener('keydown',closeOnEscape)};
 },[menuOpen]);
 return <header className={'site-header'+(light?' site-header--light':'')+(menuOpen?' menu-open':'')}>
 <a className="brand" href="/" aria-label="Pigeon home"><img src="/images/logo.png" width="83" height="50" alt="Pigeon"/></a>
 <nav className="navigation" aria-label="Main navigation"><a href="/" aria-current={currentPage==='home'?'page':undefined}>Home</a><span aria-hidden="true"/><a href="/about" aria-current={currentPage==='about'?'page':undefined}>About</a></nav>
 <button className="header-cta" onClick={()=>setDialog('waitlist')}>Join Waitlist</button>
 <button className="mobile-menu-toggle" data-open={menuOpen||undefined} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen?'Close menu':'Open menu'} onClick={()=>setMenuOpen(open=>!open)}><span/><span/></button>
 <nav id="mobile-navigation" className="mobile-navigation" data-open={menuOpen||undefined} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
  <a href="/" aria-current={currentPage==='home'?'page':undefined} onClick={()=>setMenuOpen(false)}>Home</a>
  <a href="/about" aria-current={currentPage==='about'?'page':undefined} onClick={()=>setMenuOpen(false)}>About</a>
  <a href="/operations" aria-current={currentPage==='operations'?'page':undefined} onClick={()=>setMenuOpen(false)}>Operations</a>
 </nav>
 </header>;
}
