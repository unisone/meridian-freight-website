import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Phone, Mail } from 'lucide-react';

const FAQPage = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      category: "General Services",
      questions: [
        {
          question: "What types of machinery do you handle?",
          answer: "We specialize in agricultural and heavy-duty machinery including tractors, combines, excavators, bulldozers, industrial equipment, mining machinery, and forestry equipment. Our team has expertise in handling all major brands and models."
        },
        {
          question: "What areas do you serve?",
          answer: "We provide services across the USA and Canada, with particular expertise in California, Georgia, Illinois, North Dakota, Texas, and Alberta. We have strategic partnerships that allow us to serve clients nationwide."
        },
        {
          question: "How long have you been in business?",
          answer: "Meridian Freight Inc. has been providing specialized machinery logistics services for over 10 years, with a proven track record of 500+ successfully completed projects."
        }
      ]
    },
    {
      category: "Pickup & Transportation",
      questions: [
        {
          question: "How do you handle equipment pickup?",
          answer: "We provide door-to-door pickup services using our specialized fleet. Our experienced operators assess each piece of equipment and use appropriate lifting and loading equipment to ensure safe transportation."
        },
        {
          question: "Do you provide transportation insurance?",
          answer: "Yes, all our transportation services are fully insured. We carry comprehensive coverage for equipment damage, theft, and liability during transit."
        },
        {
          question: "What's the typical pickup timeframe?",
          answer: "Standard pickup scheduling is within 3-5 business days. For urgent requests, we offer expedited services with same-day or next-day pickup options."
        }
      ]
    },
    {
      category: "Dismantling Services",
      questions: [
        {
          question: "What is included in your dismantling service?",
          answer: "Our dismantling service includes complete or partial disassembly, component organization and labeling, protective packaging of parts, and detailed documentation of the process for reassembly."
        },
        {
          question: "Do you provide reassembly services?",
          answer: "While our primary focus is dismantling and export preparation, we can recommend trusted partners for reassembly services at the destination."
        },
        {
          question: "How do you ensure parts aren't lost during dismantling?",
          answer: "We use a comprehensive labeling and documentation system. Each component is tagged, photographed, and cataloged. All hardware is bagged and labeled with corresponding assembly points."
        }
      ]
    },
    {
      category: "Container Packing",
      questions: [
        {
          question: "What container sizes do you work with?",
          answer: "We work with standard 20ft, 40ft, and 40ft high-cube containers. Our team optimizes space utilization to maximize the amount of equipment per container while ensuring secure packing."
        },
        {
          question: "How do you secure equipment in containers?",
          answer: "We use professional blocking, bracing, and tie-down methods. Equipment is positioned to prevent shifting during transport, and we use appropriate dunnage materials to protect surfaces."
        },
        {
          question: "Do you handle customs documentation?",
          answer: "Yes, we assist with export documentation and can coordinate with customs brokers to ensure all paperwork is properly completed for international shipping."
        }
      ]
    },
    {
      category: "Storage & Warehousing",
      questions: [
        {
          question: "Do you offer storage services?",
          answer: "Yes, we provide secure storage solutions for dismantled equipment and components. Our climate-controlled facilities ensure your equipment remains in optimal condition."
        },
        {
          question: "How long can equipment be stored?",
          answer: "We offer flexible storage terms from short-term (days) to long-term (months) depending on your shipping schedule and requirements."
        },
        {
          question: "Is the storage facility secure?",
          answer: "Our storage facilities feature 24/7 security monitoring, controlled access, and comprehensive insurance coverage for stored equipment."
        }
      ]
    },
    {
      category: "Pricing & Payment",
      questions: [
        {
          question: "How do you calculate pricing?",
          answer: "Pricing is based on factors including equipment size/weight, complexity of dismantling, distance for pickup, storage requirements, and container packing needs. We provide detailed quotes for each project."
        },
        {
          question: "Do you offer payment plans?",
          answer: "We work with clients to establish payment terms that fit their needs, including milestone-based payments for larger projects."
        },
        {
          question: "Is there a minimum order requirement?",
          answer: "We handle projects of all sizes, from single pieces of equipment to large fleet relocations. No minimum order requirements."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container-custom section-padding">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-600 rounded-full px-4 py-2 mb-4">
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Frequently Asked Questions</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            FAQ - Common Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to the most common questions about our machinery logistics services. 
            Can't find what you're looking for? Contact us directly.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              {/* Category Header */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-200 pb-2">
                {category.category}
              </h2>

              {/* Questions */}
              <div className="space-y-4">
                {category.questions.map((item, questionIndex) => {
                  const itemKey = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openItems[itemKey];

                  return (
                    <div 
                      key={questionIndex}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      {/* Question */}
                      <button
                        onClick={() => toggleItem(itemKey)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 pr-4">
                          {item.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        )}
                      </button>

                      {/* Answer */}
                      {isOpen && (
                        <div className="px-6 pb-4 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed pt-4">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 md:p-12 text-white text-center max-w-4xl mx-auto mt-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Still Have Questions?
          </h3>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Our experienced team is ready to answer any specific questions about your machinery logistics needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+17863973888"
              className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Call Us: +1 (786) 397-3888</span>
            </a>
            <a 
              href="mailto:info@meridianfreightllc.com"
              className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage; 