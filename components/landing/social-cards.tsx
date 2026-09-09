"use client";
import { useEffect, useRef } from 'react';

const cards = [
  ['Say it before it happens.','Got a take? Drop it. Got a prediction? Even better. Just don’t delete the post when you’re wrong.'],
  ['Put your money where your mouth is.','Make a call, back your prediction, and see if everyone else thinks you’re onto something.'],
  ['Find your flock.','Discover the predictions, conversations, and communities around the things everyone is talking about.'],
];
const clamp = (value:number) => Math.min(1,Math.max(0,value));

export function SocialCards() {
  const section = useRef<HTMLElement>(null);
  useEffect(()=>{
    const root=section.current;
    if(!root)return;
    const items=Array.from(root.querySelectorAll<HTMLElement>('.social-card'));
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0;
    function update(){
      frame=0;
      if(!root)return;
      const enabled=!reduced.matches && window.innerHeight>600;
      root.classList.toggle('social-scroll-ready',enabled);
      const distance=root.offsetHeight-window.innerHeight;
      const progress=enabled?clamp(-root.getBoundingClientRect().top/Math.max(1,distance)):1;
      const mobile=window.innerWidth<=700;
      items.forEach((item,index)=>{
        const reveal=enabled?clamp((progress-index*0.3)/0.18):1;
        const exit=mobile&&enabled&&index<2?clamp((progress-(index+1)*0.3)/0.18):0;
        const opacity= index===0 ? 1-exit : reveal*(1-exit);
        item.style.opacity=String(opacity);
        item.style.transform=`translateY(${(1-reveal)*60}px)`;
        item.setAttribute('aria-hidden',String(opacity<0.01));
      });
    }
    function schedule(){if(!frame)frame=requestAnimationFrame(update);}
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    reduced.addEventListener('change',schedule);
    update();
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule);};
  },[]);
  return <section className="social-scroll" ref={section} aria-label="Make yourself heard on Pigeon"><div className="social-sticky"><div className="site-container social-grid">{cards.map(([title,description],index)=><article className="social-card" key={title}><img src={'/images/sections/social-card-'+(index+1)+'.svg'} width={370} height={400} alt={['Create a post on Pigeon','Back your prediction and join the conversation','Discover fanbase conversations'][index]}/><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>;
}
