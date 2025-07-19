import React from 'react';
import { Play, ExternalLink } from 'lucide-react';

const VideoSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-lg mb-4">See Meridian Freight Inc. in Action</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Delivering Precision and Reliability in Export Logistics
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            From transportation to container loading and equipment dismantling, discover our dedication to delivering top-notch service and ensuring seamless operations for our clients.
          </p>
        </div>

        {/* Video Player */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.youtube.com/embed/?listType=user_uploads&list=merifreight_eng"
              title="Meridian Freight Inc. - Export Logistics Services"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Watch More Videos Button */}
        <div className="text-center">
          <a
            href="https://youtube.com/@merifreight_eng?si=qn2-2GCHMH5G7iPH"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto w-fit"
          >
            <span>Watch more Videos</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default VideoSection; 