import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "What are the additional charges during transit?",
      answer: "Any additional charges incurred during the transit are paid by the buyer. These charges can include customs inspection fees, x-ray fees, port storage charges (in case of vessel delays), and fees related to the terminal's refusal to accept cargo (e.g., strikes or lack of available space). Additionally, customs may order the cargo to be re-lashed, which also incurs extra charges."
    },
    {
      question: "What happens if my cargo is delayed and incurs port storage charges?",
      answer: "If your cargo is delayed and incurs port storage charges, these charges will be the responsibility of the buyer. Port storage charges can occur if the vessel is delayed for any reason."
    },
    {
      question: "How long can I store my goods at the warehouse for free?",
      answer: "Storage at the warehouse is free for the first 31 days. After this period, a charge of $25 per day will apply for each additional day your goods remain in storage."
    },
    {
      question: "What regions do you operate in for loading equipment?",
      answer: "We partner with several warehouses capable of loading equipment for us in the following regions: California, Georgia, Illinois, North Dakota, Texas, and Alberta, Canada. This allows us to efficiently manage logistics across these key areas."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Header - Enhanced mobile spacing */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <p className="text-blue-600 font-semibold text-base sm:text-lg lg:text-xl mb-4 sm:mb-6">Learn More From</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
            Find answers to common questions about our logistics services to better understand how we can help your business.
          </p>
          
          <button className="bg-blue-600 text-white font-semibold py-4 sm:py-5 px-8 sm:px-10 rounded-xl hover:bg-blue-700 transition-all duration-200 text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:scale-105">
            Contact us
          </button>
        </div>

        {/* FAQ Items - Enhanced mobile layout */}
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-200">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-6 sm:p-8 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                aria-expanded={openFaq === index}
                aria-controls={`faq-answer-${index}`}
              >
                <div className="flex items-start sm:items-center justify-between space-x-4">
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1">
                    <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 flex-shrink-0 mt-1 sm:mt-0" />
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 leading-snug text-left">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    {openFaq === index ? (
                      <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                    )}
                  </div>
                </div>
              </button>
              
              {openFaq === index && (
                <div 
                  id={`faq-answer-${index}`}
                  className="px-6 sm:px-8 pb-6 sm:pb-8 animate-fade-in"
                >
                  <div className="pl-9 sm:pl-11">
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional CTA Section */}
        <div className="text-center mt-16 sm:mt-20">
          <div className="bg-blue-50 rounded-2xl p-8 sm:p-12 max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-6 sm:mb-8 text-lg sm:text-xl leading-relaxed">
              Our team is here to help with any additional questions about our machinery packing and shipping services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:info@meridianfreightllc.com"
                className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-blue-700 transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Email Us
              </a>
              <a 
                href="tel:+17863973888"
                className="border-2 border-blue-600 text-blue-600 font-semibold py-4 px-8 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-200 text-lg"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 