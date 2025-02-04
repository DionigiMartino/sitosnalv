"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

interface Location {
  position: [number, number];
  name: string;
  address?: string;
  type?: string;
  regione?: string;
  provincia?: string;
  responsabile?: string;
  telefono?: string;
  email?: string;
  pec?: string;
}

interface MapProps {
  center?: [number, number];
  zoom?: number;
  locations?: Location[];
}

const DEFAULT_CENTER: [number, number] = [41.9028, 12.4964];
const DEFAULT_ZOOM = 6;

const MapController = ({
  center,
  zoom,
}: {
  center: LatLngExpression;
  zoom: number;
}) => {
  const map = useMap();

  useEffect(() => {
    if (isValidCoordinates(center)) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

const isValidCoordinates = (coords: any): coords is [number, number] => {
  return (
    Array.isArray(coords) &&
    coords.length === 2 &&
    typeof coords[0] === "number" &&
    typeof coords[1] === "number" &&
    !isNaN(coords[0]) &&
    !isNaN(coords[1]) &&
    coords[0] >= -90 &&
    coords[0] <= 90 &&
    coords[1] >= -180 &&
    coords[1] <= 180
  );
};

const MapComponent = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  locations = [],
}: MapProps) => {
  const [isClient, setIsClient] = useState(false);
  const [validCenter, setValidCenter] =
    useState<[number, number]>(DEFAULT_CENTER);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isValidCoordinates(center)) {
      setValidCenter(center);
    }
  }, [center]);

  useEffect(() => {
    return () => {
      if (mapRef.current?.leafletElement) {
        mapRef.current.leafletElement.remove();
      }
    };
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p>Caricamento mappa...</p>
      </div>
    );
  }

  const customIcon = new Icon({
    iconUrl: "/img/marker.jpg",
    iconSize: [15, 20],
    iconAnchor: [12, 41],
  });

  const validLocations = locations.filter(
    (location) => location?.position && isValidCoordinates(location.position)
  );

  return (
    <MapContainer
      ref={mapRef}
      center={validCenter}
      zoom={zoom}
      className="w-full h-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController center={validCenter} zoom={zoom} />

      {validLocations.map((location, index) => (
        <Marker
          key={`${location.name}-${index}`}
          position={location.position}
          icon={customIcon}
        >
          <Popup>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">{location.name}</h3>
              <div className="space-y-1 text-sm">
                {location.address && <p>{location.address}</p>}
                {location.type && <p>{location.type}</p>}
                {location.regione && <p>Regione: {location.regione}</p>}
                {location.provincia && <p>Provincia: {location.provincia}</p>}
                {location.responsabile && (
                  <p>Responsabile: {location.responsabile}</p>
                )}
                {location.telefono && <p>Telefono: {location.telefono}</p>}
                {location.email && <p>Email: {location.email}</p>}
                {location.pec && <p>PEC: {location.pec}</p>}
              </div>
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${location.position[0]},${location.position[1]}`,
                    "_blank"
                  )
                }
                className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 text-sm transition-colors"
              >
                <MapPin className="h-4 w-4" />
                Apri in Google Maps
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
