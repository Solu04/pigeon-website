"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

export type ProductTabId = 'join' | 'predictions' | 'arena' | 'profile';
export type ProductRenders = Record<ProductTabId, {src:string;alt:string}>;

const tabs = [
  {id:'join',label:'Join',color:'#fc6457',title:'Join Where The World Happens.',description:'Create your account, personalize your profile, and become part of a community that predicts, debates, and trade the events of our world.',number:'01'},
  {id:'predictions',label:'Predictions',color:'#9fc4f8',title:'Predict, Trade and Profit.',description:'Trade on real-world outcomes across politics, sports, global events, and more. Buy low, sell high, and cash out when you’re right!',number:'02'},
  {id:'arena',label:'Arena',color:'#ffcde6',title:'Discuss, react, & challenge ideas.',description:'Say it before it happens. Share your take, react to others, and see what the community thinks in real time.',number:'03'},
  {id:'profile',label:'Profile',color:'#fbe84c',title:'Track Learn, & Level up.',description:'See your positions, performance, and prediction history all in one place. The more you predict, the better you get.',number:'04'},
] as const;

const clamp = (value:number) => Math.min(1, Math.max(0, value));
const easeOut = (value:number) => 1 - Math.pow(1 - value, 3);

export function ProductTour({renders}:{renders:ProductRenders}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [progress,setProgress] = useState(0);
  const [isVisible,setIsVisible] = useState(false);

  const updateProgress = useCallback(() => {
    frameRef.current = null;
    const section = sectionRef.current;
    if (!section) return;
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    setProgress(clamp(-section.getBoundingClientRect().top / travel));
  },[]);

  useEffect(() => {
    const schedule = () => {
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    return () => {
      window.removeEventListener('scroll',schedule);
      window.removeEventListener('resize',schedule);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  },[updateProgress]);

  useEffect(() => {
    const sticky = stickyRef.current;
    if (!sticky || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting && entry.intersectionRatio >= .15);
    },{threshold:[0,.15,.4]});
    observer.observe(sticky);
    return () => observer.disconnect();
  },[]);

  const phase = progress * (tabs.length - 1);
  const activeIndex = Math.min(tabs.length - 1, Math.floor(phase + .5));

  useEffect(() => {
    videoRefs.current.forEach((video,index) => {
      if (!video) return;
      video.pause();
      if (index !== activeIndex || !isVisible) video.currentTime = 0;
    });

    const activeVideo = videoRefs.current[activeIndex];
    if (!activeVideo || !isVisible) return;

    let cancelled = false;
    const playActiveVideo = () => {
      if (cancelled) return;
      activeVideo.currentTime = 0;
      void activeVideo.play().catch(() => {
        if (!cancelled && activeVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          activeVideo.addEventListener('canplay',playActiveVideo,{once:true});
        }
      });
    };

    playActiveVideo();
    return () => {
      cancelled = true;
      activeVideo.removeEventListener('canplay',playActiveVideo);
      activeVideo.pause();
    };
  },[activeIndex,isVisible]);

  const moveTo = (index:number) => {
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const travel = section.offsetHeight - window.innerHeight;
    window.scrollTo({top:sectionTop + travel * (index / (tabs.length - 1)),behavior:'smooth'});
  };

  return <section ref={sectionRef} id="features" className="product-tour" aria-label="Discover Pigeon">
    <div ref={stickyRef} className="product-tour-sticky">
      <div className="site-container product-tabs">
        <div className="product-render-stage">
          {tabs.map((tab,index)=><div key={tab.id} id={`feature-panel-${tab.id}`} role="tabpanel" aria-hidden={activeIndex!==index} className="product-render-panel" data-active={activeIndex===index||undefined}>
            <span className="product-render-asset"><video ref={(node)=>{videoRefs.current[index]=node;if(node){node.muted=true;node.defaultMuted=true}}} className="product-render-video" src={renders[tab.id].src} aria-label={renders[tab.id].alt} width={920} height={1924} muted playsInline loop autoPlay={activeIndex===index&&isVisible} preload={activeIndex===index?'auto':'none'}/></span>
          </div>)}
        </div>
        <div className="product-tab-list" role="tablist" aria-label="Pigeon features">
          {tabs.map((tab,index)=>{
            const arrival = index === 0 ? 1 : easeOut(clamp(phase - (index - 1)));
            return <button key={tab.id} type="button" role="tab" aria-selected={activeIndex===index} aria-controls={`feature-panel-${tab.id}`} onClick={()=>moveTo(index)} className="product-tab" data-active={activeIndex===index||undefined} style={{'--tab-color':tab.color,'--tab-index':index,'--tab-shift':`${(1-arrival)*125}%`} as CSSProperties}>
              <span className="product-tab-header"><span className="product-tab-label">{tab.label}</span><img className="product-tab-icon" src={'/images/tabs/'+tab.id+'.svg'} alt="" width={30} height={30}/></span>
              <span className="product-tab-details" aria-hidden={activeIndex!==index}><span className="product-tab-details-inner"><span className="product-tab-title">{tab.title}</span><span className="product-tab-description">{tab.description}</span><span className="product-tab-number">{tab.number}</span></span></span>
            </button>;
          })}
        </div>
      </div>
    </div>
  </section>;
}
