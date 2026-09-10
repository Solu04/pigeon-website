"use client";
import { useRef, type PointerEvent } from 'react';
import { WaitlistButton } from '@/components/waitlist/waitlist-button';
import { useWaitlist } from '@/components/waitlist/waitlist-provider';

export function Footer(){
 const eyes=useRef<SVGSVGElement>(null);
 const {setDialog}=useWaitlist();
 function look(x:number,y:number){
  eyes.current?.style.setProperty('--gaze-x',x+'px');
  eyes.current?.style.setProperty('--gaze-y',y+'px');
  eyes.current?.style.setProperty('--gaze-active','1');
 }
 function follow(event:PointerEvent<HTMLDivElement>){
  const box=event.currentTarget.getBoundingClientRect();
  look(Math.max(-1,Math.min(1,(event.clientX-box.left)/box.width*2-1))*10,17+(event.clientY-box.top)/box.height*5);
 }
 function reset(){eyes.current?.style.setProperty('--gaze-active','0');eyes.current?.style.setProperty('--gaze-x','0px');eyes.current?.style.setProperty('--gaze-y','0px');}
 return <footer className="pigeon-footer site-container" aria-labelledby="footer-heading">
  <h2 id="footer-heading" className="landing-display footer-heading">Move with<br/>the flock</h2>
  <svg ref={eyes} className="footer-eyes" width="215" height="130" viewBox="0 0 215 130" fill="none" aria-hidden="true"><path d="M49.5099 19.3502C50.4807 19.2325 53.1386 19.2947 54.1305 19.3243C62.1109 19.5627 68.9503 22.1657 75.5062 26.6675C76.4488 27.3149 76.6633 27.9056 77.5624 28.6423C80.2346 30.832 82.8122 32.9946 84.8754 35.7981C85.5322 36.6904 86.1656 37.7918 86.7964 38.7305C87.1934 39.3211 88.0426 40.0945 88.2753 40.5174C89.5775 42.8835 90.7088 45.4805 91.7066 47.9865C92.1115 49.0034 92.871 50.5594 93.1627 51.5379C93.5408 52.8067 93.9188 54.5109 94.2246 55.8266C94.8175 58.3784 95.0455 61.2738 95.1841 63.9179C95.5161 70.2586 95.1839 76.4479 93.125 82.5103C92.788 83.5023 92.0454 84.7868 91.604 85.8372C90.7525 87.864 89.7457 89.879 88.6059 91.7537C88.0887 92.6042 87.4133 93.0163 86.8502 93.7512C79.7586 103.082 69.6269 109.628 58.2156 112.255C56.4209 112.932 54.1333 113.073 52.2909 113.239C37.3662 114.646 25.1656 106.125 18.8728 92.9719C15.9471 86.8565 14.164 79.1145 13.6474 72.3474C13.3819 67.1882 13.6437 60.8879 14.5421 55.8239C15.2468 51.8526 17.2661 44.4811 19.1417 41.0212C25.6568 29.003 35.6633 20.2906 49.5099 19.3502Z" fill="#FEFEFE"/><path className="footer-pupil footer-pupil--left" d="M71.4532 46.2492C71.6863 46.2295 71.9199 46.2148 72.1537 46.2048C75.4574 46.0632 77.9706 46.6759 80.4232 48.9536C83.6177 51.885 85.4884 55.9884 85.6078 60.3258C85.7882 65.7086 84.7833 68.9921 81.114 73.1925C79.1184 75.4769 76.4812 76.2414 73.4956 76.3429C70.7367 76.5079 68.007 75.7027 65.7777 74.0667C62.8127 71.8913 60.0645 67.3686 59.5164 63.7275C58.8326 59.1859 59.9 55.1404 62.6266 51.4533C64.7598 48.6109 67.9366 46.738 71.4532 46.2492Z" fill="black"/><path d="M150.798 16.9405C152.402 16.8765 154.005 16.8503 155.609 16.8621C162.982 16.9478 168.567 18.5531 174.855 22.4973C176.465 23.5326 179.023 25.1016 180.261 26.5806C182.471 29.2252 185.54 32.0625 187.353 34.9323C191.284 41.2745 194.532 48.6415 196.09 55.9594C196.918 59.8472 197.521 65.7514 197.502 69.7142C197.45 80.4533 195.17 91.3326 187.46 99.2833C182.394 104.508 175.929 107.75 168.737 108.788C166.815 109.076 165.353 109.48 163.332 109.442C151.262 109.964 140.865 106.846 131.503 99.0428C123.173 92.1014 117.546 82.022 116.616 71.1494C115.787 61.3607 117.434 51.5207 121.404 42.5376C122.022 41.1624 122.9 39.8175 123.544 38.4279C128.382 27.9889 138.734 17.8802 150.798 16.9405Z" fill="#FEFEFE"/><path className="footer-pupil footer-pupil--right" d="M141.359 43.7211C144.085 43.4354 147.69 44.7376 149.758 46.4551C156.924 52.4092 157.395 62.0059 151.91 69.0806C149.754 71.8303 146.611 73.6286 143.152 74.0923C143.085 74.102 143.017 74.11 142.95 74.1164C140.081 74.4167 136.855 73.0492 134.71 71.204C131.308 68.2752 129.421 65.4176 129.032 60.9025C128.367 53.1876 133.055 44.416 141.359 43.7211Z" fill="black"/></svg>
  <div className="footer-join" onPointerMove={follow} onPointerLeave={reset} onPointerCancel={reset} onFocus={()=>look(0,20)} onBlur={reset}><WaitlistButton/></div>
  <div className="footer-links">
   <nav aria-label="Footer product"><h3>Product</h3><a href="/#features">Features</a><a href="#faq-heading">FAQ</a><button onClick={()=>setDialog('waitlist')}>Waitlist</button></nav>
   <nav aria-label="Footer company"><h3>Company</h3><a href="/about">About</a><span>Contact</span><span>Operations</span></nav>
   <nav aria-label="Footer legal"><h3>Legal</h3><span>Privacy Policy</span><span>Terms of Service</span></nav>
  </div>
  <div className="footer-socials" aria-label="Social media">{[['x','X'],['instagram','Instagram'],['tiktok','TikTok'],['whatsapp','WhatsApp']].map(([icon,label])=><span key={icon} aria-label={label}><img src={'/images/footer/'+icon+'.svg'} width={16} height={16} alt={label}/></span>)}</div>
 </footer>;
}
