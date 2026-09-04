import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default icon paths for Leaflet markers
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
import { useState, useEffect, useRef } from "react";

// Optional: custom icon import if needed
// import L from "leaflet";
// const customIcon = new L.Icon({
//   iconUrl: "/path/to/custom-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

import "leaflet/dist/leaflet.css";

const CampusMap = () => {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);

  const LOCATIONS = [
    { name: "Main Gate", position: [23.84023, 91.42087] }, // approximate campus entrance
    { name: "Administrative Building", position: [23.84023, 91.42087] }, // placeholder (same as center)
    { name: "Central Library", position: [23.841977, 91.426207] },
    { name: "CSE Department", position: [23.84023, 91.42087] }, // placeholder
    { name: "Academic Block", position: [23.84023, 91.42087] }, // placeholder
    { name: "Hostel", position: [23.84023, 91.42087] }, // placeholder
    { name: "Canteen", position: [23.84023, 91.42087] }, // placeholder
    { name: "Sports Ground", position: [23.84023, 91.42087] }, // placeholder
  ];

  const [position] = useState([23.84023, 91.42087]); // NIT Agartala coordinates
  const [userPos, setUserPos] = useState(null);
  const [destQuery, setDestQuery] = useState('');
  const [venueQuery, setVenueQuery] = useState('');
  const [venueMarkers, setVenueMarkers] = useState([]);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn('Geolocation error:', err)
      );
    }
  }, []);

  const handleRouteSearch = () => {
    if (!mapRef.current) return;
    const start = userPos || position;
    if (!destQuery) return;
    // Resolve destination via Nominatim
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const destLatLng = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          // Remove previous routing control if any
          if (routingControlRef.current) {
            routingControlRef.current.remove();
          }
          // @ts-ignore
          const L = window.L;
          routingControlRef.current = L.Routing.control({
            waypoints: [L.latLng(start[0], start[1]), L.latLng(destLatLng[0], destLatLng[1])],
            router: L.Routing.osrmv1({
              serviceUrl: 'https://router.project-osrm.org/route/v1'
            }),
            show: false,
            lineOptions: {
              styles: [{ color: 'blue', opacity: 0.6, weight: 4 }]
            }
          }).addTo(mapRef.current);
        }
      })
      .catch(console.error);
  };

  const handleVenueSearch = () => {
    if (!venueQuery) return;
    const bounds = mapRef.current?.getBounds();
    const viewbox = bounds ? `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}` : '';
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(venueQuery)}&viewbox=${viewbox}&bounded=1&limit=10`)
      .then((res) => res.json())
      .then((results) => {
        const markers = results.map((r) => ({
          name: r.display_name,
          position: [parseFloat(r.lat), parseFloat(r.lon)]
        }));
        setVenueMarkers(markers);
      })
      .catch(console.error);
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="p-2 flex gap-2 bg-gray-100">
        <input
          type="text"
          placeholder="Destination (e.g., NIT Agartala)"
          value={destQuery}
          onChange={(e) => setDestQuery(e.target.value)}
          className="border p-1 flex-1"
        />
        <button onClick={handleRouteSearch} className="bg-blue-500 text-white px-3 py-1">Route</button>
        <input
          type="text"
          placeholder="Search venue (e.g., cafe)"
          value={venueQuery}
          onChange={(e) => setVenueQuery(e.target.value)}
          className="border p-1 flex-1"
        />
        <button onClick={handleVenueSearch} className="bg-green-500 text-white px-3 py-1">Search</button>
      </div>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
        style={{ height: "calc(100% - 48px)", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* User location marker */}
        {userPos && (
          <Marker position={userPos}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        {/* Campus location markers */}
        {LOCATIONS.map((loc) => (
          <Marker key={loc.name} position={loc.position}>
            <Popup>{loc.name}</Popup>
          </Marker>
        ))}
        {/* Venue markers */}
        {venueMarkers.map((v, idx) => (
          <Marker key={idx} position={v.position}>
            <Popup>{v.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CampusMap;
