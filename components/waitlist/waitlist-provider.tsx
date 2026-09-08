"use client";
import { createContext, useContext, useState, type ReactNode } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
type DialogKind = 'waitlist' | 'about' | null;
const WaitlistContext = createContext<{dialog:DialogKind;setDialog:(value:DialogKind)=>void} | null>(null);
export function useWaitlist() {
  const value=useContext(WaitlistContext);
  if(!value) throw new Error('WaitlistProvider is required');
  return value;
}
export function WaitlistProvider({children}:{children:ReactNode}) {
  const [dialog,setDialog]=useState<'waitlist'|'about'|null>(null);
  const [status,setStatus]=useState<'idle'|'sending'|'success'|'error'>('idle');
  const [message,setMessage]=useState('');
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
  return <WaitlistContext.Provider value={{dialog,setDialog}}>{children}
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
  </WaitlistContext.Provider>;
}
