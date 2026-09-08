"use client";

import { useEffect, useRef, type ReactNode } from 'react';

/** Keep readable server-rendered rows, then animate one combined transform per row. */
export function EventStream({children}:{children:ReactNode}) {
  const stream = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = stream.current;
    if (!element) return;
    const rows = Array.from(element.querySelectorAll<HTMLElement>('.event-row'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const started = performance.now();
    let animations: Animation[] = [];

    function update() {
      animations.forEach(animation => animation.cancel());
      animations = [];
      if (!element || reducedMotion.matches) return;
      const height = element.clientHeight;
      const overscan = 75;
      const keyframes = Array.from({length:121}, (_,index) => {
        const progress = index / 120;
        const x = -100 * Math.pow(2 * progress - 1, 2);
        const y = -overscan + progress * (height + overscan * 2);
        return {transform:`translate3d(${x}px, ${y}px, 0)`,offset:progress};
      });
      const elapsed = performance.now() - started;
      rows.forEach((row,index) => {
        const animation = row.animate(keyframes, {duration:30000,iterations:Infinity,easing:'linear'});
        animation.currentTime = elapsed + index * 30000 / rows.length;
        animations.push(animation);
      });
    }

    const observer = new ResizeObserver(update);
    observer.observe(element);
    reducedMotion.addEventListener('change', update);
    update();
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener('change', update);
      animations.forEach(animation => animation.cancel());
    };
  }, []);

  return <div ref={stream} className="events-stream" aria-label="Events and topics on Pigeon">{children}</div>;
}
