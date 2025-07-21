import React from 'react';

const Stats = () => {
  const stats = [
    { number: "500+", label: "Successfully Project Finished" },
    { number: "10+", label: "Years of experience with proud" },
    { number: "99%", label: "Client Satisfaction Rate" },
    { number: "100+", label: "Experienced Staff Members" }
  ];

  return (
    <section className="section-padding bg-blue-600 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content - Enhanced mobile spacing */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              10+ Years Of Undefeated Success
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-white mb-8 sm:mb-10 leading-relaxed opacity-90">
              At Meridian Freight Inc., we pride ourselves on our decade-long track record of delivering excellence in machinery export and logistics. Our commitment to providing efficient and reliable solutions has earned us the trust of clients worldwide.
            </p>
            <button 
              onClick={() => {
                const element = document.querySelector('#contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-block bg-orange-500 text-white font-semibold py-4 sm:py-5 px-8 sm:px-10 rounded-xl hover:bg-orange-600 transition-all duration-200 text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Work With Us
            </button>
          </div>

          {/* Right Stats Grid - Mobile-optimized layout */}
          <div className="mt-12 lg:mt-0">
            {/* Mobile: Single Column (< sm) */}
            <div className="sm:hidden space-y-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white text-center py-8 px-6 rounded-xl shadow-lg">
                  <div className="text-4xl font-bold text-blue-600 mb-3">
                    {stat.number}
                  </div>
                  <div className="text-gray-700 font-medium text-base leading-snug">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet & Desktop: Grid Layout (>= sm) */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white text-center py-8 sm:py-10 px-6 sm:px-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-blue-600 mb-3 sm:mb-4">
                    {stat.number}
                  </div>
                  <div className="text-gray-700 font-medium text-sm sm:text-base lg:text-lg leading-snug">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats; 