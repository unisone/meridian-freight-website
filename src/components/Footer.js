import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6 sm:mb-8">
              <img
                src="/logos/MF Logos White/meridianFreight-logo-w-500.png"
                alt="Meridian Freight Inc. - Professional Machinery Export Services"
                className="h-14 sm:h-18"
                loading="lazy"
              />
            </div>
            <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg">
              Professional machinery packing and container loading services for agricultural, construction, mining, and road-building equipment. Based in USA, exporting globally.
            </p>

            {/* Contact Info - Enhanced touch targets */}
            <div className="space-y-4 sm:space-y-5">
              <a 
                href="https://api.whatsapp.com/send/?phone=17863973888&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 sm:space-x-4 hover:text-blue-400 transition-colors py-2 px-3 rounded-lg hover:bg-gray-800"
              >
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                <span className="text-gray-300 text-base sm:text-lg">+1 (786) 397-3888</span>
              </a>
              <a 
                href="mailto:info@meridianfreightllc.com"
                className="flex items-center space-x-3 sm:space-x-4 hover:text-blue-400 transition-colors py-2 px-3 rounded-lg hover:bg-gray-800"
              >
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                <span className="text-gray-300 text-base sm:text-lg">info@meridianfreightllc.com</span>
              </a>
              <div className="flex items-center space-x-3 sm:space-x-4 py-2 px-3">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                <span className="text-gray-300 text-base sm:text-lg">2107 148th, Albion, IA, USA</span>
              </div>
            </div>

            {/* Social Media Icons - Enhanced touch targets */}
            <div className="mt-6 sm:mt-8">
              <div className="flex space-x-4 sm:space-x-5">
                <a
                  href="https://www.facebook.com/meridianfreight"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-6 h-6 sm:w-7 sm:h-7" />
                </a>
                <a
                  href="https://www.instagram.com/meridian_logistics_usa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-pink-500 text-white rounded-lg flex items-center justify-center hover:bg-pink-600 transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=17863973888&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 text-white rounded-lg flex items-center justify-center hover:bg-green-600 transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl"
                  aria-label="Contact us on WhatsApp"
                >
                  <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                </a>
                <a
                  href="https://youtube.com/@merifreight_eng?si=qn2-2GCHMH5G7iPH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl"
                  aria-label="Watch our YouTube videos"
                >
                  <Youtube className="w-6 h-6 sm:w-7 sm:h-7" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links - Enhanced touch targets */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-6 sm:mb-8">QUICK LINKS</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-base sm:text-lg py-2 px-3 rounded-lg hover:bg-gray-800 block w-full text-left">Home</button></li>
              <li><button onClick={() => document.querySelector('#about-mf')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-base sm:text-lg py-2 px-3 rounded-lg hover:bg-gray-800 block w-full text-left">About</button></li>
              <li><button onClick={() => document.querySelector('#services-mf')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-base sm:text-lg py-2 px-3 rounded-lg hover:bg-gray-800 block w-full text-left">Services</button></li>
              <li><button onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-base sm:text-lg py-2 px-3 rounded-lg hover:bg-gray-800 block w-full text-left">Projects</button></li>
              <li><button onClick={() => document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-base sm:text-lg py-2 px-3 rounded-lg hover:bg-gray-800 block w-full text-left">Pricing</button></li>
            </ul>
          </div>

          {/* Services & Support - Enhanced touch targets */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-6 sm:mb-8">SERVICES & SUPPORT</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li><button onClick={() => document.querySelector('#services-mf')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-base sm:text-lg py-2 px-3 rounded-lg hover:bg-gray-800 block w-full text-left">Agricultural Equipment</button></li>
              <li><button onClick={() => document.querySelector('#services-mf')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-base sm:text-lg py-2 px-3 rounded-lg hover:bg-gray-800 block w-full text-left">Construction Machinery</button></li>
              <li><button onClick={() => document.querySelector('#services-mf')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-base sm:text-lg py-2 px-3 rounded-lg hover:bg-gray-800 block w-full text-left">Mining Equipment</button></li>
              <li><button onClick={() => document.querySelector('#faq')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-base sm:text-lg py-2 px-3 rounded-lg hover:bg-gray-800 block w-full text-left">FAQ</button></li>
              <li><button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-base sm:text-lg py-2 px-3 rounded-lg hover:bg-gray-800 block w-full text-left">Contact Us</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Enhanced touch targets */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-8 sm:py-10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-base sm:text-lg">
                © {currentYear} Meridian Freight Inc. | All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 