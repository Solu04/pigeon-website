"use client";
import { useWaitlist } from './waitlist-provider';
export function WaitlistButton({compact=false}:{compact?:boolean}) {
  const {setDialog}=useWaitlist();
  return <button className={'waitlist-cta'+(compact?' waitlist-cta--compact':'')} onClick={()=>setDialog('waitlist')}><span className="crowd-colors" aria-hidden="true">{['#fc6457','#9fc4f8','#ffcde6','#fbe84c'].map(color=><i key={color} style={{background:color}}/>)}</span><span>Join Waitlist!</span></button>;
}
