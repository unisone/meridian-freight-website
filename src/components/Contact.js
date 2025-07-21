import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle, MessageCircle, Facebook, Instagram, Youtube } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ALTERNATIVE: If hosting on Netlify, use this instead:
  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'contact',
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          message: formData.message,
        }).toString(),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', company: '', phone: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setSubmitError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  */

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create email content
      const subject = encodeURIComponent('New Contact Form Submission - Meridian Freight');
      const body = encodeURIComponent(`
Hello,

You have received a new contact form submission from your website:

Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company || 'Not provided'}
Phone: ${formData.phone || 'Not provided'}

Message:
${formData.message}

---
This email was sent from your Meridian Freight website contact form.
      `);

      // Open email client with pre-filled content
      const mailtoLink = `mailto:info@meridianfreightllc.com?subject=${subject}&body=${body}`;
      window.open(mailtoLink, '_blank');

      // Show success message
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('Failed to open email client. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-padding bg-gray-50" id="contact">
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
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Email Client Opened!</h4>
                <p className="text-gray-600 text-lg">Your email client should have opened with your message pre-filled. Please send the email to complete your inquiry.</p>
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
                  disabled={isSubmitting}
                  className={`w-full font-semibold py-4 sm:py-5 px-6 sm:px-8 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 text-lg sm:text-xl shadow-lg ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:scale-105'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {/* Error Message */}
                {submitError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-center">{submitError}</p>
                  </div>
                )}
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
                  href="https://api.whatsapp.com/send/?phone=17863973888&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
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
      </div>
    </section>
  );
};

export default Contact; 