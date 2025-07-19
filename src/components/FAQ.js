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
      answer: "If your cargo is delayed and incurs port storage charges, these charges will be the responsibility of the buyer. Port storage charges can occur if the vessel is delayed for any reason"
    },
    {
      question: "How long can I store my goods at the warehouse for free?",
      answer: "Storage at the warehouse is free for the first 31 days. After this period, a charge of $25 per day will apply for each additional day your goods remain in storage"
    },
    {
      question: "What regions do you operate in for loading equipment?",
      answer: "We partner with several warehouses capable of loading equipment for us in the following regions: California, Georgia, Illinois, North Dakota, Texas, and Alberta, Canada. This allows us to efficiently manage logistics across these key areas"
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-blue-600 font-semibold text-lg mb-4">Learn More From</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to common questions about our logistics services to better understand how we can help your business.
          </p>
          
          <button className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
            Contact us
          </button>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  {openFaq === index ? (
                    <ChevronUp className="w-6 h-6 text-blue-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              </button>
              
              {openFaq === index && (
                <div className="px-8 pb-6">
                  <div className="pl-10">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 