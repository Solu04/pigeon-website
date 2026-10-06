import { getDatabase } from '@/lib/database';
import { env } from 'cloudflare:workers';

type EmailBinding = {
  send(message: {
    to: string;
    from: string;
    replyTo?: string;
    subject: string;
    text: string;
  }): Promise<unknown>;
};

function getEmailEnvironment() {
  return (env as unknown as {
    WAITLIST_EMAIL?: EmailBinding;
    WAITLIST_NOTIFY_TO?: string;
    WAITLIST_NOTIFY_FROM?: string;
  });
}

export async function POST(request: Request) {
  const origin=request.headers.get('origin');
  if(origin && origin!==new URL(request.url).origin) return Response.json({error:'Please submit from the Pigeon website.'},{status:403});
  if(!request.headers.get('content-type')?.includes('application/json')) return Response.json({error:'Invalid request.'},{status:415});
  try {
    const body=await request.text();
    if(body.length>2048) return Response.json({error:'Request too large.'},{status:413});
    let input: {email?:unknown;website?:unknown;name?:unknown;interests?:unknown;launchAmount?:unknown};
    try {input=JSON.parse(body)} catch {return Response.json({error:'Invalid request.'},{status:400})}
    if(!input || typeof input!=='object') return Response.json({error:'Invalid request.'},{status:400});
    if(input.website) return Response.json({ok:true});
    const email=typeof input.email==='string'?input.email.trim().toLowerCase():'';
    if(email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({error:'Enter a valid email address.'},{status:400});
    const name=typeof input.name==='string'?input.name.trim():'';
    const allowed=['sports','politics','entertainment','tech','business'];
    const interests=Array.isArray(input.interests)?[...new Set(input.interests)]:[];
    const enhanced=input.name!==undefined || input.interests!==undefined;
    if(enhanced && (!name || name.length>100)) return Response.json({error:'Please enter your name (up to 100 characters).'},{status:400});
    if(enhanced && (interests.length<2 || interests.length>5 || interests.some(t=>typeof t!=='string'||!allowed.includes(t)))) return Response.json({error:'Choose at least two prediction interests.'},{status:400});
    const amount=typeof input.launchAmount==='string'?input.launchAmount.trim():'';
    if(amount && (!/^\d+(\.\d{1,2})?$/.test(amount) || Number(amount)>1000000000)) return Response.json({error:'Please enter a valid amount in naira.'},{status:400});
    const result=await getDatabase().prepare('INSERT INTO waitlist (email, created_at, name, interests, launch_amount) VALUES (?, ?, ?, ?, ?) ON CONFLICT(email) DO NOTHING').bind(email,new Date().toISOString(),name||null,enhanced?JSON.stringify(interests):null,amount||null).run();
    if(result.meta.changes>0) {
      const emailEnvironment=getEmailEnvironment();
      if(emailEnvironment.WAITLIST_EMAIL && emailEnvironment.WAITLIST_NOTIFY_TO && emailEnvironment.WAITLIST_NOTIFY_FROM) {
        const submittedAt=new Date().toISOString();
        const details=[
          'New Pigeon Arena waitlist submission',
          '',
          `Name: ${name||'Not provided'}`,
          `Email: ${email}`,
          `Interests: ${interests.length?interests.join(', '):'Not provided'}`,
          `Estimated launch-day amount: ${amount?`NGN ${amount}`:'Not provided'}`,
          `Submitted: ${submittedAt}`,
        ].join('\n');
        try {
          await emailEnvironment.WAITLIST_EMAIL.send({
            to: emailEnvironment.WAITLIST_NOTIFY_TO,
            from: emailEnvironment.WAITLIST_NOTIFY_FROM,
            replyTo: email,
            subject: `New Pigeon waitlist signup: ${(name||email).replace(/[\r\n]+/g,' ')}`,
            text: details,
          });
        } catch(error) {
          console.error('Waitlist notification email failed', error);
        }
      }
    }
    return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  } catch {return Response.json({error:'We couldn’t save your email. Please try again shortly.'},{status:503})}
}
