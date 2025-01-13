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
      center={center || [41.9028, 12.4964]}
      zoom={zoom || 6}
      className="w-full h-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locations?.map((location, index) =>
        location.position &&
        Array.isArray(location.position) &&
        location.position.length === 2 ? (
          <Marker key={index} position={location.position} icon={customIcon}>
            <Popup>
              <div>
                <h3 className="font-bold">{location.name}</h3>
                <p>{location.address}</p>
                <p>{location.type}</p>
                <p>Regione: {location.regione}</p>
                <p>Provincia: {location.provincia}</p>
                <p>Responsabile: {location.responsabile}</p>
                <p>Telefono: {location.telefono}</p>
                <p>Email: {location.email}</p>
                <p>PEC: {location.pec}</p>
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default MapComponent;
