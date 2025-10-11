import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView() {
  useEffect(() => {
    const map = L.map('map').setView([1.2921, 36.8219], 6); // Kenya coords

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([1.2921, 36.8219])
      .addTo(map)
      .bindPopup('Sample Land Area - Nairobi')
      .openPopup();
  }, []);

  return <div id="map" style={{ height: '400px', width: '100%' }} />;
}
