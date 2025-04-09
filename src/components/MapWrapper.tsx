'use client';

import dynamic from 'next/dynamic';
import { MapProps } from './Map';

const MapComponent = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-lg text-gray-600 dark:text-gray-400">Loading map...</div>
    </div>
  )
});

export default function MapWrapper(props: MapProps) {
  return <MapComponent {...props} />;
} 