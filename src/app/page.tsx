'use client';

import { useEffect, useState } from 'react';
import MapWrapper from '@/components/MapWrapper';
import { Spot } from '@/components/Map';
import SpotList from '@/components/SpotList';
import AddLocationForm from '@/components/AddLocationForm';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  useEffect(() => {
    fetch('/api/spots')
      .then(res => res.json())
      .then(data => {
        setSpots(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching spots:', error);
        setLoading(false);
      });
  }, []);

  const handleSpotClick = (spot: Spot) => {
    setSelectedSpot(spot);
  };

  const handleAddSpot = (newSpot: Spot) => {
    setSpots(prevSpots => [newSpot, ...prevSpots]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <MapWrapper 
        spots={spots} 
        onSpotClick={setSelectedSpot}
        selectedSpot={selectedSpot}
      />
      <SpotList 
        spots={spots} 
        onSpotClick={handleSpotClick}
        selectedSpot={selectedSpot}
      />
      
      {/* Add Location Button */}
      <button
        onClick={() => setIsAddFormOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-500 text-white rounded-full shadow-lg
                 hover:bg-blue-600 transition-colors z-40 flex items-center justify-center
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 dark:focus:ring-offset-gray-900"
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      {/* Add Location Form */}
      <AddLocationForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSubmit={handleAddSpot}
      />
    </main>
  );
}
