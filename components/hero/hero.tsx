"use client";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { HeroIllustrations } from './hero-illustrations';

export function Hero() {
  const [bursts,setBursts]=useState([0,0,0]);
  const [dialog,setDialog]=useState<'waitlist'|'about'|null>(null);
  const [status,setStatus]=useState<'idle'|'sending'|'success'|'error'>('idle');
  const [message,setMessage]=useState('');
  const lastTriggered=useRef([0,0,0]);
  const lastZone=useRef(-1);
  const dialogOpen=useRef(false);
  useEffect(()=>{dialogOpen.current=dialog!==null},[dialog]);
  function reveal(e: PointerEvent<HTMLElement>) {
    if(dialogOpen.current || (e.target as HTMLElement).closest('a,button,input')) return;
    const rect=e.currentTarget.getBoundingClientRect();
    const zone=Math.min(2,Math.max(0,Math.floor((e.clientX-rect.left)/rect.width*3)));
    const now=performance.now();
    // Each zone has its own cooldown: other zones remain responsive mid-dissolve.
    if(now-lastTriggered.current[zone]<3700 && lastTriggered.current[zone]!==0) return;
    lastZone.current=zone;
    lastTriggered.current[zone]=now;
    setBursts(old=>old.map((count,i)=>i===zone?count+1:count));
  }
  async function join(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus('sending'); setMessage('');
    const data=new FormData(e.currentTarget);
    try {
      const response=await fetch('/api/waitlist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:data.get('email'),website:data.get('website')})});
      const result=await response.json() as {error?:string;ok?:boolean};
      if(!response.ok) throw new Error(result.error || 'Please try again in a moment.');
      setStatus('success');
    } catch(error) {setStatus('error');setMessage(error instanceof Error?error.message:'Please try again in a moment.');}
  }
  return <section id="home" className="hero" aria-labelledby="hero-heading" onPointerMove={reveal} onPointerDown={reveal}>
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Pigeon home"><img src="/images/logo.png" width="83" height="50" alt="Pigeon" /></a>
      <nav className="navigation" aria-label="Main navigation"><a href="#home" aria-current="page">Home</a><span aria-hidden="true"/><button onClick={()=>setDialog('about')}>About</button></nav>
      <button className="header-cta" onClick={()=>setDialog('waitlist')}>Join Waitlist</button>
    </header>
    <div className="hero-title-area"><h1 id="hero-heading" className="hero-heading"><span>The World</span><span>Happens on</span><span>Pigeon.</span></h1></div>
    <HeroIllustrations bursts={bursts}/>
    <button className="waitlist-cta" onClick={()=>setDialog('waitlist')}><span className="crowd-colors" aria-hidden="true">{['#fc6457','#9fc4f8','#ffcde6','#fbe84c'].map(color=><i key={color} style={{background:color} as CSSProperties}/>)}</span><span>Join Waitlist!</span></button>
    <Dialog open={dialog!==null} onOpenChange={open=>{if(!open)setDialog(null)}}>
      <DialogContent className="pigeon-dialog">
        <DialogTitle>{dialog==='about'?'Prediction markets, made social.':status==='success'?"You’re on the list.":'Be early. Join Pigeon.'}</DialogTitle>
        <DialogDescription>{dialog==='about'?'Predict what happens next. Back your position, follow the topics you care about, and see what the crowd believes.':status==='success'?"We’ll email you when early access opens.":'Leave your email for early access.'}</DialogDescription>
        {dialog==='about'?<button className="form-submit" onClick={()=>setDialog('waitlist')}>Join the waitlist</button>:status!=='success'&&<form onSubmit={join} className="waitlist-form">
          <label htmlFor="waitlist-email">Email address</label><input id="waitlist-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} disabled={status==='sending'}/>
          <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off"/></div>
          <button className="form-submit" type="submit" disabled={status==='sending'}>{status==='sending'?'Joining…':'Join Waitlist'}</button>
          <p className="form-note">By joining, you agree to receive Pigeon early-access updates.</p>
          {message&&<p role="alert" className="form-error">{message}</p>}
        </form>}
      </DialogContent>
    </Dialog>
  </section>;
}
