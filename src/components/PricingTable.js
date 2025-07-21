import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const PricingTable = () => {
  const [showPricing, setShowPricing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDeliveryRate, setSelectedDeliveryRate] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['popular']));

  const pricingData = [
    // Harvesting Equipment
    { type: "Flex and rigid platforms up to 30'", model: "925, 930, 630, 625, 2020, 1010", delivery: "$6", containerized: "$1,500.00", container: "25%" },
    { type: "Flex and rigid platforms over 30'", model: "635, 3062", delivery: "$6", containerized: "$2,000.00", container: "25%" },
    { type: "Draper platforms up to 30'", model: "D60, FD75, D125-130, FD125-130", delivery: "$6", containerized: "$1,500.00", container: "50%" },
    { type: "Draper platforms over 30'", model: "D60, FD75, D135-140, FD135-140", delivery: "$6", containerized: "$2,000.00", container: "50%" },
    { type: "Shelbourne header", model: "CVS, XCV, RSD", delivery: "$6", containerized: "$1,500.00", container: "50%" },
    { type: "Corn header", model: "Various models", delivery: "$6", containerized: "$140 per row", container: "Variable" },
    { type: "Honey Bee header", model: "AF240, AF250 and similar", delivery: "$6", containerized: "$2,500.00", container: "50%+" },
    
    // Combines (Consolidated)
    { type: "Combines - Small Series", model: "560-595R, S-series, STS-series, 5-9 series", delivery: "$10", containerized: "$8,250.00", container: "130%" },
    { type: "Combines - Large Series", model: "9600, 9610, 2388, 2588, 450-485R", delivery: "$10", containerized: "$8,250.00", container: "130%" },
    
    // Tillage Equipment
    { type: "Field cultivators", model: "980, 2210, Tigermate, 200", delivery: "$8", containerized: "$80 per foot", container: "25%" },
    { type: "Row Crop Cultivators", model: "Various models", delivery: "$8", containerized: "$130 per row", container: "25%" },
    { type: "Rotary Hoes", model: "400, 3160", delivery: "$8", containerized: "$45 per foot", container: "25%" },
    { type: "Rippers", model: "Ecolotiger, Dominator, 512", delivery: "$8", containerized: "$315 per shank", container: "33%" },
    { type: "Excelerator/Heavy Disk", model: "Excelerator", delivery: "$8", containerized: "$130 per foot", container: "25%" },
    { type: "Plows", model: "Various models", delivery: "$8", containerized: "$150 per bottom", container: "25%" },
    { type: "Disks", model: "637, 1544", delivery: "$8", containerized: "$110 per foot", container: "25%" },
    { type: "Spike Harrows", model: "Various models", delivery: "$8", containerized: "$60 per foot", container: "25%" },
    
    // Spraying Equipment
    { type: "Self-Propelled sprayer", model: "Various models", delivery: "$10", containerized: "$4,675.00", container: "70%" },
    { type: "Pull-Type sprayer", model: "Various models", delivery: "$10", containerized: "$1,995.00+", container: "50%+" },
    
    // Planting Equipment - Seeders (Consolidated)
    { type: "Seeders - Small Models", model: "1890/1910 < 18m", delivery: "$15", containerized: "$5,400.00", container: "100%" },
    { type: "Seeders - Large Models", model: "1890/1910 > 18m", delivery: "$15", containerized: "$6,200.00", container: "100%" },
    { type: "Seeders - CCS Models", model: "CCS Models", delivery: "$15", containerized: "$4,850.00", container: "100%" },
    { type: "Seeders - 1820/1830", model: "1820/1830", delivery: "$10", containerized: "$5,450.00", container: "120%" },
    { type: "Seeders - 1835", model: "1835", delivery: "$10", containerized: "$5,350.00", container: "100%" },
    { type: "Seeders - 45Ft", model: "45Ft", delivery: "$10", containerized: "$6,750.00", container: "100%" },
    { type: "Seeders - 60Ft", model: "60Ft", delivery: "$10", containerized: "$6,900.00", container: "100%" },
    
    // Planting Equipment - Planters (Consolidated)
    { type: "Planters - Standard Models", model: "3700, 3660, 1770", delivery: "$10", containerized: "$175 per row", container: "100%" },
    { type: "Planters - 3700/3660", model: "3700, 3660", delivery: "$10", containerized: "$165 per row", container: "100%" },
    { type: "Planters - ASD/CCS", model: "ASD, CCS", delivery: "$10", containerized: "$175 per row", container: "100%" },
    { type: "Planters - 1790 (12/23)", model: "1790 Planters 12/23", delivery: "$10", containerized: "$4,150.00", container: "100%" },
    { type: "Planters - 1790 (16/31)", model: "1790 Planters 16/31", delivery: "$10", containerized: "$4,900.00", container: "100%" },
    { type: "Planters - 1780 (12/23)", model: "1780 Planters 12/23", delivery: "$10", containerized: "$4,650.00", container: "100%" },
    { type: "Planters - 1780 (16/31)", model: "1780 Planters 16/31", delivery: "$10", containerized: "$5,450.00", container: "100%" },
    { type: "Planters - DB60 (36 Row)", model: "DB60's 36 Row", delivery: "$10", containerized: "$5,450.00", container: "100%" },
    { type: "Planters - DB60 (47 Row)", model: "DB60's 47 Row", delivery: "$10", containerized: "$5,950.00", container: "100%" },
    { type: "Planters - No-Till", model: "HD, 750", delivery: "$10", containerized: "$145 per foot", container: "100%" },
    { type: "Planters - Standard", model: "455, 3s-3000, 9430", delivery: "$10", containerized: "$125 per foot", container: "100%" },
    
    // Large Equipment
    { type: "Tractors", model: "JD R4045", delivery: "$10", containerized: "$6,350.00", container: "100%+" },
    { type: "Planters - Container Fit", model: "Fits in 40' container", delivery: "$10", containerized: "$6,500.00", container: "100%" },
    { type: "Planters - Multi-Container", model: "Requires multiple containers", delivery: "$10", containerized: "$7,500.00", container: "100%+" }
  ];

  // Most popular equipment (shown first on mobile)
  const popularEquipment = [
    { type: "Combines - Small Series", model: "560-595R, S-series, STS-series, 5-9 series", delivery: "$10", containerized: "$8,250.00", container: "130%" },
    { type: "Combines - Large Series", model: "9600, 9610, 2388, 2588, 450-485R", delivery: "$10", containerized: "$8,250.00", container: "130%" },
    { type: "Planters - Standard Models", model: "3700, 3660, 1770", delivery: "$10", containerized: "$175 per row", container: "100%" },
    { type: "Self-Propelled sprayer", model: "Various models", delivery: "$10", containerized: "$4,675.00", container: "70%" },
    { type: "Tractors", model: "JD R4045", delivery: "$10", containerized: "$6,350.00", container: "100%+" }
  ];

  // Organize equipment by categories for mobile accordion
  const categorizedEquipment = {
    popular: { title: "Most Popular", items: popularEquipment },
    harvesting: { 
      title: "Harvesting Equipment", 
      items: pricingData.filter(item => 
        item.type.includes('platform') || item.type.includes('header') || item.type.includes('Combines')
      )
    },
    tillage: { 
      title: "Tillage Equipment", 
      items: pricingData.filter(item => 
        item.type.includes('cultivator') || item.type.includes('Disk') || item.type.includes('Plow') || 
        item.type.includes('Harrow') || item.type.includes('Ripper')
      )
    },
    spraying: { 
      title: "Spraying Equipment", 
      items: pricingData.filter(item => item.type.includes('sprayer'))
    },
    planting: { 
      title: "Planting Equipment", 
      items: pricingData.filter(item => 
        item.type.includes('Planter') || item.type.includes('Seeder')
      )
    },
    large: { 
      title: "Large Equipment", 
      items: pricingData.filter(item => 
        item.type.includes('Tractor') || item.type.includes('Container')
      )
    }
  };

  const miscellaneousData = [
    { item: "Wheels", price: "$ 200.00" },
    { item: "Head Carts", price: "$ 1,050.00" },
    { item: "Balers", price: "$ 2,200.00" },
    { item: "Lawn Mowers", price: "$ 775.00" },
    { item: "Mover MOCO", price: "$ 1,550.00" }
  ];

  const deliveryRates = [
    { route: "Albion, IA - - Novorossiysk*", lines: "$11,800", soc: "$12,300" },
    { route: "Albion, IA - - Vladivostok*", lines: "$12,585", soc: "$11,825" },
    { route: "Albion, IA - - Busan*", lines: "$5,925", soc: "$6,425" },
    { route: "Hankinson, ND - - Novorossiysk*", lines: "$13,305", soc: "$13,805" },
    { route: "Hankinson, ND - - Vladivostok*", lines: "$13,535", soc: "$12,775" },
    { route: "Charleston, IL - - Novorossiysk*", lines: "$11,600", soc: "$12,100" },
    { route: "Charleston, IL - - Vladivostok*", lines: "$13,835", soc: "$13,075" },
    { route: "Albion, IA - Poti - Kostanay*", lines: "$15,340", soc: "$15,840" },
    { route: "Hankinson, ND -Poti - Kostanay*", lines: "$16,600", soc: "$17,100" },
    { route: "Charleston, IL - Busan*", lines: "$5,325", soc: "$5,825" },
    { route: "Hankinson,ND - Busan*", lines: "$6,775", soc: "$7,275" },
    { route: "Savannah, GA - Novorossiysk*", lines: "$10,500", soc: "$11,050" },
    { route: "Savannah, GA - Busan*", lines: "$6,570", soc: "$7,070" },
    { route: "Chicago, IL - Hong Kong*", lines: "$5,345", soc: "$5,845" },
    { route: "Chicago, IL - Constanta*", lines: "$8,015", soc: "$8,515" },
    { route: "Chicago, IL - Shanghai*", lines: "$6,635", soc: "$7,135" },
    { route: "Chicago, IL - Istanbul - Almaty", lines: "$17,980", soc: "" },
    { route: "Albion, IA -Poti - Almaty", lines: "$14,850", soc: "$15,350" },
    { route: "Hankinson, ND - Poti- Almaty", lines: "$16,100", soc: "$16,600" },
    { route: "Savannah, GA - Vladivostok", lines: "$13,230", soc: "$12,470" },
    { route: "Albion, IA - Chicago, Il - Montevideo", lines: "$7,880", soc: "" },
    { route: "Montreal - Batumi - Kostanay", lines: "$12,150", soc: "" }
  ];

  // Category definitions for filtering
  const categories = {
    all: "All Equipment",
    harvesting: "Harvesting Equipment",
    tillage: "Tillage Equipment", 
    spraying: "Spraying Equipment",
    planting: "Planting Equipment",
    large: "Large Equipment"
  };

  // Delivery rate options for filtering
  const deliveryRateOptions = {
    all: "All Rates",
    "$6": "$6 Delivery",
    "$8": "$8 Delivery", 
    "$10": "$10 Delivery",
    "$15": "$15 Delivery"
  };

  // Filter and search logic
  const filteredPricingData = pricingData.filter(item => {
    const matchesSearch = item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'harvesting' && (item.type.includes('platform') || item.type.includes('header') || item.type.includes('Combines'))) ||
      (selectedCategory === 'tillage' && (item.type.includes('cultivator') || item.type.includes('Disk') || item.type.includes('Plow') || item.type.includes('Harrow') || item.type.includes('Ripper'))) ||
      (selectedCategory === 'spraying' && item.type.includes('sprayer')) ||
      (selectedCategory === 'planting' && (item.type.includes('Planter') || item.type.includes('Seeder'))) ||
      (selectedCategory === 'large' && (item.type.includes('Tractor') || item.type.includes('Container')));

    const matchesDeliveryRate = selectedDeliveryRate === 'all' || item.delivery === selectedDeliveryRate;

    return matchesSearch && matchesCategory && matchesDeliveryRate;
  });

  // Accordion toggle function
  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Mobile Card Component for Pricing Data
  const PricingCard = ({ item, index }) => (
    <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.type}</h3>
        {item.model && (
          <p className="text-xs text-gray-600 mb-2">Models: {item.model}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-600">Delivery:</span>
          <span className="text-xs font-bold text-gray-900">{item.delivery}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-600">Containerized:</span>
          <span className="text-xs font-bold text-blue-600">{item.containerized}</span>
        </div>
        {item.container && (
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-600">Container:</span>
            <span className="text-xs font-medium text-gray-900">{item.container}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section id="pricing" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Transparent Pricing for Our Comprehensive Services
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Explore our competitive rates
          </p>
          
          <button
            onClick={() => setShowPricing(!showPricing)}
            className="bg-blue-600 text-white font-semibold py-4 px-6 sm:px-8 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto text-base sm:text-lg"
          >
            <span>Show Pricing</span>
            {showPricing ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {showPricing && (
          <div className="space-y-8 sm:space-y-12">
            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search equipment or models..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(categories).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Delivery Rate Filter */}
                <div>
                  <select
                    value={selectedDeliveryRate}
                    onChange={(e) => setSelectedDeliveryRate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(deliveryRateOptions).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredPricingData.length} of {pricingData.length} equipment types
              </div>
            </div>

            {/* Main Pricing Section */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                Equipment Pricing
              </h3>
              
              {/* Mobile Accordion (< lg) */}
              <div className="lg:hidden space-y-4">
                {Object.entries(categorizedEquipment).map(([categoryKey, category]) => {
                  const isExpanded = expandedCategories.has(categoryKey);
                  const filteredItems = category.items.filter(item => {
                    const matchesSearch = item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                         item.model.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesDeliveryRate = selectedDeliveryRate === 'all' || item.delivery === selectedDeliveryRate;
                    return matchesSearch && matchesDeliveryRate;
                  });

                  if (filteredItems.length === 0) return null;

                  return (
                    <div key={categoryKey} className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <button
                        onClick={() => toggleCategory(categoryKey)}
                        className="w-full px-6 py-4 bg-blue-600 text-white font-semibold text-left flex items-center justify-between hover:bg-blue-700 transition-colors"
                      >
                        <span>{category.title}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="p-4 space-y-3">
                          {filteredItems.map((item, index) => (
                            <PricingCard key={index} item={item} index={index} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table (>= lg) */}
              <div className="hidden lg:block bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-sm">Type</th>
                        <th className="px-6 py-4 text-left font-semibold text-sm">Model</th>
                        <th className="px-6 py-4 text-left font-semibold text-sm">Price for delivery to warehouse</th>
                        <th className="px-6 py-4 text-left font-semibold text-sm">Price containerized to most countries</th>
                        <th className="px-6 py-4 text-left font-semibold text-sm">% of container used</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPricingData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{item.type}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.model}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.delivery}</td>
                          <td className="px-6 py-4 text-sm font-medium text-blue-600">{item.containerized}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.container}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Miscellaneous and Delivery Rates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Miscellaneous Section */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4">
                  <h3 className="text-lg sm:text-xl font-semibold">Miscellaneous</h3>
                </div>
                
                {/* Mobile Cards */}
                <div className="lg:hidden p-4 space-y-3">
                  {miscellaneousData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-900">{item.item}</span>
                      <span className="font-bold text-blue-600">{item.price}</span>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900 text-sm">Item</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900 text-sm">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {miscellaneousData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{item.item}</td>
                          <td className="px-6 py-4 text-sm font-medium text-blue-600">{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Container Delivery Rates */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4">
                  <h3 className="text-lg sm:text-xl font-semibold">Container Delivery Rates</h3>
                  <p className="text-sm opacity-90 mt-1">Updated per request</p>
                </div>
                
                {/* Mobile Cards */}
                <div className="lg:hidden p-4 space-y-4">
                  {deliveryRates.map((rate, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="font-medium text-gray-900 text-sm mb-2">{rate.route}</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Line's container:</span>
                          <span className="font-medium text-blue-600 ml-1">{rate.lines}</span>
                        </div>
                        {rate.soc && (
                          <div>
                            <span className="text-gray-600">SOC container:</span>
                            <span className="font-medium text-blue-600 ml-1">{rate.soc}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900 text-sm">Route</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900 text-sm">Line's Container</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900 text-sm">SOC Container</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {deliveryRates.map((rate, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{rate.route}</td>
                          <td className="px-6 py-4 text-sm font-medium text-blue-600">{rate.lines}</td>
                          <td className="px-6 py-4 text-sm font-medium text-blue-600">{rate.soc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingTable; 