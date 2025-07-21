import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '#about-mf' },
    { name: 'Services', path: '#services-mf' },
    { name: 'Projects', path: '#projects' },
  ];

  const handleNavClick = (path) => {
    if (path.startsWith('#')) {
      // Handle anchor links
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Top bar - Enhanced touch targets */}
      <div className="bg-blue-900 text-white py-2 sm:py-3">
        <div className="container-custom">
          <div className="flex items-center justify-end text-sm sm:text-base">
            <a 
              href="https://api.whatsapp.com/send/?phone=17863973888&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 sm:space-x-3 hover:text-blue-200 transition-colors py-2 px-3 rounded-lg hover:bg-blue-800"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Give Us a Call +1-786-397-3888</span>
              <span className="sm:hidden">+1-786-397-3888</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg'
          : 'bg-transparent'
      }`}>
        <div className="container-custom">
          <div className="flex items-center justify-between py-4 sm:py-5">
            {/* Logo - Enhanced touch target */}
            <Link to="/" className="flex items-center space-x-2 py-2 px-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors">
              <img
                src="/logos/MF Logos White/meridianFreight-logo-W-250.png"
                alt="Meridian Freight Inc."
                className={`h-10 sm:h-12 lg:h-14 transition-all duration-300 ${
                  isScrolled ? 'filter brightness-0' : ''
                }`}
              />
            </Link>

            {/* Desktop Navigation - Enhanced spacing and fixed breakpoint */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              {navItems.map((item) => (
                item.path.startsWith('#') ? (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.path)}
                    className={`font-medium transition-all duration-200 py-2 px-3 xl:py-3 xl:px-4 rounded-lg text-sm xl:text-base ${
                      isScrolled
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        : 'text-white hover:text-blue-200 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`font-medium transition-all duration-200 py-2 px-3 xl:py-3 xl:px-4 rounded-lg text-sm xl:text-base ${
                      location.pathname === item.path
                        ? 'text-blue-600 bg-blue-50'
                        : isScrolled
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        : 'text-white hover:text-blue-200 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <button
                onClick={() => handleNavClick('#contact')}
                className="bg-blue-600 text-white font-medium py-2 px-4 xl:py-3 xl:px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm xl:text-base shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Quote
              </button>
            </div>

            {/* Mobile menu button - Enhanced touch target */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-3 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? (
                <X className={`w-7 h-7 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              ) : (
                <Menu className={`w-7 h-7 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced touch targets */}
        {isOpen && (
          <div className="lg:hidden bg-white shadow-lg border-t border-gray-200">
            <div className="container-custom py-4">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  item.path.startsWith('#') ? (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.path)}
                      className="font-medium py-4 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 text-left text-lg rounded-lg transition-all duration-200"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`font-medium py-4 px-4 text-lg rounded-lg transition-all duration-200 ${
                        location.pathname === item.path
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
                <button
                  onClick={() => handleNavClick('#contact')}
                  className="bg-blue-600 text-white font-medium py-4 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 text-lg text-center mt-4"
                >
                  Get Quote
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar; 