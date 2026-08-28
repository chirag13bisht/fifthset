import { useEffect } from 'react';
import { useLenis } from './hooks/useLenis';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Manifesto from './sections/Manifesto';
import Anatomy from './sections/Anatomy';
import Tiers from './sections/Tiers';
import Partner from './sections/Partner';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import RsvpModal from './components/RsvpModal';
import ParchmentUnroll from './effects/ParchmentUnroll';
import { siteConfig } from './config';

function App() {
  useLenis();

  useEffect(() => {
    document.title = siteConfig.siteTitle || '';
    document.documentElement.lang = siteConfig.language || '';

    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = siteConfig.siteDescription || '';
  }, []);

  return (
    <>
      <Navigation />
      <ParchmentUnroll />
      <main>
        <Hero />
        <Manifesto />
        <Anatomy />
        <Tiers />
        <Partner />
        <Contact />
        <Footer />
      </main>
      <RsvpModal />
    </>
  );
}

export default App;
