'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface Spot {
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

export interface MapProps {
  spots: Spot[];
  onSpotClick?: (spot: Spot) => void;
  selectedSpot?: Spot | null;
}

// Fix for default marker icon
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map updates when selected spot changes
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Cleanup function to stop any ongoing animations
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      map.stop();
    };
  }, [map]);

  useEffect(() => {
    if (isAnimating) return;

    const animate = () => {
      setIsAnimating(true);
      
      // First, zoom out to get a better view of the transition
      map.flyTo(center, 4, {
        duration: 1
      });

      // Then, fly to the new location with the target zoom level
      setTimeout(() => {
        map.flyTo(center, zoom, {
          duration: 1.5,
          onEnd: () => {
            setIsAnimating(false);
          }
        });
      }, 1000);
    };

    // Stop any ongoing animation before starting a new one
    map.stop();
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animate();

    return () => {
      map.stop();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [center, zoom, map, isAnimating]);

  return null;
}

export default function MapComponent({ spots, onSpotClick, selectedSpot }: MapProps) {
  const mapRef = useRef<L.Map>(null);
  const defaultCenter: [number, number] = [20, 0];
  const defaultZoom = 2;

  // Calculate center and zoom based on selected spot
  const center = selectedSpot 
    ? [selectedSpot.latitude, selectedSpot.longitude] as [number, number]
    : defaultCenter;
  const zoom = selectedSpot ? 8 : defaultZoom;

  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <MapContainer
        ref={mapRef}
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        dragging={true}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.latitude, spot.longitude]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => {
                if (onSpotClick) {
                  onSpotClick(spot);
                }
              }
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{spot.name}</h3>
                <p className="text-sm text-gray-600">{spot.city}, {spot.country}</p>
                <p className="text-sm mt-1">{spot.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 