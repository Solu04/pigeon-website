"use client";
import { useEffect, useRef, useState, type ReactNode } from 'react';

export function ViewAnimation({className,src,alt,width,height}:{className:string;src:string;alt:string;width:number;height:number}){
  const ref=useRef<HTMLSpanElement>(null);
  const [entry,setEntry]=useState(0);
  useEffect(()=>{
    const node=ref.current;if(!node)return;
    let inside=false;
    const observer=new IntersectionObserver(([item])=>{
      if(item.isIntersecting&&!inside){inside=true;setEntry(n=>n+1);}
      else if(!item.isIntersecting)inside=false;
    },{threshold:0});
    observer.observe(node);return()=>observer.disconnect();
  },[]);
  return <span ref={ref} className={className} style={{aspectRatio:`${width}/${height}`}}>{entry>0&&<iframe key={entry} src={src} title={alt} width={width} height={height} sandbox="" tabIndex={-1}/>}</span>;
}

export function Reveal({children,className,stagger=false}:{children:ReactNode;className:string;stagger?:boolean}){
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const node=ref.current;if(!node)return;
    const targets=stagger?Array.from(node.children) as HTMLElement[]:[node];
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced)return;
    targets.forEach(target=>{target.style.opacity='0';target.style.transform='translateY(45px)';});
    const observer=new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting)return;
      targets.forEach((target,index)=>{
        const animation=target.animate([{opacity:0,transform:'translateY(45px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:stagger?index*110:0,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
        animation.onfinish=()=>{target.style.opacity='1';target.style.transform='none';animation.cancel();};
      });
      observer.disconnect();
    },{threshold:.05});
    observer.observe(node);return()=>observer.disconnect();
  },[stagger]);
  return <div className={className} ref={ref}>{children}</div>;
}
