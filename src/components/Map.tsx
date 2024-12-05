import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const MapController = ({ center, zoom }: any) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom]);

  return null;
};

const MapComponent = ({ center, zoom, locations }: any) => {
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.leafletElement?.setView(center, zoom);
    }
  }, [center, zoom]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.leafletElement.remove();
      }
    };
  }, []);

  if (!isClient) return <div className="w-full h-full bg-gray-100" />;

  const customIcon = new Icon({
    iconUrl: "/img/marker.jpg",
    iconSize: [15, 20],
    iconAnchor: [12, 41],
  });

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      key="map"
      ref={mapRef}
    >
      <MapController center={center} zoom={zoom} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location: any, index: number) => (
        <Marker
          key={`marker-${index}`}
          position={location.position}
          icon={customIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{location.name}</h3>
              <p>{location.address}</p>
              <p>CAP: {location.cap}</p>
              <p className="text-sm text-gray-600">{location.type}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
