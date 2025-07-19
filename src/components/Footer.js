import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <img
                src="/logos/MF Logos White/meridianFreight-logo-w-500.png"
                alt="Meridian Freight Inc."
                className="h-12 sm:h-16"
              />
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Specialized pickup, dismantling, and container packing for agricultural and heavy-duty machinery.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span className="text-gray-300 text-sm sm:text-base">+1 (786) 397-3888</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span className="text-gray-300 text-sm sm:text-base">info@meridianfreightllc.com</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span className="text-gray-300 text-sm sm:text-base">2107 148th, Albion, IA, USA</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="mt-4 sm:mt-6">
              <div className="flex space-x-3 sm:space-x-4">
                <a
                  href="https://www.facebook.com/meridianfreight"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a
                  href="https://www.instagram.com/meridian_logistics_usa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-500 text-white rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=17863973888&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 text-white rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a
                  href="https://youtube.com/@merifreight_eng?si=qn2-2GCHMH5G7iPH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">COMPANY</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base">Home</Link></li>
              <li><button onClick={() => document.querySelector('#about-mf')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base">About</button></li>
              <li><button onClick={() => document.querySelector('#services-mf')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base">Services</button></li>
              <li><button onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base">Projects</button></li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">SERVICES</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><button onClick={() => document.querySelector('#services-mf')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base">Equipment Pickup</button></li>
              <li><button onClick={() => document.querySelector('#services-mf')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base">Agricultural Machinery Dismantling</button></li>
              <li><button onClick={() => document.querySelector('#services-mf')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base">Container Loading and Packing</button></li>
              <li><button onClick={() => document.querySelector('#services-mf')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base">Storage Services</button></li>
              <li><button onClick={() => document.querySelector('#services-mf')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base">Export Logistics</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm sm:text-base">
                © {currentYear} Meridian Freight Inc. | All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// WhatsApp Icon Component
const MessageCircle = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.35L2 22l5.65-1.05C9.96 21.64 11.46 22 13 22h7c1.1 0 2-.9 2-2V12c0-5.52-4.48-10-10-10z"/>
  </svg>
);

export default Footer; 