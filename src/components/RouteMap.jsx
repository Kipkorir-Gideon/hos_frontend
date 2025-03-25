// RouteMap.js
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

// Custom icons for different markers
const startIcon = L.divIcon({
  className: "custom-icon",
  html: '<div style="background-color: green; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">S</div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const pickupIcon = L.divIcon({
  className: "custom-icon",
  html: '<div style="background-color: blue; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">P</div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const dropoffIcon = L.divIcon({
  className: "custom-icon",
  html: '<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">D</div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const stopIcon = L.divIcon({
  className: "custom-icon",
  html: '<div style="background-color: orange; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">F</div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const RouteMap = ({ start, pickup, dropoff, stops, routeCoordinates, startCoords, pickupCoords, stopCoords, endCoords }) => {
  console.log("RouteMap props:", { start, pickup, dropoff, stops, routeCoordinates, startCoords, pickupCoords, stopCoords, endCoords });
  const center = startCoords || [39.8283, -98.5795];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Route Map</h2>
      <MapContainer
        key={JSON.stringify(routeCoordinates)}
        center={center}
        zoom={4}
        style={{ height: "400px", width: "100%", borderRadius: "8px" }}
        className="shadow-sm"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {routeCoordinates && routeCoordinates.length > 0 ? (
          <Polyline positions={routeCoordinates} color="blue" weight={4} opacity={0.7} />
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600">No route available.</p>
          </div>
        )}
        {start && startCoords && (
          <Marker position={startCoords} icon={startIcon}>
            <Popup>
              <strong>Start:</strong> {start}
            </Popup>
          </Marker>
        )}
        {pickup && pickupCoords && (
          <Marker position={pickupCoords} icon={pickupIcon}>
            <Popup>
              <strong>Pickup:</strong> {pickup}
            </Popup>
          </Marker>
        )}
        {stopCoords && stopCoords.length > 0 && stopCoords.map((stop, index) => {
          if (!stop) return null;
          return (
            <Marker key={index} position={stop} icon={stopIcon}>
              <Popup>
                <strong>{stops[index]?.type || "Stop"}:</strong> {stops[index]?.location || "Unknown"}
              </Popup>
            </Marker>
          );
        })}
        {dropoff && endCoords && (
          <Marker position={endCoords} icon={dropoffIcon}>
            <Popup>
              <strong>Dropoff (End):</strong> {dropoff}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default RouteMap;