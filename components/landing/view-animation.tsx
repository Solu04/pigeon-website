"use client";
import { useEffect, useRef, useState, type ReactNode } from 'react';

export function ViewAnimation({className,src,alt,width,height}:{className:string;src:string;alt:string;width:number;height:number}){
  const ref=useRef<HTMLSpanElement>(null);
  const [entry,setEntry]=useState(0);
  const [document,setDocument]=useState('');
  useEffect(()=>{
    const controller=new AbortController();
    fetch(src,{signal:controller.signal}).then(response=>{
      if(!response.ok)throw new Error('Animation asset unavailable');
      return response.text();
    }).then(svg=>{
      const start=svg.indexOf('<svg');
      if(start<0)return;
      setDocument('<!doctype html><html><head><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent!important;color-scheme:light}body>svg{display:block;width:100%;height:100%}</style></head><body>'+svg.slice(start)+'</body></html>');
    }).catch(error=>{if(error.name!=='AbortError')console.error(error);});
    return()=>controller.abort();
  },[src]);
  useEffect(()=>{
    const node=ref.current;if(!node)return;
    let inside=false;
    const observer=new IntersectionObserver(([item])=>{
      if(item.isIntersecting&&!inside){inside=true;setEntry(n=>n+1);}
      else if(!item.isIntersecting)inside=false;
    },{threshold:0});
    observer.observe(node);return()=>observer.disconnect();
  },[]);
  return <span ref={ref} className={className} style={{aspectRatio:`${width}/${height}`}}>{entry>0&&document&&<iframe key={entry} srcDoc={document} title={alt} width={width} height={height} sandbox="" tabIndex={-1}/>}</span>;
}

export function Reveal({children,className,stagger=false}:{children:ReactNode;className:string;stagger?:boolean}){
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const node=ref.current;if(!node)return;
    const targets=stagger?Array.from(node.children) as HTMLElement[]:[node];
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
