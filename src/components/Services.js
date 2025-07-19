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
      icon: Truck,
      title: "Inland Transportation",
      description: "Fast and secure delivery within the USA and Canada. Our fleet of trucks ensures timely and efficient transport of your equipment."
    },
    {
      icon: Shield,
      title: "Container Loading and Packing",
      description: "Expert handling and packing for all types of machinery. We offer partial or complete disassembly and secure loading to ensure safe transit."
    },
    {
      icon: Globe,
      title: "Agricultural Machinery and Farm Equipment Dismantling",
      description: "Specialized in dismantling and packing agricultural machinery. We provide washing and fumigating services for quarantine compliance."
    },
    {
      icon: FileText,
      title: "Export Logistics",
      description: "Comprehensive export logistics solutions. We handle everything from documentation to final delivery, ensuring a smooth export process."
    },
    {
      icon: Users,
      title: "Storage Services",
      description: "Secure storage solutions for your equipment. Our warehouses are strategically located to facilitate easy access and safe storage."
    },
    {
      icon: Clock,
      title: "Professional Machinery Dismantling and Container Loading Services",
      description: "We provide expert dismantling and secure container loading services for agricultural and heavy-duty machinery."
    }
  ];

  return (
    <section className="section-padding bg-white" id="services-mf">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Offering a wide range of services to meet all logistics needs, Meridian Freight Inc. ensures efficient handling of agricultural and heavy-duty machinery
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-8">
            Contact us today for a personalized quote and discover how we can help with your machinery logistics needs.
          </p>
          <a 
            href="mailto:info@meridianfreightllc.com" 
            className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services; 