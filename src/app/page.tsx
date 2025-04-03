'use client';

import { useEffect, useState } from 'react';
import SpotList from '@/components/SpotList';
import Map from '@/components/Map';

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

export default function Home() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      console.log('Fetching spots...');
      const response = await fetch('/api/spots');
      if (!response.ok) throw new Error('Failed to fetch spots');
      const data = await response.json();
      console.log('Fetched spots:', data);
      setSpots(data);
      setError(null);
    } catch (err) {
      setError('Failed to load travel spots');
      console.error('Error fetching spots:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpotClick = (spot: Spot) => {
    setSelectedSpot(spot);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-white dark:bg-gray-900">
      <Map 
        spots={spots} 
        onSpotClick={handleSpotClick}
        selectedSpot={selectedSpot}
      />
      <SpotList 
        spots={spots} 
        onSpotClick={handleSpotClick}
        selectedSpot={selectedSpot}
      />
    </main>
  );
}
