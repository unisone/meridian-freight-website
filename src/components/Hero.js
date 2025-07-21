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
          {/* Badge - Enhanced for mobile */}
          <div className="inline-block bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium mb-6 sm:mb-8 shadow-lg">
            Professional Machinery Packing Services
          </div>

          {/* Main Heading - Significantly improved mobile typography */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 leading-tight max-w-4xl mx-auto">
            We Disassemble & Load Heavy Machinery for Global Export
          </h1>

          {/* Subtitle - Better mobile readability */}
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            Fast. Secure. Worldwide. We load combines, tractors, and attachments into 40ft containers — ready to ship anywhere.
          </h2>

          {/* CTA Buttons - Enhanced for mobile touch */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center max-w-lg mx-auto">
            <Link 
              to="#services-mf" 
              className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-4 sm:py-5 px-8 sm:px-10 rounded-lg hover:bg-blue-700 transition-all duration-200 text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Our Services
            </Link>
            <a 
              href="mailto:info@meridianfreightllc.com" 
              className="w-full sm:w-auto border-2 border-white text-white font-semibold py-4 sm:py-5 px-8 sm:px-10 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Contact Us
            </a>
          </div>

          {/* Additional mobile-friendly spacing */}
          <div className="mt-12 sm:mt-16">
            <p className="text-sm sm:text-base text-gray-200 opacity-90">
              Trusted by agricultural and construction companies worldwide
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 