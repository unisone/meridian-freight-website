import React, { useState } from 'react';
import { 
  FolderOpen, 
  Calendar, 
  MapPin, 
  Truck, 
  Package, 
  ExternalLink,
  Play
} from 'lucide-react';

const ProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'agricultural', name: 'Agricultural Equipment' },
    { id: 'construction', name: 'Construction Machinery' },
    { id: 'industrial', name: 'Industrial Equipment' },
    { id: 'mining', name: 'Mining Equipment' }
  ];

  const projects = [
    {
      id: 1,
      title: "John Deere Combine Fleet Export to Brazil",
      category: "agricultural",
      client: "Midwest Farming Co.",
      location: "Iowa to Santos, Brazil",
      date: "September 2024",
      duration: "14 days",
      equipment: "12 John Deere Combines",
      description: "Complete dismantling and container packing of 12 John Deere combines for export to Brazil. Project included washing, fumigation, and customs documentation.",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop"
      ],
      services: ["Pickup", "Dismantling", "Washing & Fumigation", "Container Packing", "Export Documentation"],
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      testimonial: "Meridian Freight handled our complex export project flawlessly. Their attention to detail and expertise in agricultural machinery made all the difference."
    },
    {
      id: 2,
      title: "CAT Excavator Relocation Project",
      category: "construction",
      client: "Heavy Construction LLC",
      location: "Texas to Alberta, Canada",
      date: "August 2024",
      duration: "8 days",
      equipment: "6 CAT Excavators",
      description: "Specialized transportation and container packing of heavy construction equipment for a mining operation in Canada.",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop"
      ],
      services: ["Heavy Equipment Pickup", "Specialized Dismantling", "Container Loading", "Cross-Border Transport"],
      testimonial: "Professional service from start to finish. The team's expertise in heavy machinery logistics is unmatched."
    },
    {
      id: 3,
      title: "Industrial Manufacturing Line Export",
      category: "industrial",
      client: "Global Manufacturing Inc.",
      location: "Illinois to Mexico",
      date: "July 2024",
      duration: "21 days",
      equipment: "Complete Production Line",
      description: "Complex project involving the dismantling and packing of an entire manufacturing production line for relocation to Mexico.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop"
      ],
      services: ["Project Management", "Precision Dismantling", "Component Cataloging", "Multiple Container Coordination"],
      testimonial: "The complexity of our manufacturing line relocation required true experts. Meridian Freight delivered beyond our expectations."
    },
    {
      id: 4,
      title: "Mining Equipment Fleet to Australia",
      category: "mining",
      client: "Rocky Mountain Mining",
      location: "Colorado to Perth, Australia",
      date: "June 2024",
      duration: "18 days",
      equipment: "8 Mining Trucks & Support Equipment",
      description: "Large-scale mining equipment export project including specialized hauling trucks, loaders, and support equipment.",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
      ],
      services: ["Fleet Coordination", "Mining Equipment Expertise", "International Shipping", "Customs Clearance"],
      testimonial: "Outstanding project management and execution. Our mining operation was up and running on schedule thanks to their expertise."
    }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container-custom section-padding">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-600 rounded-full px-4 py-2 mb-4">
            <FolderOpen className="w-5 h-5" />
            <span className="font-medium">Our Projects</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Completed Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our portfolio of successfully completed machinery logistics projects. 
            From agricultural equipment to heavy industrial machinery, see how we deliver results.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-primary-50 border border-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Project Image */}
              <div className="relative h-64 bg-gray-200 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {project.videoUrl && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                      <Play className="w-8 h-8 text-primary-600 ml-1" />
                    </button>
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-8">
                {/* Project Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-primary-600" />
                      <span className="text-sm text-gray-600">{project.date}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-primary-600" />
                      <span className="text-sm text-gray-600">{project.location}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Truck className="w-4 h-4 text-primary-600" />
                      <span className="text-sm text-gray-600">{project.equipment}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Package className="w-4 h-4 text-primary-600" />
                      <span className="text-sm text-gray-600">{project.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Services Provided:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((service, index) => (
                      <span 
                        key={index}
                        className="bg-primary-50 text-primary-600 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Testimonial */}
                {project.testimonial && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-gray-600 italic text-sm">
                      "{project.testimonial}"
                    </p>
                    <p className="text-primary-600 font-medium text-sm mt-2">
                      — {project.client}
                    </p>
                  </div>
                )}

                {/* Gallery Preview */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Project Gallery:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {project.gallery.map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${project.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-primary-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>View Full Case Study</span>
                  </button>
                  <button className="flex-1 border-2 border-primary-600 text-primary-600 font-medium py-3 px-4 rounded-lg hover:bg-primary-50 transition-colors">
                    Similar Project Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 md:p-12 text-white text-center mt-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Project?
          </h3>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join our growing list of satisfied clients. Let us handle your next machinery logistics project with the same expertise and care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-lg hover:bg-gray-50 transition-colors">
              Get Project Quote
            </button>
            <button className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage; 