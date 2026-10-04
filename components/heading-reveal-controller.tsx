'use client';

import {useEffect} from 'react';

const HEADING_SELECTOR = 'h1, h2';
const PIGEON_FONT_NAME = 'pigeon display';
const FINAL_TRANSFORM = 'translate3d(0,0,0) rotateX(0deg) rotateZ(0deg) skewX(0deg)';
const INITIAL_TRANSFORM = 'translate3d(0,18%,0) rotateX(-89deg) rotateZ(6deg) skewX(-2.5deg)';

const revealKeyframes:Keyframe[] = [
  {offset:0,opacity:0,transform:INITIAL_TRANSFORM},
  {offset:.1,opacity:1,transform:INITIAL_TRANSFORM},
  {offset:.26,opacity:1,transform:'translate3d(0,15%,0) rotateX(-80deg) rotateZ(5.4deg) skewX(-2.2deg)'},
  {offset:.44,opacity:1,transform:'translate3d(0,11%,0) rotateX(-62deg) rotateZ(4.2deg) skewX(-1.7deg)'},
  {offset:.62,opacity:1,transform:'translate3d(0,6.5%,0) rotateX(-38deg) rotateZ(2.5deg) skewX(-.9deg)'},
  {offset:.8,opacity:1,transform:'translate3d(0,2.2%,0) rotateX(-16deg) rotateZ(.9deg) skewX(-.2deg)'},
  {offset:1,opacity:1,transform:FINAL_TRANSFORM},
];

type HeadingState = {
  originalHtml:string;
  accessibleText:string;
  originalAriaLabel:string|null;
  animated:boolean;
  animations:Animation[];
};

function isPigeonHeading(heading:HTMLElement) {
  return getComputedStyle(heading).fontFamily.toLowerCase().includes(PIGEON_FONT_NAME);
}

function measureRenderedLines(heading:HTMLElement) {
  const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);
  const textNodes:Text[]=[];
  while(walker.nextNode())textNodes.push(walker.currentNode as Text);

  textNodes.forEach(node=>{
    const parts=node.data.match(/\s+|\S+/g);
    if(!parts)return;
    const fragment=document.createDocumentFragment();
    parts.forEach(part=>{
      if(/^\s+$/.test(part)){fragment.appendChild(document.createTextNode(part));return;}
      const token=document.createElement('span');
      token.className='heading-measure-token';
      token.textContent=part;
      fragment.appendChild(token);
    });
    node.replaceWith(fragment);
  });

  const rows:Array<{top:number;tokens:string[]}>=[];
  heading.querySelectorAll<HTMLElement>('.heading-measure-token').forEach(token=>{
    const rect=token.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const tolerance=Math.max(2,rect.height*.12);
    let row=rows.find(candidate=>Math.abs(candidate.top-rect.top)<=tolerance);
    if(!row){row={top:rect.top,tokens:[]};rows.push(row);}
    row.tokens.push(token.textContent??'');
  });

  return rows.sort((a,b)=>a.top-b.top).map(row=>row.tokens.join(' '));
}

function setLineState(heading:HTMLElement,done:boolean) {
  heading.querySelectorAll<HTMLElement>('.heading-line').forEach(line=>{
    line.style.opacity=done?'1':'0';
    line.style.transform=done?FINAL_TRANSFORM:INITIAL_TRANSFORM;
  });
  heading.dataset.headingRevealState=done?'done':'pending';
}

function buildLines(heading:HTMLElement,state:HeadingState) {
  state.animations.forEach(animation=>animation.cancel());
  state.animations=[];
  heading.innerHTML=state.originalHtml;
  const lines=measureRenderedLines(heading);
  heading.innerHTML='';
  heading.setAttribute('aria-label',state.accessibleText);

  lines.forEach(text=>{
    const mask=document.createElement('span');
    mask.className='heading-line-mask';
    mask.setAttribute('aria-hidden','true');
    const line=document.createElement('span');
    line.className='heading-line';
    line.textContent=text;
    mask.appendChild(line);
    heading.appendChild(mask);
  });

  setLineState(heading,state.animated);
  return lines.length>0;
}

export function HeadingRevealController(){
  useEffect(()=>{
    let cancelled=false;
    let resizeTimer:ReturnType<typeof setTimeout>|undefined;
    const states=new Map<HTMLElement,HeadingState>();
    const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting||entry.intersectionRatio<.24)return;
        const heading=entry.target as HTMLElement;
        const state=states.get(heading);
        if(!state||state.animated)return;
        state.animated=true;
        observer?.unobserve(heading);
        heading.dataset.headingRevealState='running';
        const lines=heading.querySelectorAll<HTMLElement>('.heading-line');
        lines.forEach((line,index)=>{
          const animation=line.animate(revealKeyframes,{duration:1350,delay:index*115,easing:'cubic-bezier(.16, 1, .3, 1)',fill:'both'});
          state.animations.push(animation);
          void animation.finished.then(()=>{
            line.style.opacity='1';
            line.style.transform=FINAL_TRANSFORM;
            animation.cancel();
            if(index===lines.length-1)heading.dataset.headingRevealState='done';
          }).catch(()=>{});
        });
      });
    },{threshold:[0,.24,.5]}):null;

    const prepare=(heading:HTMLElement)=>{
      if(states.has(heading)||!isPigeonHeading(heading))return;
      const rect=heading.getBoundingClientRect();
      if(!rect.width||!rect.height)return;
      const state:HeadingState={
        originalHtml:heading.innerHTML,
        accessibleText:(heading.innerText||heading.textContent||'').replace(/\s+/g,' ').trim(),
        originalAriaLabel:heading.getAttribute('aria-label'),
        animated:rect.bottom<=0,
        animations:[],
      };
      states.set(heading,state);
      heading.dataset.headingReveal='';
      if(!buildLines(heading,state)){states.delete(heading);delete heading.dataset.headingReveal;return;}
      if(state.animated||!observer){setLineState(heading,true);return;}
      observer.observe(heading);
    };

    const scan=(root:Document|HTMLElement=document)=>{
      if(root instanceof HTMLElement&&root.matches(HEADING_SELECTOR))prepare(root);
      root.querySelectorAll<HTMLElement>(HEADING_SELECTOR).forEach(prepare);
    };

    const start=async()=>{
      if('fonts' in document)await document.fonts.ready;
      if(!cancelled)scan();
    };
    void start();

    const mutationObserver=new MutationObserver(mutations=>{
      mutations.forEach(mutation=>mutation.addedNodes.forEach(node=>{
        if(!(node instanceof HTMLElement))return;
        const existing=node.matches(HEADING_SELECTOR)?node:node.closest<HTMLElement>(HEADING_SELECTOR);
        if(existing&&states.has(existing)&&!existing.querySelector(':scope > .heading-line-mask')){
          const previous=states.get(existing)!;
          observer?.unobserve(existing);
          states.delete(existing);
          existing.innerHTML=previous.originalHtml;
          if(previous.originalAriaLabel===null)existing.removeAttribute('aria-label');else existing.setAttribute('aria-label',previous.originalAriaLabel);
          delete existing.dataset.headingReveal;
          delete existing.dataset.headingRevealState;
          prepare(existing);
          return;
        }
        scan(node);
      }));
    });
    mutationObserver.observe(document.body,{childList:true,subtree:true});

    const onResize=()=>{
      clearTimeout(resizeTimer);
      resizeTimer=setTimeout(()=>states.forEach((state,heading)=>{
        if(heading.isConnected)buildLines(heading,state);
      }),160);
    };
    window.addEventListener('resize',onResize,{passive:true});

    return()=>{
      cancelled=true;
      clearTimeout(resizeTimer);
      observer?.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize',onResize);
      states.forEach((state,heading)=>{
        state.animations.forEach(animation=>animation.cancel());
        heading.innerHTML=state.originalHtml;
        if(state.originalAriaLabel===null)heading.removeAttribute('aria-label');else heading.setAttribute('aria-label',state.originalAriaLabel);
        delete heading.dataset.headingReveal;
        delete heading.dataset.headingRevealState;
      });
      states.clear();
    };
  },[]);

  return null;
}
