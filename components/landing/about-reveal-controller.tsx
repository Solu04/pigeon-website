"use client";
import {useEffect} from 'react';

export function AboutRevealController(){
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>('.about-page');
  if(!root)return;
  const items=Array.from(root.querySelectorAll<HTMLElement>('.about-reveal'));
  root.classList.add('about-motion-ready');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){(entry.target as HTMLElement).classList.add('is-visible');observer.unobserve(entry.target);}
  }),{threshold:.12,rootMargin:'0px 0px -12%'});
  items.forEach(item=>observer.observe(item));
  return()=>observer.disconnect();
 },[]);
 return null;
}
