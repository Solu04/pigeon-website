"use client";
import { useEffect, useRef } from 'react';
const cards = [
  ['Say it before it happens.','Got a take? Drop it. Got a prediction? Even better. Just don’t delete the post when you’re wrong.'],
  ['Put your money where your mouth is.','Make a call, back your prediction, and see if everyone else thinks you’re onto something.'],
  ['Find your flock.','Discover the predictions, conversations, and communities around the things everyone is talking about.'],
];
const clamp=(n:number)=>Math.min(1,Math.max(0,n));
export function SocialCards(){
  const runway=useRef<HTMLDivElement>(null);
  const socialVideo=useRef<HTMLVideoElement>(null);
  useEffect(()=>{
    const root=runway.current;if(!root)return;
    const items=Array.from(root.querySelectorAll<HTMLElement>('.social-card'));
    let frame=0;
    function update(){
      frame=0;if(!root)return;
      const travel=Math.max(1,root.offsetHeight-(root.firstElementChild as HTMLElement).offsetHeight);
      const progress=clamp((5-root.getBoundingClientRect().top)/travel);
      const mobile=window.innerWidth<768;
      items.forEach((item,index)=>{
        const enter=mobile||index===0?1:clamp((progress-(index===1?.16:.53))/.2);
        const leave=0;
        const opacity=enter*(1-leave);
        item.style.opacity=String(opacity);
        item.style.transform=`translateY(${(1-enter)*60}px)`;
        item.setAttribute('aria-hidden',String(opacity<.01));
      });
    }
    function schedule(){if(!frame)frame=requestAnimationFrame(update);}
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);update();
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
  },[]);
  useEffect(()=>{
    const video=socialVideo.current;if(!video)return;
    let active=false;
    let cancelled=false;
    const retries:Array<ReturnType<typeof setTimeout>>=[];
    const prime=()=>{
      video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;video.controls=false;
      video.setAttribute('muted','');video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','true');video.removeAttribute('controls');
    };
    const play=()=>{if(cancelled||!active||document.visibilityState==='hidden')return;prime();void video.play().catch(()=>{});};
    const observer=new IntersectionObserver(([entry])=>{
      active=entry.isIntersecting&&entry.intersectionRatio>.1;
      if(active){video.currentTime=0;play();[120,500,1200].forEach((delay)=>retries.push(setTimeout(play,delay)));}
      else{video.pause();video.currentTime=0;}
    },{threshold:[0,.1,.25]});
    const resume=()=>{if(document.visibilityState==='visible')play();};
    prime();observer.observe(video);
    ['loadedmetadata','loadeddata','canplay'].forEach((event)=>video.addEventListener(event,play));
    window.addEventListener('pageshow',resume);window.addEventListener('focus',resume);document.addEventListener('visibilitychange',resume);
    return()=>{cancelled=true;retries.forEach(clearTimeout);observer.disconnect();['loadedmetadata','loadeddata','canplay'].forEach((event)=>video.removeEventListener(event,play));window.removeEventListener('pageshow',resume);window.removeEventListener('focus',resume);document.removeEventListener('visibilitychange',resume);video.pause();};
  },[]);
  return <section className="discovery-sequence" aria-labelledby="discovery-sequence-heading"><h2 id="discovery-sequence-heading" className="sr-only">Discover where the world thinks next.</h2>
    <div className="site-container discovery-intro"><p className="landing-display discovery-line">Discover where</p><p className="landing-display discovery-line discovery-line--the">the world thinks</p></div>
    <div className="discovery-runway" ref={runway}><div className="discovery-pin">
      <div className="site-container discovery-next"><p className="landing-display discovery-line discovery-line--next">next.</p><img className="discovery-live-asset" src="/images/sections/discover-live.svg" width={234} height={104} alt="Live market predictions"/></div>
      <div className="site-container social-grid">{cards.map(([title,description],index)=><article className="social-card" key={title}>{index===0?<video ref={socialVideo} className="social-card-media social-card-video" src="/videos/social-card-animation.webm" width={740} height={800} aria-label="Create a post on Pigeon" muted playsInline loop autoPlay controls={false} disablePictureInPicture controlsList="nodownload nofullscreen noremoteplayback" preload="auto"/>:<img className="social-card-media" src={'/images/sections/social-card-'+(index+1)+'.svg'} width={370} height={400} alt={['Create a post on Pigeon','Back your prediction and join the conversation','Discover fanbase conversations'][index]}/>}<h3>{title}</h3><p>{description}</p></article>)}</div>
    </div></div>
  </section>;
}
