import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  useEffect(() => {
    // Check if map is already initialized
    let map = L.map("map", {
      center: [1.2921, 36.8219],
      zoom: 6,
      layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }),
      ],
    });

    L.marker([1.2921, 36.8219])
      .addTo(map)
      .bindPopup("Sample Land Area - Nairobi")
      .openPopup();

    // Clean up map when component unmounts
    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: "400px", width: "100%" }} />;
}
