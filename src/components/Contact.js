import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact Us
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            We're here to help with all your agricultural and heavy-duty machinery needs. Whether you require pickup, disassembly, container packing, or efficient delivery across the USA and Canada, our team is ready to assist. Reach out to us for a seamless logistics solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Contact Form - Enhanced mobile spacing */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              Send us a Message
            </h3>

            {isSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h4>
                <p className="text-gray-600 text-lg">Thank you for contacting us. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-3">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-3">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-3">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Company name (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-3">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Phone number (optional)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-3">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                    placeholder="Tell us about your machinery logistics needs..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-4 sm:py-5 px-6 sm:px-8 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-3 text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Send className="w-6 h-6" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Information - Enhanced spacing */}
          <div className="space-y-8 sm:space-y-10">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                Contact Information
              </h3>
              <div className="space-y-6 sm:space-y-8">
                <a 
                  href="tel:+17863973888"
                  className="flex items-center space-x-4 sm:space-x-5 group hover:text-blue-600 transition-colors duration-200 p-3 rounded-xl hover:bg-blue-50"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors duration-200">
                    <Phone className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg sm:text-xl">Phone</h4>
                    <p className="text-gray-600 text-base sm:text-lg">+1 (786) 397-3888</p>
                  </div>
                </a>

                <a 
                  href="mailto:info@meridianfreightllc.com"
                  className="flex items-center space-x-4 sm:space-x-5 group hover:text-blue-600 transition-colors duration-200 p-3 rounded-xl hover:bg-blue-50"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors duration-200">
                    <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg sm:text-xl">Email</h4>
                    <p className="text-gray-600 text-base sm:text-lg">info@meridianfreightllc.com</p>
                  </div>
                </a>

                <div className="flex items-center space-x-4 sm:space-x-5 p-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg sm:text-xl">Address</h4>
                    <p className="text-gray-600 text-base sm:text-lg">2107 148th, Albion, IA, USA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow Us Section - Enhanced spacing */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                Follow Us
              </h3>
              <div className="flex space-x-4 sm:space-x-5">
                <a
                  href="https://www.facebook.com/meridianfreight"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-7 h-7 sm:w-8 sm:h-8" />
                </a>
                <a
                  href="https://www.instagram.com/meridian_logistics_usa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-pink-500 text-white rounded-xl flex items-center justify-center hover:bg-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-7 h-7 sm:w-8 sm:h-8" />
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=17863973888&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500 text-white rounded-xl flex items-center justify-center hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                  aria-label="Contact us on WhatsApp"
                >
                  <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
                </a>
                <a
                  href="https://youtube.com/@merifreight_eng?si=qn2-2GCHMH5G7iPH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                  aria-label="Watch our YouTube videos"
                >
                  <Youtube className="w-7 h-7 sm:w-8 sm:h-8" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Contact Info Section */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Contact Us
            </h3>
            
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-12 mb-8">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">2107 148th, Albion, IA, USA</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">+1 (786) 397-3888</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">info@meridianfreightllc.com</span>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <a
                href="https://www.facebook.com/meridianfreight"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/meridian_logistics_usa/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-500 text-white rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=17863973888&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-500 text-white rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
              <a
                href="https://youtube.com/@merifreight_eng?si=qn2-2GCHMH5G7iPH"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MessageCircle = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.35L2 22l5.65-1.05C9.96 21.64 11.46 22 13 22h7c1.1 0 2-.9 2-2V12c0-5.52-4.48-10-10-10z"/>
  </svg>
);

export default Contact; 