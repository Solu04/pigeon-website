"use client";
import {useEffect} from 'react';

export function AboutRevealController(){
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>('.about-page');
  if(!root)return;
  const items=Array.from(root.querySelectorAll<HTMLElement>('.about-reveal'));
  root.classList.add('about-motion-ready');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){items.forEach(item=>item.classList.add('is-visible'));return;}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){(entry.target as HTMLElement).classList.add('is-visible');observer.unobserve(entry.target);}
  }),{threshold:.14,rootMargin:'0px 0px -8%'});
  items.forEach(item=>observer.observe(item));
  return()=>observer.disconnect();
 },[]);
 return null;
}
