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
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Complete Machinery Export Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            From farm to container and beyond — we specialize in machinery dismantling, packing, sales, and shipping services for agricultural, construction, mining, and road-building equipment across USA & Canada.
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
            Contact us today for a personalized quote and discover how we can help with your machinery packing and container loading needs.
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