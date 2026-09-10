import { getDatabase } from '@/lib/database';
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
    await getDatabase().prepare('INSERT INTO waitlist (email, created_at, name, interests, launch_amount) VALUES (?, ?, ?, ?, ?) ON CONFLICT(email) DO NOTHING').bind(email,new Date().toISOString(),name||null,enhanced?JSON.stringify(interests):null,amount||null).run();
    return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  } catch {return Response.json({error:'We couldn’t save your email. Please try again shortly.'},{status:503})}
}
