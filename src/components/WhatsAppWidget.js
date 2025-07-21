import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppContact = () => {
    window.open('https://api.whatsapp.com/send/?phone=17863973888&text&type=phone_number&app_absent=0', '_blank');
  };

  return (
    <>
      {/* WhatsApp Chat Widget - Enhanced for mobile */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 w-80 sm:w-96 bg-white rounded-xl shadow-2xl z-50 border">
          {/* Header - Enhanced touch targets */}
          <div className="bg-green-500 text-white p-4 sm:p-5 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src="/logos/MF Logos White/meridianFreight-logo-mobile-w-150.png"
                  alt="Meridian Freight Inc. - Professional Machinery Export Services"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  loading="lazy"
                />
              </div>
              <div>
                <h4 className="font-semibold text-base sm:text-lg">Meridian Freight Inc.</h4>
                <p className="text-sm opacity-90">Typically replies within minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content - Enhanced spacing and touch targets */}
          <div className="p-4 sm:p-6">
            <div className="bg-gray-100 rounded-xl p-4 mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-gray-700">
                Any questions related to the equipment pickup or export?
              </p>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={handleWhatsAppContact}
                className="w-full bg-green-500 text-white py-4 px-6 rounded-xl hover:bg-green-600 transition-all duration-200 flex items-center justify-center space-x-3 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Send className="w-5 h-5" />
                <span>Contact Us</span>
              </button>
              
              <div className="flex items-center justify-center space-x-3 text-sm text-gray-500">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Online</span>
                <span>|</span>
                <button className="text-blue-500 hover:underline hover:text-blue-600 transition-colors py-1 px-2 rounded">
                  Privacy policy
                </button>
              </div>
            </div>
          </div>

          {/* Footer - Enhanced */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-b-xl">
            <p className="text-sm text-center text-gray-600">
              Contact Us On WhatsApp
            </p>
          </div>
        </div>
      )}

      {/* WhatsApp Button - Enhanced touch target */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 sm:w-18 sm:h-18 bg-green-500 text-white rounded-full shadow-xl hover:bg-green-600 transition-all duration-200 z-50 flex items-center justify-center transform hover:scale-110 active:scale-95"
        aria-label="Open WhatsApp chat"
      >
        <MessageCircle className="w-8 h-8 sm:w-9 sm:h-9" />
      </button>
    </>
  );
};

export default WhatsAppWidget; 