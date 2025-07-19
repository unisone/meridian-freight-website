import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600" style={{
      backgroundImage: `url('/images/logistics1.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundBlendMode: 'overlay'
    }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-block bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            Professional Machinery Packing Services
          </div>

          {/* Main Heading - Responsive text sizing */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            We Disassemble & Load Heavy Machinery for Global Export
          </h1>

          {/* Subtitle - Responsive text sizing */}
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2 font-medium">
            Fast. Secure. Worldwide. We load combines, tractors, and attachments into 40ft containers — ready to ship anywhere.
          </h2>

          {/* CTA Buttons - Improved mobile layout */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link 
              to="#services-mf" 
              className="bg-blue-600 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Our Services
            </Link>
            <a 
              href="mailto:info@meridianfreightllc.com" 
              className="border-2 border-white text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors text-sm sm:text-base"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 