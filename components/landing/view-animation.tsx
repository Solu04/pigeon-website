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
      setDocument(svg.slice(start));
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
  useEffect(()=>{
    const host=ref.current;
    if(!host||!document||entry===0)return;
    // Isolate asset styles without an iframe canvas or colour-scheme background.
    const shadow=host.shadowRoot??host.attachShadow({mode:'open'});
    const parsed=new DOMParser().parseFromString(document,'image/svg+xml');
    if(parsed.querySelector('parsererror'))return;
    const svg=parsed.documentElement;
    svg.querySelectorAll('script,foreignObject').forEach(node=>node.remove());
    svg.querySelectorAll('*').forEach(node=>{
      Array.from(node.attributes).forEach(attribute=>{
        if(attribute.name.startsWith('on'))node.removeAttribute(attribute.name);
      });
    });
    svg.setAttribute('role','img');
    svg.setAttribute('aria-label',alt);
    svg.setAttribute('style','display:block;width:100%;height:100%;background:transparent');
    shadow.replaceChildren(window.document.importNode(svg,true));
    return()=>shadow.replaceChildren();
  },[document,entry,alt]);
  return <span ref={ref} className={className} style={{aspectRatio:`${width}/${height}`}}/>;

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
