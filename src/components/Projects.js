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
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
            Professional Machinery Packing Projects
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Explore our completed machinery packing and container loading projects for agricultural, construction, and mining equipment worldwide.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Main Carousel */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {projects.map((project, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  {/* Mobile Layout (< lg) */}
                  <div className="lg:hidden">
                    {/* Image Section - Mobile */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      
                      {/* Project Badge on Image */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                          Project {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Content Section - Mobile */}
                    <div className="p-6 sm:p-8 bg-white">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                        {project.title}
                      </h3>
                      
                      <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
                        {project.description}
                      </p>
                      
                      {/* Project Stats - Mobile */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="font-semibold text-gray-900 text-sm mb-1">Status</div>
                          <div className="text-blue-600 font-medium">Completed</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="font-semibold text-gray-900 text-sm mb-1">Type</div>
                          <div className="text-blue-600 font-medium">Export Logistics</div>
                        </div>
                      </div>

                      {/* Call to Action - Mobile */}
                      <button 
                        onClick={() => {
                          const element = document.querySelector('#contact');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Get Quote
                      </button>
                    </div>
                  </div>

                  {/* Desktop Layout (>= lg) */}
                  <div className="hidden lg:grid lg:grid-cols-2 lg:min-h-[600px]">
                    {/* Image Section - Desktop */}
                    <div className="relative overflow-hidden bg-gray-100 aspect-[16/10]">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    </div>

                    {/* Content Section - Desktop */}
                    <div className="p-8 xl:p-12 flex flex-col justify-center bg-white">
                      <div className="mb-6">
                        <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                          Project {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      
                      <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        {project.title}
                      </h3>
                      
                      <p className="text-lg text-gray-600 leading-relaxed mb-8">
                        {project.description}
                      </p>
                      
                      {/* Project Stats - Desktop */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="font-semibold text-gray-900 text-sm mb-1">Status</div>
                          <div className="text-blue-600 font-medium">Completed</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="font-semibold text-gray-900 text-sm mb-1">Type</div>
                          <div className="text-blue-600 font-medium">Export Logistics</div>
                        </div>
                      </div>

                      {/* Call to Action - Desktop */}
                      <button 
                        onClick={() => {
                          const element = document.querySelector('#contact');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors w-fit"
                      >
                        Get Quote
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Enhanced touch targets for mobile */}
          <button
            onClick={prevSlide}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-white/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white transition-all z-10 border border-gray-200 transform hover:scale-110 active:scale-95"
            aria-label="Previous project"
          >
            <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-gray-700" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-white/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white transition-all z-10 border border-gray-200 transform hover:scale-110 active:scale-95"
            aria-label="Next project"
          >
            <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-gray-700" />
          </button>

          {/* Dots Indicator - Enhanced touch targets */}
          <div className="flex justify-center mt-8 sm:mt-10 space-x-3 sm:space-x-4">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full transition-all duration-300 border-2 ${
                  currentSlide === index
                    ? 'bg-blue-600 border-blue-600 w-10 sm:w-12'
                    : 'bg-gray-300 border-gray-300 hover:bg-gray-400 hover:border-gray-400'
                } hover:scale-125 active:scale-110`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>

          {/* Project Counter - Enhanced typography */}
          <div className="text-center mt-6 sm:mt-8">
            <span className="text-gray-500 text-sm sm:text-base font-medium">
              {currentSlide + 1} of {projects.length}
            </span>
          </div>
        </div>

        {/* Navigation Hint - Enhanced for mobile */}
        <div className="text-center mt-8 sm:mt-10">
          <div className="inline-flex items-center space-x-4 bg-gray-50 rounded-full px-6 sm:px-8 py-3 sm:py-4">
            <span className="text-sm sm:text-base text-gray-600">Navigate:</span>
            <div className="flex space-x-3">
              <kbd className="px-3 sm:px-4 py-2 bg-white rounded-lg text-sm text-gray-500 shadow-sm border">←</kbd>
              <kbd className="px-3 sm:px-4 py-2 bg-white rounded-lg text-sm text-gray-500 shadow-sm border">→</kbd>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects; 