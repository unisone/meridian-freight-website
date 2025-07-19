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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              10+ Years Of Undefeated Success
            </h2>
            <p className="text-xl text-white mb-8">
              At Meridian Freight Inc., we pride ourselves on our decade-long track record of delivering excellence in machinery export and logistics. Our commitment to providing efficient and reliable solutions has earned us the trust of clients worldwide.
            </p>
            <a 
              href="mailto:info@meridianfreightllc.com" 
              className="bg-orange-500 text-white font-semibold py-4 px-8 rounded-lg hover:bg-orange-600 transition-colors inline-block"
            >
              Work With Us
            </a>
          </div>

          {/* Right Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white text-center p-6 rounded-lg border border-gray-200">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-700 font-medium text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats; 