import React from 'react';
import {
  Truck,
  Shield,
  Globe,
  FileText,
  Users,
  Clock
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Shield,
      title: "Professional Machinery Dismantling & Packing",
      description: "Expert dismantling and packing services for agricultural, construction, mining, and road-building equipment into 40ft containers. Our core specialty - from farm to container with precision and care."
    },
    {
      icon: Clock,
      title: "Container Loading & Export Shipping",
      description: "Secure container loading and international shipping coordination for heavy machinery. Complete export logistics including vessel booking, documentation, and global delivery to your destination."
    },
    {
      icon: Truck,
      title: "Equipment Sales & Procurement",
      description: "Machinery sales and procurement services for agricultural, construction, and mining equipment. We help source, evaluate, and facilitate equipment transactions for international buyers."
    },
    {
      icon: Globe,
      title: "Agricultural Equipment Specialization",
      description: "Specialized services for combines, tractors, planters, and farm attachments. Complete washing, fumigation, and quarantine compliance for agricultural machinery export."
    },
    {
      icon: FileText,
      title: "Export Documentation & Compliance",
      description: "Complete export documentation, customs compliance, and shipping coordination. Full-service logistics support from initial paperwork to final delivery worldwide."
    },
    {
      icon: Users,
      title: "Equipment Storage & Warehousing",
      description: "Secure storage facilities across USA and Canada for machinery awaiting processing, packing, or shipment. Strategic warehouse locations for efficient logistics operations."
    }
  ];

  return (
    <section className="section-padding bg-white" id="services-mf">
      <div className="container-custom">
        {/* Header - Enhanced mobile spacing */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8">
            Complete Machinery Export Solutions
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            From farm to container and beyond — we specialize in machinery dismantling, packing, sales, and shipping services for agricultural, construction, mining, and road-building equipment across USA & Canada.
          </p>
        </div>

        {/* Services Grid - Mobile-optimized spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <div key={index} className="group bg-gray-50 rounded-xl p-6 sm:p-8 hover:shadow-xl hover:bg-white transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="w-16 h-16 sm:w-18 sm:h-18 bg-blue-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center mb-6 sm:mb-8 transition-colors duration-300">
                  <IconComponent className="w-8 h-8 sm:w-9 sm:h-9 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 leading-tight">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">
                  {service.description}
                </p>

                {/* Learn More Link */}
                <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 flex items-center space-x-2 group-hover:translate-x-1 transition-transform duration-200">
                  <span>Learn More</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* CTA Section - Enhanced mobile spacing */}
        <div className="text-center mt-16 sm:mt-20 lg:mt-24">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 sm:p-12 lg:p-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-8 sm:mb-10 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Contact us today for a personalized quote and discover how we can help with your machinery packing and container loading needs.
            </p>
            <a 
              href="mailto:info@meridianfreightllc.com" 
              className="inline-block bg-blue-600 text-white font-semibold py-4 sm:py-5 px-8 sm:px-10 rounded-xl hover:bg-blue-700 transition-all duration-200 text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get a Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services; 