"use client";
import { SiteHeader } from "@/components/site-header";
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useWaitlist } from '@/components/waitlist/waitlist-provider';
import { WaitlistButton } from '@/components/waitlist/waitlist-button';
import { HeroIllustrations } from './hero-illustrations';

export function Hero() {
  const [bursts,setBursts]=useState([0,0,0]);
  const {dialog,setDialog}=useWaitlist();
  const lastTriggered=useRef([0,0,0]);
  const lastZone=useRef(-1);
  const dialogOpen=useRef(false);
  useEffect(()=>{dialogOpen.current=dialog!==null},[dialog]);
  function reveal(e: PointerEvent<HTMLElement>) {
    if(window.innerWidth<768 || dialogOpen.current || (e.target as HTMLElement).closest('a,button,input')) return;
    const rect=e.currentTarget.getBoundingClientRect();
    const zone=Math.min(2,Math.max(0,Math.floor((e.clientX-rect.left)/rect.width*3)));
    const now=performance.now();
    // Each zone has its own cooldown: other zones remain responsive mid-dissolve.
    if(now-lastTriggered.current[zone]<3700 && lastTriggered.current[zone]!==0) return;
    lastZone.current=zone;
    lastTriggered.current[zone]=now;
    setBursts(old=>old.map((count,i)=>i===zone?count+1:count));
  }
  return <section id="home" className="hero" aria-labelledby="hero-heading" onPointerMove={reveal} onPointerDown={reveal}>
    <SiteHeader />
    <div className="hero-title-area"><h1 id="hero-heading" className="hero-heading"><span>The World</span><span>Happens on</span><span>Pigeon.</span></h1><WaitlistButton /></div>
    <HeroIllustrations bursts={bursts}/><div className="hero-desktop-cta"><WaitlistButton /></div>


  </section>;
}
