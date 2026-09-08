import { Hero } from '@/components/hero/hero';
import { ProductTour, type ProductRenders } from '@/components/product-tour/product-tour';

const renders: ProductRenders = {
  join: { src: '/images/renders/join.svg', alt: 'Join Pigeon and create your account' },
  predictions: { src: '/images/renders/predictions.svg', alt: 'Explore predictions and trade on real-world outcomes' },
  arena: { src: '/images/renders/arena.svg', alt: 'Share takes and join conversations in Pigeon Arena' },
  profile: { src: '/images/renders/profile.svg', alt: 'Track your positions and prediction history on your profile' },
};

export default function Home() { return <main><Hero /><ProductTour renders={renders} /></main>; }
