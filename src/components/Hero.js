import React from 'react';

const Hero = () => {
  const handleScrollTo = (elementId) => {
    const element = document.querySelector(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="main-content" 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600" 
      style={{
        backgroundImage: `url('/images/logistics1.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white px-6 md:px-8 lg:px-4">
        <div className="max-w-5xl mx-auto">
          {/* Badge - Enhanced for mobile with better spacing */}
          <div className="inline-block bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium mb-8 sm:mb-10 md:mb-12 shadow-lg">
            Professional Machinery Packing Services
          </div>

          {/* Main Heading - Better breakpoint handling */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 md:mb-10 leading-tight max-w-4xl mx-auto px-2">
            We Disassemble & Load Heavy Machinery for Global Export
          </h1>

          {/* Subtitle - Better spacing and sizing */}
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl text-white mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-2">
            Fast. Secure. Worldwide. We load combines, tractors, and attachments into 40ft containers — ready to ship anywhere.
          </h2>

          {/* CTA Buttons - Better spacing at medium breakpoints */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center max-w-md sm:max-w-lg mx-auto px-4">
            <button 
              onClick={() => handleScrollTo('#services-mf')}
              className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-4 sm:py-5 px-8 sm:px-10 rounded-lg hover:bg-blue-700 transition-all duration-200 text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Our Services
            </button>
            <button 
              onClick={() => handleScrollTo('#contact')}
              className="w-full sm:w-auto border-2 border-white text-white font-semibold py-4 sm:py-5 px-8 sm:px-10 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Contact Us
            </button>
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