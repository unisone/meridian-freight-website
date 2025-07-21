import React, { useState } from 'react';
import { ExternalLink, Play, AlertCircle } from 'lucide-react';

/**
 * VideoSection Component - YouTube Video Embedding with Best Practices
 * 
 * ISSUE FIXED: The original implementation used an invalid YouTube embed URL format
 * that tried to embed a user's entire upload list, which is deprecated and causes
 * "video unavailable" errors.
 * 
 * SOLUTION IMPLEMENTED:
 * 1. Fallback approach with attractive preview when no specific video ID is available
 * 2. Proper YouTube embedding when video ID is provided
 * 3. Error handling for failed video loads
 * 4. Privacy-enhanced mode using youtube-nocookie.com
 * 5. Responsive design that works on all devices
 * 
 * HOW TO USE:
 * - To show a specific video: Set videoId to your YouTube video ID (e.g., "dQw4w9WgXcQ")
 * - To show fallback preview: Keep videoId as null (current setting)
 * 
 * YOUTUBE BEST PRACTICES IMPLEMENTED:
 * - Uses youtube-nocookie.com for privacy
 * - Includes rel=0 to limit related videos to same channel
 * - Includes modestbranding=1 to reduce YouTube branding
 * - Includes proper error handling and fallbacks
 * - Responsive design with proper aspect ratio
 * - Accessibility features (proper titles, alt text)
 */

const VideoSection = () => {
  const [videoError, setVideoError] = useState(false);

  // CONFIGURATION: Replace with your actual video ID when available
  // Example: const videoId = "dQw4w9WgXcQ"; // Replace with your YouTube video ID
  const videoId = "SrjUBSD2_5Q"; // Meridian Freight video - https://www.youtube.com/watch?v=SrjUBSD2_5Q
  
  const channelUrl = "https://youtube.com/@merifreight_eng?si=qn2-2GCHMH5G7iPH";
  
  // YouTube embed URL with best practices
  const getEmbedUrl = (videoId) => {
    if (!videoId) return null;
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3`;
  };

  const embedUrl = getEmbedUrl(videoId);

  // Render actual YouTube video if video ID is available
  const renderYouTubeEmbed = () => (
    <div className="relative w-full h-full">
      <iframe
        src={embedUrl}
        title="Meridian Freight Inc. - Export Logistics Services"
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onError={() => setVideoError(true)}
      />
      {videoError && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <p className="text-lg mb-4">Video temporarily unavailable</p>
            <button
              onClick={() => window.open(channelUrl, '_blank')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Watch on YouTube
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Render fallback video preview
  const renderVideoPreview = () => (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-repeat opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Play Button and Content */}
      <div className="relative z-10 text-center text-white">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors cursor-pointer group"
               onClick={() => window.open(channelUrl, '_blank')}>
            <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold mb-3">Meridian Freight in Action</h3>
        <p className="text-gray-300 text-lg mb-6 max-w-md mx-auto">
          Watch our professional machinery packing and logistics operations
        </p>
        
        <button
          onClick={() => window.open(channelUrl, '_blank')}
          className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Play className="w-5 h-5" />
          <span>Watch Videos</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Corner Logo */}
      <div className="absolute top-4 left-4 opacity-60">
        <img
          src="/logos/MF Logos White/meridianFreight-logo-mobile-w-150.png"
          alt="MF"
          className="h-8 w-auto"
        />
      </div>
    </div>
  );

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header - Enhanced mobile spacing and typography */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <p className="text-blue-600 font-semibold text-base sm:text-lg lg:text-xl mb-4 sm:mb-6">See Meridian Freight Inc. in Action</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
            Delivering Precision and Reliability in Export Logistics
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
            From transportation to container loading and equipment dismantling, discover our dedication to delivering top-notch service and ensuring seamless operations for our clients.
          </p>
        </div>

        {/* Video Player - Enhanced mobile spacing with fallback */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-16 px-4">
          <div className="relative aspect-video bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
            {embedUrl ? renderYouTubeEmbed() : renderVideoPreview()}
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
            href={channelUrl}
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
                <button 
                  onClick={() => {
                    const element = document.querySelector('#contact');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-blue-700 transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Your Quote
                </button>
                <a 
                  href="https://api.whatsapp.com/send/?phone=17863973888&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-blue-600 text-blue-600 font-semibold py-4 px-8 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-200 text-lg"
                >
                  WhatsApp Us
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