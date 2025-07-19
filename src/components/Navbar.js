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
      {/* Top bar */}
      <div className="bg-blue-900 text-white py-1 sm:py-2">
        <div className="container-custom">
          <div className="flex items-center justify-end text-xs sm:text-sm">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Give Us a Call +1-786-397-3888</span>
              <span className="sm:hidden">+1-786-397-3888</span>
            </div>
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
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logos/MF Logos White/meridianFreight-logo-W-250.png"
                alt="Meridian Freight Inc."
                className={`h-8 sm:h-10 lg:h-12 transition-all duration-300 ${
                  isScrolled ? 'filter brightness-0' : ''
                }`}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navItems.map((item) => (
                item.path.startsWith('#') ? (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.path)}
                    className={`font-medium transition-colors duration-200 text-sm lg:text-base ${
                      isScrolled
                        ? 'text-gray-700 hover:text-blue-600'
                        : 'text-white hover:text-blue-200'
                    }`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`font-medium transition-colors duration-200 text-sm lg:text-base ${
                      location.pathname === item.path
                        ? 'text-blue-600'
                        : isScrolled
                        ? 'text-gray-700 hover:text-blue-600'
                        : 'text-white hover:text-blue-200'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <Link
                to="/contact"
                className="bg-blue-600 text-white font-medium py-2 px-4 lg:px-6 rounded hover:bg-blue-700 transition-colors text-sm lg:text-base"
              >
                Get Quote
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
            >
              {isOpen ? (
                <X className={`w-5 h-5 sm:w-6 sm:h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              ) : (
                <Menu className={`w-5 h-5 sm:w-6 sm:h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
            <div className="container-custom py-4">
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  item.path.startsWith('#') ? (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.path)}
                      className="font-medium py-2 text-gray-700 hover:text-blue-600 text-left text-base"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`font-medium py-2 text-base ${
                        location.pathname === item.path
                          ? 'text-blue-600'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
                <Link
                  to="/contact"
                  className="bg-blue-600 text-white font-medium py-3 px-6 rounded hover:bg-blue-700 transition-colors w-full text-center text-base"
                  onClick={() => setIsOpen(false)}
                >
                  Get Quote
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar; 