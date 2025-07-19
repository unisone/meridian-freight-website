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
              End-to-End Logistics for Agricultural & Heavy Machinery Across USA & Canada
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              With a dedicated fleet and strategic warehouse partnerships, Meridian Freight ensures reliable transportation and storage solutions for heavy equipment. Serving key regions in the USA and Canada, including California, Georgia, Illinois, North Dakota, Texas, and Alberta, our services guarantee secure handling, flexible warehousing, and smooth delivery from pickup to final destination.
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
              Professional Machinery Dismantling and Container Loading Services
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              We provide expert dismantling and secure container loading services for agricultural and heavy-duty machinery. Our specialized team ensures that every machine is disassembled, packed, and prepared for global export, with attention to safety and compliance regulations for seamless international shipping.
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