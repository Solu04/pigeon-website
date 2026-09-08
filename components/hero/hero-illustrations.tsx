"use client";
import type { CSSProperties } from 'react';
const artwork=[
  {name:'medallion',zone:0,x:17.79,y:57.13,size:218,delay:0},
  {name:'conversation',zone:0,x:27.58,y:59.06,size:96,delay:90},
  {name:'coin32',zone:0,x:23.12,y:67.97,size:95,delay:160},
  {name:'arena',zone:0,x:32.70,y:74.90,size:267,delay:230},
  {name:'coin76',zone:1,x:43.62,y:71.64,size:129,delay:0},
  {name:'reward',zone:1,x:51.95,y:74.39,size:221,delay:100},
  {name:'wallet',zone:2,x:65.64,y:72.38,size:171.464,delay:180},
  {name:'conversation',zone:2,x:67.39,y:56.92,size:66,delay:0},
  {name:'topics',zone:2,x:76.36,y:60.23,size:215,delay:90},
  {name:'coin4',zone:2,x:74.24,y:72.35,size:65,delay:260},
];
export function HeroIllustrations({bursts}:{bursts:number[]}) {
  return <div className="hero-artwork" aria-hidden="true">{artwork.map((item,index)=><div key={index} className={'artwork-position artwork-'+item.name} style={{'--x':item.x+'%','--y':item.y+'%','--asset-size':item.size+'px','--asset-fluid':item.size/15.12+'vw','--delay':item.delay+'ms'} as CSSProperties}>
    {bursts[item.zone]>0&&<div key={bursts[item.zone]} className="artwork-reveal"><img src={'/images/'+item.name+'.png'} alt="" draggable={false} width={512} height={512}/></div>}
  </div>)}</div>;
}
