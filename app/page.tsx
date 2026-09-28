import type { Metadata } from 'next';
import { Footer } from '@/components/landing/footer';
import { NewSections } from '@/components/landing/new-sections';
import { EventsSection } from '@/components/events/events-section';
import { WaitlistProvider } from '@/components/waitlist/waitlist-provider';
import { Hero } from '@/components/hero/hero';
import { ProductTour, type ProductRenders } from '@/components/product-tour/product-tour';
import { getRequestOrigin, getSocialImage } from '@/lib/request-origin';

const renders: ProductRenders = {
  join: { src: '/images/renders/join.svg?v=20260928b', alt: 'Join Pigeon and create your account' },
  predictions: { src: '/images/renders/predictions.svg?v=20260928b', alt: 'Explore predictions and trade on real-world outcomes' },
  arena: { src: '/images/renders/arena.svg?v=20260928b', alt: 'Share takes and join conversations in Pigeon Arena' },
  profile: { src: '/images/renders/profile.svg?v=20260928b', alt: 'Track your positions and prediction history on your profile' },
};

export async function generateMetadata():Promise<Metadata>{
 const origin=await getRequestOrigin();
 const image=getSocialImage(origin);
 return {title:'Predict What Happens Next',description:'Join Pigeon Arena to predict real-world events, back your views, follow live markets, and discover what the crowd believes.',openGraph:{title:'Pigeon Arena — Predict What Happens Next',description:'Predict real-world events, back your views, and see what the crowd believes.',url:origin,siteName:'Pigeon Arena',type:'website',images:[{url:image,width:2400,height:1260,alt:'Pigeon Arena'}]},twitter:{card:'summary_large_image',title:'Pigeon Arena — Predict What Happens Next',description:'Predict real-world events, back your views, and see what the crowd believes.',images:[image]}};
}

export default function Home() { return <WaitlistProvider><main><Hero /><ProductTour renders={renders} /><EventsSection /><NewSections /></main><Footer /></WaitlistProvider>; }
