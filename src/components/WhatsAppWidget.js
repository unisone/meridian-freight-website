import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppContact = () => {
    window.open('https://api.whatsapp.com/send/?phone=17863973888&text&type=phone_number&app_absent=0', '_blank');
  };

  return (
    <>
      {/* WhatsApp Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 w-72 sm:w-80 bg-white rounded-lg shadow-2xl z-50 border">
          {/* Header */}
          <div className="bg-green-500 text-white p-3 sm:p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src="/logos/MF Logos White/meridianFreight-logo-mobile-w-150.png"
                  alt="MF"
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                />
              </div>
              <div>
                <h4 className="font-semibold text-sm sm:text-base">Meridian Freight Inc.</h4>
                <p className="text-xs opacity-90">Typically replies within minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4">
            <div className="bg-gray-100 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-700">
                Any questions related to the equipment pickup or export?
              </p>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              <button 
                onClick={handleWhatsAppContact}
                className="w-full bg-green-500 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm"
              >
                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Contact Us</span>
              </button>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Online</span>
                <span>|</span>
                <button className="text-blue-500 hover:underline">Privacy policy</button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-2 sm:p-3 rounded-b-lg">
            <p className="text-xs text-center text-gray-600">
              Contact Us On WhatsApp
            </p>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all z-50 flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>
    </>
  );
};

export default WhatsAppWidget; 