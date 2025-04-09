import { useState, useEffect, useRef } from 'react';
import { 
  MapPinIcon, 
  SparklesIcon,
  SunIcon,
  BuildingStorefrontIcon,
  GlobeAltIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface AddLocationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (spot: any) => void;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    country: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    amenity?: string;
    road?: string;
  };
}

const categories = [
  { id: 'LANDMARKS', name: 'Landmarks', icon: MapPinIcon, types: ['tourism', 'historic', 'monument'] },
  { id: 'NATURE', name: 'Nature', icon: SparklesIcon, types: ['natural', 'park', 'leisure'] },
  { id: 'BEACH', name: 'Beach', icon: SunIcon, types: ['beach', 'natural'] },
  { id: 'RESTAURANTS', name: 'Restaurants', icon: BuildingStorefrontIcon, types: ['amenity', 'restaurant'] },
  { id: 'OTHER', name: 'Other', icon: GlobeAltIcon, types: [] }
];

export default function AddLocationForm({ isOpen, onClose, onSubmit }: AddLocationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: '',
    city: '',
    category: '',
    latitude: '',
    longitude: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      setSearchError(null);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);
    setSearchError(null);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`,
          {
            headers: {
              'Accept-Language': 'en-US,en;q=0.9',
              'User-Agent': 'TravelGuide/1.0'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format');
        }

        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSearchError('Failed to fetch locations. Please try again.');
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    // Extract place name (amenity or road name)
    const placeName = suggestion.address?.amenity || 
                     suggestion.address?.road || 
                     suggestion.display_name.split(',')[0];
    
    // Extract city with fallbacks
    const city = suggestion.address?.city || 
                 suggestion.address?.town || 
                 suggestion.address?.village || 
                 '';
    
    // Extract state with fallback
    const state = suggestion.address?.state || '';
    
    // Format display name
    const formattedDisplayName = [
      placeName,
      city,
      state,
      suggestion.address?.country || ''
    ].filter(Boolean).join(', ');

    // Determine category based on place type
    const category = categories.find(cat => 
      cat.types.some(type => suggestion.display_name.toLowerCase().includes(type))
    ) || categories[categories.length - 1];

    setFormData({
      ...formData,
      name: placeName,
      country: suggestion.address?.country || '',
      city: city,
      category: category.id,
      latitude: suggestion.lat,
      longitude: suggestion.lon
    });

    setSearchQuery(formattedDisplayName);
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSearchError(null);

    try {
      const response = await fetch('/api/spots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add location');
      }

      const newSpot = await response.json();
      onSubmit(newSpot);
      onClose();
    } catch (error) {
      console.error('Error adding location:', error);
      setSearchError(error instanceof Error ? error.message : 'Failed to add location. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Add New Location</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {searchError && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">
                {searchError}
              </p>
            </div>
          )}

          {/* Location Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Location
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                disabled={isSearching}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         placeholder-gray-500 dark:placeholder-gray-400
                         disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={isSearching ? "Searching..." : "Search for a location..."}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            
            {/* Location Suggestions */}
            {showSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 max-h-60 overflow-auto">
                {isSearching ? (
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    Searching...
                  </div>
                ) : searchError ? (
                  <div className="px-4 py-2 text-sm text-red-500 dark:text-red-400">
                    {searchError}
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => {
                    // Format location details with fallbacks
                    const placeName = suggestion.address?.amenity || 
                                    suggestion.address?.road || 
                                    suggestion.display_name.split(',')[0];
                    const city = suggestion.address?.city || 
                               suggestion.address?.town || 
                               suggestion.address?.village || 
                               '';
                    
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleLocationSelect(suggestion)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 
                                 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600"
                      >
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {placeName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {[city, suggestion.address?.state || ''].filter(Boolean).join(', ')}
                        </div>
                      </button>
                    );
                  })
                ) : searchQuery.length >= 3 ? (
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    No locations found
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Tell us about this amazing place..."
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: category.id })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors
                             ${formData.category === category.id
                               ? 'bg-blue-500 text-white'
                               : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                             }`}
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coordinates (Read-only) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.latitude}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.longitude}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 
                       hover:bg-blue-600 rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 