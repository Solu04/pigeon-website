import { getDatabase } from '@/lib/database';
export async function POST(request: Request) {
  const origin=request.headers.get('origin');
  if(origin && origin!==new URL(request.url).origin) return Response.json({error:'Please submit from the Pigeon website.'},{status:403});
  if(!request.headers.get('content-type')?.includes('application/json')) return Response.json({error:'Invalid request.'},{status:415});
  try {
    const body=await request.text();
    if(body.length>2048) return Response.json({error:'Request too large.'},{status:413});
    let input: {email?:unknown;website?:unknown};
    try {input=JSON.parse(body)} catch {return Response.json({error:'Invalid request.'},{status:400})}
    if(!input || typeof input!=='object') return Response.json({error:'Invalid request.'},{status:400});
    if(input.website) return Response.json({ok:true});
    const email=typeof input.email==='string'?input.email.trim().toLowerCase():'';
    if(email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({error:'Enter a valid email address.'},{status:400});
    await getDatabase().prepare('INSERT INTO waitlist (email, created_at) VALUES (?, ?) ON CONFLICT(email) DO NOTHING').bind(email,new Date().toISOString()).run();
    return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  } catch {return Response.json({error:'We couldn’t save your email. Please try again shortly.'},{status:503})}
}
