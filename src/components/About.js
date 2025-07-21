import React from 'react';

const About = () => {
  return (
    <section className="section-padding bg-gray-50" id="about-mf">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <p className="text-blue-600 font-semibold text-base sm:text-lg mb-4 sm:mb-6">Efficiency</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
              Complete Machinery Export Solutions Across USA & Canada
            </h2>
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-10">
              Meridian Freight provides comprehensive machinery export services including dismantling, packing, sales, and shipping for agricultural, construction, mining, and road-building equipment. With strategic warehouse partnerships across California, Georgia, Illinois, North Dakota, Texas, and Alberta, we handle everything from equipment procurement to final delivery worldwide.
            </p>
            <a 
              href="mailto:info@meridianfreightllc.com" 
              className="inline-block bg-blue-600 text-white font-semibold py-4 sm:py-5 px-8 sm:px-10 rounded-xl hover:bg-blue-700 transition-all duration-200 text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get a quote
            </a>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="/images/john-deere-s670.jpg"
                alt="Agricultural machinery loading and heavy equipment transportation"
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Second Section - Enhanced mobile spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mt-16 sm:mt-20 lg:mt-24">
          {/* Left Image */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="/images/warehousing.jpg"
                alt="Heavy machinery loading for international logistics"
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
          </div>

          {/* Right Content */}
          <div className="order-1 lg:order-2">
            <p className="text-blue-600 font-semibold text-base sm:text-lg mb-4 sm:mb-6">Efficiency</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
              From Farm to Container — Expert Dismantling, Sales & Shipping
            </h2>
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-10">
              Our specialized team handles the complete export process for heavy machinery including equipment sales, expert dismantling, secure container packing, and international shipping coordination. We manage agricultural equipment, construction machinery, mining equipment, and road-building attachments from initial procurement through final delivery with full attention to safety and international compliance regulations.
            </p>
            <a 
              href="mailto:info@meridianfreightllc.com" 
              className="inline-block bg-blue-600 text-white font-semibold py-4 sm:py-5 px-8 sm:px-10 rounded-xl hover:bg-blue-700 transition-all duration-200 text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get a quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 