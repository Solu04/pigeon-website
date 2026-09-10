"use client";
import { createContext, useContext, useState, type ReactNode } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
const topics=[['sports','Sports'],['politics','Politics'],['entertainment','Entertainment'],['tech','Tech & Science'],['business','Business & Economy'],['everything','Everything. Give me all of it.']] as const;
type DialogKind='waitlist'|'about'|null;
const WaitlistContext=createContext<{dialog:DialogKind;setDialog:(value:DialogKind)=>void}|null>(null);
export function useWaitlist(){const value=useContext(WaitlistContext);if(!value)throw new Error('WaitlistProvider is required');return value;}
export function WaitlistProvider({children}:{children:ReactNode}){
 const [dialog,setDialog]=useState<DialogKind>(null);
 const [status,setStatus]=useState<'idle'|'sending'|'success'|'error'>('idle');
 const [message,setMessage]=useState('');
 const [interests,setInterests]=useState<string[]>([]);
 function toggle(id:string,checked:boolean){setInterests(previous=>id==='everything'?(checked?topics.slice(0,5).map(t=>t[0]):[]):checked?[...previous,id]:previous.filter(t=>t!==id));setMessage('');}
 async function join(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();if(status==='sending')return;
  if(interests.length<2){setMessage('Choose at least two interests, or select Everything.');return;}
  setStatus('sending');setMessage('');const data=new FormData(e.currentTarget);
  try{const response=await fetch('/api/waitlist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:data.get('email'),name:data.get('name'),interests,launchAmount:data.get('launchAmount'),website:data.get('website')})});const result=await response.json() as {error?:string};if(!response.ok)throw new Error(result.error||'Please try again in a moment.');setStatus('success');}
  catch(error){setStatus('error');setMessage(error instanceof Error?error.message:'Please try again in a moment.');}
 }
 return <WaitlistContext.Provider value={{dialog,setDialog}}>{children}<Dialog open={dialog!==null} onOpenChange={open=>{if(!open)setDialog(null)}}><DialogContent className="pigeon-dialog flock-dialog">
  <div className="flock-intro"><img src="/images/logo.png" width={50} height={30} alt="Pigeon"/><DialogTitle className="landing-display">{status==='success'?<>You’re in<br/>the flock!</>:<>Move with<br/>the flock!</>}</DialogTitle><DialogDescription>{status==='success'?"You’re on the waitlist. We’ll email you when early access opens.":<><strong>Early supporters get rewarded.</strong> The first 50 people to join the waitlist will receive ₦1,000 in their Pigeon wallet to start trading when we launch.</>}</DialogDescription></div>
  {status==='success'?<div className="flock-success" role="status"><p>Thanks for joining Pigeon.</p><p>Your predictions have a new home.</p><button className="form-submit" onClick={()=>setDialog(null)}>Back to exploring</button></div>:<form onSubmit={join} className="waitlist-form flock-form">
   <fieldset disabled={status==='sending'} className="flock-fields">
    <div className="flock-field"><label htmlFor="waitlist-name">1. What should we call you?</label><input id="waitlist-name" name="name" autoComplete="given-name" placeholder="Your name" required maxLength={100}/></div>
    <div className="flock-field"><label htmlFor="waitlist-email">2. Where should we send your invite?</label><input id="waitlist-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254}/></div>
    <fieldset className="flock-interests"><legend>3. What are you most interested in predicting?</legend><p id="interest-hint">Select two or more</p><div className="interest-options">{topics.map(([id,label])=><div className="interest-option" key={id}><Checkbox aria-label={label} checked={id==='everything'?interests.length===5:interests.includes(id)} onCheckedChange={checked=>toggle(id,checked)} aria-describedby="interest-hint"/><img src={'/images/waitlist/'+id+'.svg'} width={16} height={16} alt=""/><span>{label}</span></div>)}</div></fieldset>
    <div className="flock-field"><label htmlFor="launch-amount">4. How much do you think you’ll trade on launch day?</label><p className="amount-hint">An estimate is fine — no commitment.</p><div className="amount-input"><span aria-hidden="true">₦</span><input id="launch-amount" name="launchAmount" type="number" inputMode="decimal" min="0" max="1000000000" step="0.01" placeholder="Amount (optional)" aria-label="Estimated launch-day amount in naira"/></div></div>
   </fieldset>
   <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off"/></div>
   {message&&<p role="alert" className="form-error">{message}</p>}
   <button className="form-submit" type="submit" disabled={status==='sending'}>{status==='sending'?'Joining…':'Join the waitlist'}</button><p className="form-note">By joining, you agree to receive Pigeon early-access updates.</p>
  </form>}
 </DialogContent></Dialog></WaitlistContext.Provider>;
}
