import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import About from '../components/About';
import Services from '../components/Services';
import Projects from '../components/Projects';
import PricingTable from '../components/PricingTable';
import VideoSection from '../components/VideoSection';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import WhatsAppWidget from '../components/WhatsAppWidget';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Stats />
      <div id="about-mf">
        <About />
      </div>
      <div id="services-mf">
        <Services />
      </div>
      <div id="projects">
        <Projects />
      </div>
      <PricingTable />
      <VideoSection />
      <FAQ />
      <Contact />
      <WhatsAppWidget />
    </div>
  );
};

export default HomePage; 