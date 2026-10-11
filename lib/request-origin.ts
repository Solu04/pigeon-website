import {headers} from 'next/headers';

const fallbackOrigin = 'https://pigeonarena.com';

export async function getRequestOrigin(){
 const requestHeaders=await headers();
 const host=requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');
 const protocol=requestHeaders.get('x-forwarded-proto') ?? 'https';
 if(!host)return fallbackOrigin;
 try{return new URL(`${protocol}://${host}`).origin;}catch{return fallbackOrigin;}
}

export function getSocialImage(origin:string){
 return `${origin}/images/meta/opengraph.png?v=20260928b`;
}
