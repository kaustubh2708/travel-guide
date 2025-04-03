import { useState, useEffect } from 'react';
import { 
  MapPinIcon, 
  GlobeAltIcon, 
  BuildingOfficeIcon, 
  SparklesIcon,
  CameraIcon as CameraIconSolid,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

interface Spot {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface SpotListProps {
  spots: Spot[];
  onSpotClick: (spot: Spot) => void;
  selectedSpot?: Spot | null;
}

const categoryIcons: { [key: string]: any } = {
  LANDMARKS: MapPinIcon,
  CITY: BuildingOfficeIcon,
  NATURE: SparklesIcon,
  BEACH: SunIcon,
  CULTURE: CameraIconSolid,
  OTHER: GlobeAltIcon
};

const categoryColors: { [key: string]: string } = {
  LANDMARKS: 'text-blue-500 dark:text-blue-400',
  CITY: 'text-green-500 dark:text-green-400',
  NATURE: 'text-emerald-500 dark:text-emerald-400',
  BEACH: 'text-cyan-500 dark:text-cyan-400',
  CULTURE: 'text-purple-500 dark:text-purple-400',
  OTHER: 'text-gray-500 dark:text-gray-400'
};

export default function SpotList({ spots, onSpotClick, selectedSpot }: SpotListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Get unique countries from spots
  const countries = ['all', ...new Set(spots.map(spot => spot.country))].sort();
  const categories = ['all', ...new Set(spots.map(spot => spot.category))];

  // Get cities for selected country
  const cities = selectedCountry === 'all' 
    ? ['all']
    : ['all', ...new Set(spots
        .filter(spot => spot.country === selectedCountry)
        .map(spot => spot.city)
      )].sort();

  // Reset city selection when country changes
  useEffect(() => {
    setSelectedCity('all');
  }, [selectedCountry]);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredSpots = spots.filter(spot => {
    const matchesCategory = selectedCategory === 'all' || spot.category === selectedCategory;
    const matchesCountry = selectedCountry === 'all' || spot.country === selectedCountry;
    const matchesCity = selectedCity === 'all' || spot.city === selectedCity;
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         spot.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         spot.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCountry && matchesCity && matchesSearch;
  });

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-white dark:bg-gray-900 shadow-lg overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Travel Spots</h2>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search spots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Country Filter */}
        <div className="mb-4">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {countries.map(country => (
              <option key={country} value={country}>
                {country === 'all' ? 'All Countries' : country}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter - Only show when a country is selected */}
        {selectedCountry !== 'all' && (
          <div className="mb-4">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {cities.map(city => (
                <option key={city} value={city}>
                  {city === 'all' ? 'All Cities' : city}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category === 'all' ? 'All Spots' : category}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredSpots.map(spot => {
          const Icon = categoryIcons[spot.category] || GlobeAltIcon;
          const colorClass = categoryColors[spot.category] || 'text-gray-500 dark:text-gray-400';
          
          return (
            <div
              key={spot.id}
              onClick={() => onSpotClick(spot)}
              className={`p-4 cursor-pointer transition-colors ${
                selectedSpot?.id === spot.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 ${colorClass}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {spot.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {spot.city}, {spot.country}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {spot.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedSpot?.id === spot.id
                        ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                    }`}>
                      {spot.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 