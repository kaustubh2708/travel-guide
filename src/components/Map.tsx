import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

interface MapProps {
  spots: Spot[];
  onSpotClick?: (spot: Spot) => void;
  selectedSpot?: Spot | null;
}

// Fix for default marker icons in react-leaflet
const icon = L.icon({
  iconUrl: '/marker-icon.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// Component to handle map updates when selected spot changes
function ChangeView({ center, zoom, previousSpot, currentSpot }: { 
  center: [number, number]; 
  zoom: number;
  previousSpot: Spot | null;
  currentSpot: Spot | null;
}) {
  const map = useMap();
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (!previousSpot || !currentSpot) {
      map.setView(center, zoom);
      return;
    }

    const animate = async () => {
      // Step 1: Zoom out from previous spot
      await new Promise<void>(resolve => {
        map.flyTo(
          [previousSpot.latitude, previousSpot.longitude],
          4,
          {
            duration: 1.5
          }
        );
        setTimeout(resolve, 1500);
      });

      // Step 2: Move to new country
      await new Promise<void>(resolve => {
        map.flyTo(
          [currentSpot.latitude, currentSpot.longitude],
          4,
          {
            duration: 2
          }
        );
        setTimeout(resolve, 2000);
      });

      // Step 3: Zoom in to new spot
      map.flyTo(
        [currentSpot.latitude, currentSpot.longitude],
        8,
        {
          duration: 1.5
        }
      );
    };

    animate();
  }, [map, previousSpot, currentSpot, center, zoom]);

  return null;
}

export default function Map({ spots, onSpotClick, selectedSpot }: MapProps) {
  const mapRef = useRef<L.Map>(null);
  const previousSpotRef = useRef<Spot | null>(null);
  const defaultCenter: [number, number] = [20, 0];
  const defaultZoom = 2;

  // Update previous spot when selected spot changes
  useEffect(() => {
    if (selectedSpot && selectedSpot !== previousSpotRef.current) {
      previousSpotRef.current = selectedSpot;
    }
  }, [selectedSpot]);

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
      >
        <ChangeView 
          center={center} 
          zoom={zoom} 
          previousSpot={previousSpotRef.current}
          currentSpot={selectedSpot || null}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.latitude, spot.longitude]}
            icon={icon}
            eventHandlers={{
              click: () => {
                if (onSpotClick) {
                  onSpotClick(spot);
                }
              }
            }}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{spot.name}</h3>
                <p>{spot.city}, {spot.country}</p>
                <p className="text-sm text-gray-600">{spot.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 