"use client";
import {useEffect,useRef,type CSSProperties} from 'react';
const artwork=[
 {name:'playful_yes_no_badge_sticker',zone:0,x:295,y:578,size:250,mx:8,bottom:-18,angle:-15},
 {name:'55_yes_blue_burst_sticker',zone:0,x:441,y:716,size:180,mx:30,bottom:-8,angle:12},
 {name:'say_it_first_sticker',zone:2,x:1104,y:597,size:250,mx:73,bottom:-20,angle:16},
 {name:'hot_take_comic_sticker',zone:1,x:662,y:752,size:220,mx:48,bottom:-16,angle:-8},
 {name:'who_wins_ballot_box_sticker',zone:1,x:919,y:752,size:220,mx:91,bottom:-12,angle:24},
 {name:'live_market_trend_sticker',zone:0,x:466,y:594,size:140,mx:19,bottom:36,angle:12},
 {name:'join_the_flock_sticker_badge',zone:2,x:1122,y:722,size:160,mx:62,bottom:30,angle:-17},
 {name:'what_drops_next_sticker',zone:2,x:994,y:528,size:100,mx:83,bottom:57,angle:-12},
 {name:'crowd_says_yes_sticker_badge',zone:0,x:281,y:722,size:140,mx:3,bottom:59,angle:19},
 {name:'football_match_sticker_badge',zone:2,x:1292,y:668,size:180,mx:39,bottom:55,angle:18},
];
export function HeroIllustrations({bursts,onDesktopIntroComplete}:{bursts:number[];onDesktopIntroComplete:()=>void}){
 const mobile=useRef<HTMLDivElement>(null);
 const desktop=useRef<HTMLDivElement>(null);
 const played=useRef(false);
 const desktopPlayed=useRef(false);
 useEffect(()=>{
  const layer=mobile.current;if(!layer)return;
  const media=matchMedia('(max-width:767px)');
  let cancelled=false;
  const animations:Animation[]=[];
  async function start(){
   if(!media.matches||played.current)return;

   await Promise.all(Array.from(layer!.querySelectorAll('img')).map(img=>img.decode().catch(()=>{})));
   if(cancelled||played.current)return;
   played.current=true;
   layer!.querySelectorAll<HTMLElement>('.falling-sticker').forEach((item,index)=>{
    const a=artwork[index],drift=index%2===0?-26:24;
    const height=layer!.getBoundingClientRect().height;
    const transform=(x:number,y:number,angle:number)=>`translate3d(${x}px,${y}px,0) rotate(${angle}deg)`;
    animations.push(item.animate([
     {transform:transform(drift,-height-200,a.angle-40),opacity:1,offset:0,easing:'cubic-bezier(.45,0,1,1)'},
     {transform:transform(-drift*.2,0,a.angle+10),opacity:1,offset:.55,easing:'cubic-bezier(0,0,.4,1)'},
     {transform:transform(drift*.15,-48-index%3*8,a.angle-9),offset:.7,easing:'cubic-bezier(.5,0,1,1)'},
     {transform:transform(2,0,a.angle+4),offset:.84,easing:'ease-out'},
     {transform:transform(-2,-12,a.angle-3),offset:.91,easing:'ease-in'},
     {transform:transform(0,0,a.angle),opacity:1,offset:1}
    ],{duration:1400+index%3*90,delay:160+index*85,fill:'both'}));
   });
  }
  start();media.addEventListener('change',start);
  return()=>{cancelled=true;media.removeEventListener('change',start);animations.forEach(a=>a.cancel());};
 },[]);
 useEffect(()=>{
  const layer=desktop.current;if(!layer)return;
  const desktopMedia=matchMedia('(min-width:768px)');
  let cancelled=false;
  const animations:Animation[]=[];
  let completionTimer=0;
  async function start(){
   if(!desktopMedia.matches||desktopPlayed.current)return;
   desktopPlayed.current=true;
   const stickers=Array.from(layer!.querySelectorAll<HTMLImageElement>('.desktop-falling-sticker'));
   await Promise.all(stickers.map(img=>img.decode().catch(()=>{})));
   if(cancelled)return;
   const height=layer!.getBoundingClientRect().height;
   stickers.forEach((item,index)=>{
    const a=artwork[index],drift=index%2===0?-34:30;
    const transform=(x:number,y:number,angle:number)=>`translate3d(${x}px,${y}px,0) rotate(${angle}deg)`;
    animations.push(item.animate([
     {transform:transform(drift,-height-220,a.angle-38),opacity:1,offset:0,easing:'cubic-bezier(.45,0,1,1)'},
     {transform:transform(-drift*.18,0,a.angle+9),opacity:1,offset:.57,easing:'cubic-bezier(0,0,.38,1)'},
     {transform:transform(drift*.12,-44-index%3*7,a.angle-8),offset:.72,easing:'cubic-bezier(.5,0,1,1)'},
     {transform:transform(2,0,a.angle+3),offset:.86,easing:'ease-out'},
     {transform:transform(-2,-10,a.angle-2),offset:.93,easing:'ease-in'},
     {transform:transform(0,0,a.angle),opacity:1,offset:1}
    ],{duration:1450+index%3*90,delay:120+index*80,fill:'both'}));
   });
   await Promise.all(animations.map(animation=>animation.finished.catch(()=>{})));
   if(cancelled)return;
   completionTimer=window.setTimeout(async()=>{
    if(cancelled)return;
    const fade=layer!.animate([{opacity:1},{opacity:0}],{duration:420,easing:'ease-in',fill:'forwards'});
    animations.push(fade);
    await fade.finished.catch(()=>{});
    if(cancelled)return;
    layer!.style.display='none';
    onDesktopIntroComplete();
   },1000);
  }
  start();desktopMedia.addEventListener('change',start);
  return()=>{cancelled=true;desktopMedia.removeEventListener('change',start);window.clearTimeout(completionTimer);animations.forEach(animation=>animation.cancel());};
 },[onDesktopIntroComplete]);
 return <>
  <div className="hero-artwork hero-stickers-desktop" aria-hidden="true">
   <div ref={desktop} className="hero-desktop-intro">{artwork.map(item=><div key={item.name} className="artwork-position desktop-intro-position" style={{'--x':item.x/1512*100+'%','--intro-bottom':item.bottom+'px','--asset-size':item.size+'px','--asset-fluid':item.size/15.12+'vw'} as CSSProperties}><img className="desktop-falling-sticker" src={'/images/stickers/'+item.name+'.png'} alt="" draggable={false} width={1280} height={1280}/></div>)}</div>
   <div className="hero-desktop-hover">{artwork.map((item,index)=><div key={item.name} className="artwork-position" style={{'--x':item.x/1512*100+'%','--y':item.y/982*100+'%','--asset-size':item.size+'px','--asset-fluid':item.size/15.12+'vw','--delay':index%3*80+'ms'} as CSSProperties}>
    {bursts[item.zone]>0&&<div key={bursts[item.zone]} className="artwork-reveal"><img src={'/images/stickers/'+item.name+'.png'} alt="" draggable={false} width={1280} height={1280}/></div>}
   </div>)}</div>
  </div>
  <div ref={mobile} className="hero-stickers-mobile" aria-hidden="true">{artwork.map((item,index)=><div key={item.name} className="falling-sticker-position" style={{left:item.mx+'%',bottom:item.bottom+'px',width:(index<5?'clamp(110px,31vw,155px)':'clamp(85px,25vw,125px)')}}><img className="falling-sticker" src={'/images/stickers/'+item.name+'.png'} width={1280} height={1280} alt="" draggable={false}/></div>)}</div>
 </>;
}
