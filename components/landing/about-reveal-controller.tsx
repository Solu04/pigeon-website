"use client";
import {useEffect} from 'react';

export function AboutRevealController(){
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>('.about-page');
  if(!root)return;
  const items=Array.from(root.querySelectorAll<HTMLElement>('.about-reveal'));
  const loadItems=items.filter(item=>item.classList.contains('about-load-reveal'));
  root.classList.add('about-motion-ready');
  const loadTimer=window.setTimeout(()=>loadItems.forEach(item=>item.classList.add('is-visible')),80);
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){(entry.target as HTMLElement).classList.add('is-visible');observer.unobserve(entry.target);}
  }),{threshold:.12,rootMargin:'0px 0px -12%'});
  items.filter(item=>!loadItems.includes(item)).forEach(item=>observer.observe(item));
  return()=>{window.clearTimeout(loadTimer);observer.disconnect();};
 },[]);
 return null;
}
