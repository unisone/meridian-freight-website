import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown, FileText, Truck, Package, Clock, MessageCircle } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [isOverLightSection, setIsOverLightSection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update scrolled state
      setIsScrolled(currentScrollY > 50);
      
      // Hide/show navbar based on scroll direction (modern UX pattern)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide navbar
        setIsVisible(false);
        setActiveDropdown(null); // Close dropdowns when hiding
      } else {
        // Scrolling up or near top - show navbar
        setIsVisible(true);
      }
      
      // Update active section based on scroll position for one-page site
      const sections = ['services-mf', 'about-mf', 'projects'];
      let currentSection = 'home'; // Default to home
      let isLightSection = false; // Track if we're over a light section
      
      // Check if we're at the top (home section - dark background)
      if (currentScrollY < 100) {
        currentSection = 'home';
        isLightSection = false; // Hero section has dark background
      } else {
        // Check other sections
        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
              currentSection = sectionId === 'services-mf' ? 'services' : 
                             sectionId === 'about-mf' ? 'about' : 
                             sectionId;
              
              // Determine if this section has a light background
              // Services and About sections typically have light backgrounds
              isLightSection = ['services', 'about'].includes(currentSection);
              break;
            }
          }
        }
      }
      
      setActiveSection(currentSection);
      setIsOverLightSection(isLightSection);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when menu is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Enhanced navigation structure for B2B logistics
  const navItems = [
    { name: 'Home', path: '#home', type: 'link', section: 'home' },
    { 
      name: 'Services', 
      path: '#services-mf', 
      type: 'dropdown',
      section: 'services',
      items: [
        { name: 'Machinery Dismantling & Packing', path: '#services-mf', icon: Package },
        { name: 'Container Loading & Export', path: '#services-mf', icon: Truck },
        { name: 'Agricultural Equipment Services', path: '#services-mf', icon: Package },
        { name: 'Equipment Sales & Procurement', path: '#services-mf', icon: FileText },
        { name: 'Export Documentation', path: '#services-mf', icon: FileText },
        { name: 'Warehouse & Storage', path: '#services-mf', icon: Package }
      ]
    },
    { 
      name: 'Industries', 
      path: '#about-mf', 
      type: 'dropdown',
      section: 'industries',
      items: [
        { name: 'Agricultural Equipment', path: '#services-mf' },
        { name: 'Construction Machinery', path: '#services-mf' },
        { name: 'Mining Equipment', path: '#services-mf' },
        { name: 'Road Building Equipment', path: '#services-mf' }
      ]
    },
    { name: 'Projects', path: '#projects', type: 'link', section: 'projects' },
    { name: 'About', path: '#about-mf', type: 'link', section: 'about' }
  ];

  const handleNavClick = (path, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (path.startsWith('#')) {
      // Handle anchor links for one-page site
      const targetId = path.substring(1);
      
      // Special case for home - scroll to top
      if (targetId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const handleDropdownToggle = (itemName, event) => {
    if (event) {
      event.stopPropagation();
    }
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  return (
    <>
      {/* Top utility bar - Updated for 24/7 operations */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-2.5 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            {/* Left side - Business hours */}
            <div className="hidden md:flex items-center space-x-4 text-blue-100">
              <span className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Available 24/7</span>
              </span>
            </div>

            {/* Right side - Contact info */}
            <div className="flex items-center space-x-4 ml-auto">
              <a 
                href="mailto:info@meridianfreightllc.com"
                className="hidden sm:flex items-center space-x-2 hover:text-blue-200 transition-colors"
              >
                <span>info@meridianfreightllc.com</span>
              </a>
              <a 
                href="https://api.whatsapp.com/send/?phone=17863973888&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 hover:text-blue-100 transition-all duration-300 py-2 px-3 rounded-lg hover:bg-white/10 backdrop-blur-sm"
              >
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline font-medium">+1-786-397-3888</span>
                <span className="sm:hidden font-medium">Call Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar with enhanced B2B features and improved visibility */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? isOverLightSection
              ? 'bg-white/98 backdrop-blur-md shadow-lg border-b border-gray-100'
              : 'bg-black/80 backdrop-blur-md shadow-lg'
            : 'bg-black/60 backdrop-blur-md shadow-lg'
        } ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        aria-label="Main navigation"
        role="navigation"
      >
        {/* Skip link for keyboard users */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
          onFocus={() => setIsVisible(true)}
        >
          Skip to main content
        </a>
        
        <div className="container-custom">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Logo with enhanced branding and improved visibility */}
            <button 
              onClick={(e) => handleNavClick('#home', e)}
              className="group flex items-center space-x-3 py-2 px-2 rounded-xl hover:bg-white/10 transition-all duration-300 focus:outline-none"
              aria-label="Meridian Freight Inc. - Go to homepage"
            >
              <img
                src="/logos/MF Logos White/meridianFreight-logo-W-250.png"
                alt=""
                role="presentation"
                className={`h-12 sm:h-14 lg:h-16 transition-all duration-500 group-hover:scale-105 ${
                  isScrolled && isOverLightSection ? 'filter brightness-0' : 'drop-shadow-2xl filter brightness-110'
                }`}
              />
              {/* Optional tagline for larger screens with improved visibility */}
              <div className={`hidden xl:block transition-all duration-300 ${
                isScrolled && isOverLightSection ? 'text-gray-600' : 'text-white drop-shadow-lg font-medium'
              }`}>
                <div className="text-xs font-semibold opacity-95">Professional Machinery Export</div>
              </div>
            </button>

            {/* Desktop Navigation with enhanced dropdown menus and improved visibility */}
            <div className="hidden lg:flex items-center space-x-1" role="menubar">
              {navItems.map((item, itemIndex) => (
                <div key={item.name} className="relative" role="none">
                  {item.type === 'dropdown' ? (
                    <div className="relative">
                      <button
                        onClick={(e) => item.path.startsWith('#') ? handleNavClick(item.path, e) : handleDropdownToggle(item.name, e)}
                        onMouseEnter={() => setActiveDropdown(item.name)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveDropdown(activeDropdown === item.name ? null : item.name);
                          } else if (e.key === 'Escape') {
                            setActiveDropdown(null);
                          } else if (e.key === 'ArrowDown' && activeDropdown === item.name) {
                            e.preventDefault();
                            // Focus first dropdown item
                            const dropdown = document.querySelector(`[data-dropdown="${item.name}"] button`);
                            dropdown?.focus();
                          }
                        }}
                        className={`group relative font-medium transition-all duration-300 py-3 px-4 xl:py-3.5 xl:px-5 text-sm xl:text-base hover:scale-105 flex items-center space-x-1 focus:outline-none ${
                          activeSection === item.section
                            ? isScrolled && isOverLightSection ? 'text-gray-900' : 'text-white'
                            : isScrolled && isOverLightSection ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                        }`}
                        aria-expanded={activeDropdown === item.name}
                        aria-haspopup="true"
                        aria-label={`${item.name} menu`}
                        role="menuitem"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`} aria-hidden="true" />
                        {/* Modern underline effect - more prominent */}
                        <span className={`absolute bottom-1 left-1/2 h-0.5 transition-all duration-300 ${
                          activeSection === item.section 
                            ? 'w-8 -translate-x-1/2 bg-blue-400' 
                            : 'w-0 group-hover:w-8 group-hover:-translate-x-1/2 group-focus:w-8 group-focus:-translate-x-1/2 bg-blue-400'
                        }`} aria-hidden="true"></span>
                      </button>

                      {/* Enhanced Dropdown Menu */}
                      {activeDropdown === item.name && (
                        <div 
                          className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-4 z-50"
                          onMouseLeave={() => setActiveDropdown(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setActiveDropdown(null);
                              // Return focus to the button that opened the dropdown
                              document.querySelector(`[aria-label="${item.name} menu"]`)?.focus();
                            }
                          }}
                          data-dropdown={item.name}
                          role="menu"
                          aria-label={`${item.name} submenu`}
                        >
                          <div className="px-4 pb-3 border-b border-gray-100">
                            <h4 className="font-semibold text-gray-900 text-sm" role="presentation">{item.name}</h4>
                            <p className="text-xs text-gray-500 mt-1" role="presentation">
                              {item.name === 'Services' ? 'Complete machinery export solutions' : 'Industries we serve worldwide'}
                            </p>
                          </div>
                          <div className="py-2" role="none">
                            {item.items.map((subItem, index) => {
                              const IconComponent = subItem.icon;
                              return (
                                <button
                                  key={index}
                                  onClick={(e) => handleNavClick(subItem.path, e)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'ArrowDown') {
                                      e.preventDefault();
                                      const nextButton = document.querySelector(`[data-dropdown="${item.name}"] button:nth-of-type(${index + 2})`);
                                      nextButton?.focus();
                                    } else if (e.key === 'ArrowUp') {
                                      e.preventDefault();
                                      if (index === 0) {
                                        document.querySelector(`[aria-label="${item.name} menu"]`)?.focus();
                                      } else {
                                        const prevButton = document.querySelector(`[data-dropdown="${item.name}"] button:nth-of-type(${index})`);
                                        prevButton?.focus();
                                      }
                                    }
                                  }}
                                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 group focus:outline-none"
                                  role="menuitem"
                                >
                                  {IconComponent && (
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors" aria-hidden="true">
                                      <IconComponent className="w-4 h-4 text-blue-600" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-medium text-gray-900 text-sm">{subItem.name}</div>
                                    {subItem.description && (
                                      <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          {/* CTA in dropdown */}
                          <div className="px-4 pt-3 border-t border-gray-100">
                            <button
                              onClick={(e) => handleNavClick('#contact', e)}
                              className="w-full bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none"
                              role="menuitem"
                            >
                              Get Free Quote
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={(e) => handleNavClick(item.path, e)}
                      className={`group relative font-medium transition-all duration-300 py-3 px-4 xl:py-3.5 xl:px-5 text-sm xl:text-base hover:scale-105 focus:outline-none ${
                        activeSection === item.section
                          ? isScrolled && isOverLightSection ? 'text-gray-900' : 'text-white'
                          : isScrolled && isOverLightSection ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                      }`}
                      role="menuitem"
                      aria-label={`Go to ${item.name} section`}
                    >
                      <span>{item.name}</span>
                      {/* Modern underline effect - more prominent */}
                      <span className={`absolute bottom-1 left-1/2 h-0.5 transition-all duration-300 ${
                        activeSection === item.section ? 'w-8 -translate-x-1/2 bg-blue-400' : 'w-0 group-hover:w-8 group-hover:-translate-x-1/2 group-focus:w-8 group-focus:-translate-x-1/2 bg-blue-400'
                      }`} aria-hidden="true"></span>
                    </button>
                  )}
                </div>
              ))}
              
              {/* Primary CTA Button - Enhanced for B2B with improved visibility */}
              <button
                onClick={(e) => handleNavClick('#contact', e)}
                className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 xl:py-3.5 xl:px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm xl:text-base shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden ml-2 drop-shadow-md focus:outline-none"
                aria-label="Get a quote for machinery export services"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <FileText className="w-4 h-4" aria-hidden="true" />
                  <span>Get Quote</span>
                </span>
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" aria-hidden="true"></div>
              </button>
            </div>

            {/* Mobile menu button with improved visibility */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-3 rounded-xl transition-all duration-300 hover:scale-110 focus:outline-none ${
                isScrolled 
                  ? 'hover:bg-black/5' 
                  : 'hover:bg-white/15 backdrop-blur-sm'
              }`}
              aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              {isOpen ? (
                <X className={`w-7 h-7 transition-transform duration-300 ${
                  isScrolled && isOverLightSection ? 'text-gray-700' : 'text-white drop-shadow-md'
                }`} aria-hidden="true" />
              ) : (
                <Menu className={`w-7 h-7 transition-transform duration-300 ${
                  isScrolled && isOverLightSection ? 'text-gray-700' : 'text-white drop-shadow-md'
                }`} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isOpen && (
          <div className={`lg:hidden ${isScrolled && isOverLightSection ? 'bg-white/98' : 'bg-black/90'} backdrop-blur-md shadow-xl border-t border-gray-100 animate-in slide-in-from-top duration-300`}>
            <div className="container-custom py-6">
              <div className="flex flex-col space-y-1">
                {navItems.map((item, index) => (
                  <div key={item.name}>
                    {item.type === 'dropdown' ? (
                      <div>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                          className={`w-full flex items-center justify-between py-4 px-4 text-lg rounded-xl transition-all duration-300 text-left font-medium ${
                            isScrolled && isOverLightSection ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <span>{item.name}</span>
                          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                            activeDropdown === item.name ? 'rotate-180' : ''
                          } ${isScrolled && isOverLightSection ? 'text-gray-700' : 'text-white'}`} />
                        </button>
                        {/* Mobile Dropdown Items */}
                        {activeDropdown === item.name && (
                          <div className="pl-4 pb-2">
                            {item.items.map((subItem, subIndex) => (
                              <button
                                key={subIndex}
                                onClick={(e) => handleNavClick(subItem.path, e)}
                                className={`w-full flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-300 text-left ${
                                  isScrolled && isOverLightSection ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-blue-300'
                                }`}
                              >
                                {subItem.icon && <subItem.icon className={`w-4 h-4 ${isScrolled && isOverLightSection ? 'text-gray-600' : 'text-white'}`} />}
                                <span>{subItem.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleNavClick(item.path, e)}
                        className={`w-full font-medium py-4 px-4 text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-sm text-left ${
                          activeSection === item.section
                            ? 'text-blue-500'
                            : isScrolled && isOverLightSection ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {item.name}
                      </button>
                    )}
                  </div>
                ))}
                
                {/* Mobile CTA Button */}
                <button
                  onClick={(e) => handleNavClick('#contact', e)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-lg text-center mt-4 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                  style={{ animationDelay: `${navItems.length * 50}ms` }}
                >
                  <FileText className="w-5 h-5" />
                  <span>Get Free Quote</span>
                </button>

                {/* Mobile Contact Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 gap-4">
                    <a
                      href="tel:+17863973888"
                      className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                    >
                      <Phone className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">Call Now</div>
                        <div className="text-sm text-gray-600">+1-786-397-3888</div>
                      </div>
                    </a>
                    <a
                      href="https://api.whatsapp.com/send/?phone=17863973888&text&type=phone_number&app_absent=0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">WhatsApp</div>
                        <div className="text-sm text-gray-600">Quick Response</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar; 