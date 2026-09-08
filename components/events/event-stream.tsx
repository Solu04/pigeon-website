"use client";

import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Keep readable server-rendered rows, then animate one combined transform per row. */
export function EventStream({children}:{children:ReactNode}) {
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const activeAnimations = useRef<Animation[]>([]);
  const stream = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = stream.current;
    if (!element) return;
    const rows = Array.from(element.querySelectorAll<HTMLElement>('.event-row'));
    const started = performance.now();
    let animations: Animation[] = [];

    function update() {
      animations.forEach(animation => animation.cancel());
      animations = [];
      if (!element) return;
      const height = element.clientHeight;
      const overscan = 75;
      // Linear interpolation between exactly two rails. Y only moves upward;
      // X reverses abruptly at the midpoint, with no curved turn or easing.
      const keyframes: Keyframe[] = [
        {transform:`translate3d(0px, ${height + overscan}px, 0)`,offset:0},
        {transform:`translate3d(-100px, ${height / 2}px, 0)`,offset:0.5},
        {transform:`translate3d(0px, ${-overscan}px, 0)`,offset:1},
      ];
      const elapsed = performance.now() - started;
      rows.forEach((row,index) => {
        const animation = row.animate(keyframes, {duration:30000,iterations:Infinity,easing:'linear'});
        animation.currentTime = elapsed + index * 30000 / rows.length;
        if (pausedRef.current) animation.pause();
        animations.push(animation);
      });
      activeAnimations.current = animations;
    }

    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
    };
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
    activeAnimations.current.forEach(animation => paused ? animation.pause() : animation.play());
  }, [paused]);

  return <div className="events-motion"><div ref={stream} className="events-stream" aria-label="Events and topics on Pigeon">{children}</div><button type="button" className="events-motion-toggle" aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused ? 'Play animation' : 'Pause animation'}</button></div>;
}
