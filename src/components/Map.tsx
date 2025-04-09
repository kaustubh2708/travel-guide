'use client';

import dynamic from 'next/dynamic';
import type { Spot } from './MapComponent';

// Create a dynamic map component that only renders on the client side
const DynamicMap = dynamic(
  () => import('./MapComponent').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

export interface MapProps {
  spots: Spot[];
  onSpotClick?: (spot: Spot) => void;
  selectedSpot?: Spot | null;
}

export default function Map(props: MapProps) {
  return <DynamicMap {...props} />;
} 