import React from 'react';
import { ExternalLink } from 'lucide-react';

const VideoSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header - Enhanced mobile spacing and typography */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <p className="text-blue-600 font-semibold text-base sm:text-lg lg:text-xl mb-4 sm:mb-6">See Meridian Freight Inc. in Action</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
            Delivering Precision and Reliability in Export Logistics
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
            From transportation to container loading and equipment dismantling, discover our dedication to delivering top-notch service and ensuring seamless operations for our clients.
          </p>
        </div>

        {/* Video Player - Enhanced mobile spacing */}
        <div className="max-w-5xl mx-auto mb-12 sm:mb-16 px-4">
          <div className="relative aspect-video bg-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <iframe
              src="https://www.youtube.com/embed/?listType=user_uploads&list=merifreight_eng"
              title="Meridian Freight Inc. - Export Logistics Services"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          {/* Video Description - Mobile friendly */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-gray-600 text-base sm:text-lg">
              Watch our team in action as we handle complex machinery logistics projects
            </p>
          </div>
        </div>

        {/* Watch More Videos Button - Enhanced for mobile */}
        <div className="text-center">
          <a
            href="https://youtube.com/@merifreight_eng?si=qn2-2GCHMH5G7iPH"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white font-semibold py-4 sm:py-5 px-8 sm:px-10 rounded-xl hover:bg-blue-700 transition-all duration-200 text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <span>Watch More Videos</span>
              <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </a>
          
          {/* Additional engagement section */}
          <div className="mt-12 sm:mt-16">
            <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 max-w-3xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                Ready to See Your Project?
              </h3>
              <p className="text-gray-600 mb-6 sm:mb-8 text-lg sm:text-xl leading-relaxed">
                Every machinery packing and shipping project is unique. Let us create a custom solution for your equipment export needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:info@meridianfreightllc.com"
                  className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-blue-700 transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Your Quote
                </a>
                <a 
                  href="tel:+17863973888"
                  className="border-2 border-blue-600 text-blue-600 font-semibold py-4 px-8 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-200 text-lg"
                >
                  Call Us Today
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection; 