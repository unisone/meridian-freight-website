import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Projects = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const projects = [
    {
      title: "John Deere S670 Combine",
      description: "Loaded combine John Deere S670 in 40HC container. Quantity: 1 unit. Weight: 15t. Final Destination: Ukraine. Transit time: 45 days. Labor time spent: 35hrs.",
      image: "/images/john-deere-s670.jpg"
    },
    {
      title: "Planter Kinze 3700",
      description: "Loaded planter Kinze 3700 and spare parts (15 pallets) in 40HC container. Quantity 16. Weight 19900. Final destination: Russian Federation. Transit Time 90 days. Labor time spent: 70 hrs",
      image: "/images/kinze-3700.jpg"
    },
    {
      title: "Self-Propelled sprayer John Deere",
      description: "Self-Propelled sprayer John Deere loaded on 40 Flat Rack. Quantity: 1 unit. Weight 12500Kgs, Final Destination: Romania. Transit time: 45 days. Labor time spent 16hrs",
      image: "/images/self-propelled-sprayer-john-deere.jpg"
    },
    {
      title: "John Deere and Wil-Rich in 40HC",
      description: "Loaded cultivators John Deere and Wil-Rich in 40HC container. Quantity 4 units. Weight 19t. Final Destination: Ukraine. Transit time: 65 days. Labor time spent: 72hrs.",
      image: "/images/john-deere-wil-rich.jpg"
    },
    {
      title: "Stripper headers Shelbourne",
      description: "Stripper headers Shelbourne loaded in 40HC container. Quantity: 2 units. Weight: 8t. Destination: Kazakhstan. Transit time: 90 days. Labor time: 16hrs.",
      image: "/images/stripper-headers-shelbourne.jpg"
    },
    {
      title: "Excavator Cat",
      description: "Loaded excavator Cat loaded onto 40 ft Flat Rack. Quantity 1 unit. Weight: 23t Final Destination: Senegal. Transit time: 45 days. Labor time spent 4 hrs.",
      image: "/images/excavator-cat.jpg"
    },
    {
      title: "Grain headers Case",
      description: "Grain headers Case IH loaded in 40HC open hard top container. Quantity: 4. Weight: 13t. Final Destination: Ukraine. Transit time: 45 days. Labor time spent: 35 hrs.",
      image: "/images/grain-headers-case.jpg"
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        prevSlide();
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Auto-play (optional - can be enabled/disabled)
  useEffect(() => {
    const autoPlay = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(autoPlay);
  }, [currentSlide, nextSlide]);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-blue-600 font-semibold text-base sm:text-lg mb-4">Portfolio</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Professional Machinery Packing Projects
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Explore our completed machinery packing and container loading projects for agricultural, construction, and mining equipment worldwide.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Main Carousel */}
          <div className="relative overflow-hidden rounded-lg sm:rounded-2xl bg-white shadow-xl sm:shadow-2xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {projects.map((project, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 h-[400px] sm:h-[500px] lg:h-[600px]">
                    {/* Image Section */}
                    <div className="relative overflow-hidden bg-gray-100">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 sm:p-6 lg:p-8 xl:p-12 flex flex-col justify-center bg-white">
                      <div className="mb-4 sm:mb-6">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full uppercase tracking-wider">
                          Project {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                        {project.title}
                      </h3>
                      
                      <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8">
                        {project.description}
                      </p>
                      
                      {/* Project Stats */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                          <div className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">Status</div>
                          <div className="text-blue-600 font-medium text-sm sm:text-base">Completed</div>
                        </div>
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                          <div className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">Type</div>
                          <div className="text-blue-600 font-medium text-sm sm:text-base">Export Logistics</div>
                        </div>
                      </div>

                      {/* Call to Action */}
                      <button className="bg-blue-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors w-fit text-sm sm:text-base">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Responsive positioning */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white transition-all z-10 border border-gray-200"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-gray-700" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white transition-all z-10 border border-gray-200"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-gray-700" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 sm:mt-8 space-x-2 sm:space-x-3">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-blue-600 w-8 sm:w-10'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Project Counter */}
          <div className="text-center mt-4 sm:mt-6">
            <span className="text-gray-500 text-xs sm:text-sm font-medium">
              {currentSlide + 1} of {projects.length}
            </span>
          </div>
        </div>

        {/* Navigation Hint - Hidden on mobile */}
        <div className="text-center mt-6 sm:mt-8 hidden sm:block">
          <div className="inline-flex items-center space-x-4 bg-gray-50 rounded-full px-4 sm:px-6 py-2 sm:py-3">
            <span className="text-xs sm:text-sm text-gray-600">Navigate:</span>
            <div className="flex space-x-2">
              <kbd className="px-2 sm:px-3 py-1 bg-white rounded text-xs text-gray-500 shadow-sm border">←</kbd>
              <kbd className="px-2 sm:px-3 py-1 bg-white rounded text-xs text-gray-500 shadow-sm border">→</kbd>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects; 