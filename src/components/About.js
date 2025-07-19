import React from 'react';

const About = () => {
  return (
    <section className="section-padding bg-gray-50" id="about-mf">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <p className="text-blue-600 font-semibold text-lg mb-4">Efficiency</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Complete Machinery Export Solutions Across USA & Canada
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Meridian Freight provides comprehensive machinery export services including dismantling, packing, sales, and shipping for agricultural, construction, mining, and road-building equipment. With strategic warehouse partnerships across California, Georgia, Illinois, North Dakota, Texas, and Alberta, we handle everything from equipment procurement to final delivery worldwide.
            </p>
            <a 
              href="mailto:info@meridianfreightllc.com" 
              className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Get a quote
            </a>
          </div>

          {/* Right Image */}
          <div>
            <img 
              src="/images/john-deere-s670.jpg"
              alt="Agricultural machinery loading and heavy equipment transportation"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Second Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-16">
          {/* Left Image */}
          <div className="order-2 lg:order-1">
            <img 
              src="/images/warehousing.jpg"
              alt="Heavy machinery loading for international logistics"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Right Content */}
          <div className="order-1 lg:order-2">
            <p className="text-blue-600 font-semibold text-lg mb-4">Efficiency</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              From Farm to Container — Expert Dismantling, Sales & Shipping
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Our specialized team handles the complete export process for heavy machinery including equipment sales, expert dismantling, secure container packing, and international shipping coordination. We manage agricultural equipment, construction machinery, mining equipment, and road-building attachments from initial procurement through final delivery with full attention to safety and international compliance regulations.
            </p>
            <a 
              href="mailto:info@meridianfreightllc.com" 
              className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors inline-block"
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