import type { Metadata } from 'next';
import { Footer } from '@/components/landing/footer';
import { NewSections } from '@/components/landing/new-sections';
import { EventsSection } from '@/components/events/events-section';
import { WaitlistProvider } from '@/components/waitlist/waitlist-provider';
import { Hero } from '@/components/hero/hero';
import { ProductTour, type ProductRenders } from '@/components/product-tour/product-tour';

const renders: ProductRenders = {
  join: { src: '/images/renders/join.svg', alt: 'Join Pigeon and create your account' },
  predictions: { src: '/images/renders/predictions.svg', alt: 'Explore predictions and trade on real-world outcomes' },
  arena: { src: '/images/renders/arena.svg', alt: 'Share takes and join conversations in Pigeon Arena' },
  profile: { src: '/images/renders/profile.svg', alt: 'Track your positions and prediction history on your profile' },
};

export const metadata: Metadata = {
  title: 'Predict What Happens Next',
  description: 'Join Pigeon Arena to predict real-world events, back your views, follow live markets, and discover what the crowd believes.',
  openGraph: { title: 'Pigeon Arena — Predict What Happens Next', description: 'Predict real-world events, back your views, and see what the crowd believes.', images: [{url:'/images/meta/home-opengraph.png',width:1512,height:982,alt:'Pigeon Arena homepage'}] },
  twitter: { card:'summary_large_image', title:'Pigeon Arena — Predict What Happens Next', description:'Predict real-world events, back your views, and see what the crowd believes.', images:['/images/meta/home-opengraph.png'] },
};

export default function Home() { return <WaitlistProvider><main><Hero /><ProductTour renders={renders} /><EventsSection /><NewSections /></main><Footer /></WaitlistProvider>; }
