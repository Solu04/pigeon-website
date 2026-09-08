"use client";
import { useState, type CSSProperties } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export type ProductTabId = 'join' | 'predictions' | 'arena' | 'profile';
export type ProductRenders = Record<ProductTabId, {src:string;alt:string}>;
const tabs = [
  {id:'join',label:'Join',color:'#fc6457',title:'Join where the world happens.',description:'Create your account, personalize your profile, and become part of a community that predicts, debates, and trade the events of our world.',number:'01'},
  {id:'predictions',label:'Predictions',color:'#9fc4f8',title:'Predict, trade, & profit.',description:'Trade on real-world outcomes across politics, sports, global events, and more. Buy low, sell high, and cash out when you’re right!',number:'02'},
  {id:'arena',label:'Arena',color:'#ffcde6',title:'Discuss, react, & challenge ideas.',description:'Say it before it happens. Share your take, react to others, and see what the community thinks in real time.',number:'03'},
  {id:'profile',label:'Profile',color:'#fbe84c',title:'Track Learn, & Level up.',description:'See your positions, performance, and prediction history all in one place. The more you predict, the better you get.',number:'04'},
] as const;

/** Render sources are supplied explicitly so a tab never displays another tab’s screen. */
export function ProductTour({renders}:{renders:ProductRenders}) {
  const [active,setActive]=useState<ProductTabId>('join');
  return <section className="product-tour" aria-label="Discover Pigeon">
    <div className="site-container"><Tabs orientation="vertical" value={active} onValueChange={value=>setActive(value as ProductTabId)} className="product-tabs">
      <div className="product-render-stage">
        {tabs.map(tab=><TabsContent key={tab.id} value={tab.id} className="product-render-panel">
          <img className="product-render-image" src={renders[tab.id].src} alt={renders[tab.id].alt} width={611} height={511}/>
        </TabsContent>)}
      </div>
      <TabsList className="product-tab-list" aria-label="Pigeon features">
        {tabs.map(tab=><TabsTrigger key={tab.id} value={tab.id} className="product-tab" style={{'--tab-color':tab.color} as CSSProperties} aria-label={tab.label}>
          <span className="product-tab-header"><span className="product-tab-label">{tab.label}</span><img className="product-tab-icon" src={'/images/tabs/'+tab.id+'.svg'} alt="" width={30} height={30}/></span>
          <span className="product-tab-details" aria-hidden={active!==tab.id}><span className="product-tab-details-inner"><span className="product-tab-title">{tab.title}</span><span className="product-tab-description">{tab.description}</span><span className="product-tab-number">{tab.number}</span></span></span>
        </TabsTrigger>)}
      </TabsList>
    </Tabs></div>
  </section>;
}
