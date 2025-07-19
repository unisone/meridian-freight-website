import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
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
            Professional Machinery Logistics
          </div>

          {/* Main Heading - Responsive text sizing */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Specialized Pickup, Dismantling, and Container Packing for Agricultural & Heavy-Duty Machinery
          </h1>

          {/* Subtitle - Responsive text sizing */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2">
            Comprehensive logistics solutions for agricultural and heavy machinery—offering professional dismantling, 
            secure storage, and container packing services across the USA & Canada, ensuring smooth delivery to global destinations.
          </p>

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