import React from 'react';
import MapView from '../components/MapView';

export default function Home() {
  return (
    <div>
      <h2>Welcome to LandWatch 🌱</h2>
      <p>Monitor, analyze, and restore degraded lands using AI and GIS.</p>
      <MapView />
    </div>
  );
}
